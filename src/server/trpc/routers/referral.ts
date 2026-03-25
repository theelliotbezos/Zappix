import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/server/inngest/client";
import {
  MIN_WITHDRAWAL_KOBO,
  REFERRAL_COMMISSION_PERCENT,
} from "@/lib/constants";

export const referralRouter = createTRPCRouter({
  /** Get the current user's referral dashboard data. */
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const referralCode = await ctx.prisma.referralCode.findUnique({
      where: { userId: ctx.user.id },
    });

    const referrals = await ctx.prisma.referral.findMany({
      where: { referrerId: ctx.user.id },
      include: {
        referredUser: { select: { name: true, email: true, createdAt: true } },
        commissions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const commissions = await ctx.prisma.commission.findMany({
      where: { referral: { referrerId: ctx.user.id } },
    });

    const availableBalance = commissions
      .filter((c) => c.status === "AVAILABLE")
      .reduce((sum, c) => sum + c.amount, 0);

    const pendingBalance = commissions
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + c.amount, 0);

    const totalEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
    const totalWithdrawn = commissions
      .filter((c) => c.status === "WITHDRAWN")
      .reduce((sum, c) => sum + c.amount, 0);

    // Get withdrawal history
    const withdrawals = await ctx.prisma.withdrawal.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return {
      referralCode: referralCode?.code ?? null,
      referralCount: referrals.length,
      referrals: referrals.map((r) => ({
        id: r.id,
        referredUser: r.referredUser,
        status: r.status,
        createdAt: r.createdAt,
        totalCommission: r.commissions.reduce((sum, c) => sum + c.amount, 0),
      })),
      availableBalance,
      pendingBalance,
      totalEarned,
      totalWithdrawn,
      withdrawals,
      commissionPercent: REFERRAL_COMMISSION_PERCENT,
      minWithdrawal: MIN_WITHDRAWAL_KOBO,
    };
  }),

  /** Track a referral signup. Called when a user signs up with a referral code. */
  trackSignup: protectedProcedure
    .input(z.object({ referralCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Find the referral code
      const code = await ctx.prisma.referralCode.findUnique({
        where: { code: input.referralCode },
        include: { user: true },
      });

      if (!code) {
        return { success: false, message: "Invalid referral code." };
      }

      // Prevent self-referral
      if (code.userId === ctx.user.id) {
        return { success: false, message: "Cannot refer yourself." };
      }

      // Check if already referred
      const existing = await ctx.prisma.referral.findUnique({
        where: { referredUserId: ctx.user.id },
      });

      if (existing) {
        return { success: false, message: "Already referred by someone." };
      }

      await ctx.prisma.referral.create({
        data: {
          referralCodeId: code.id,
          referrerId: code.userId,
          referredUserId: ctx.user.id,
          status: "SIGNED_UP",
        },
      });

      return { success: true, message: "Referral tracked successfully." };
    }),

  /** Track a referral conversion (when referred user subscribes). */
  trackConversion: protectedProcedure
    .input(
      z.object({
        referredUserId: z.string(),
        subscriptionAmount: z.number(), // in kobo
      })
    )
    .mutation(async ({ ctx, input }) => {
      const referral = await ctx.prisma.referral.findUnique({
        where: { referredUserId: input.referredUserId },
      });

      if (!referral) {
        return { success: false };
      }

      // Calculate 25% commission
      const commissionAmount = Math.floor(
        (input.subscriptionAmount * REFERRAL_COMMISSION_PERCENT) / 100
      );

      // Update referral status
      await ctx.prisma.referral.update({
        where: { id: referral.id },
        data: { status: "SUBSCRIBED" },
      });

      // Create commission (pending for 30-day hold)
      await ctx.prisma.commission.create({
        data: {
          referralId: referral.id,
          amount: commissionAmount,
          status: "PENDING",
        },
      });

      return { success: true, commissionAmount };
    }),

  /** Request a withdrawal to bank account. */
  requestWithdrawal: protectedProcedure
    .input(z.object({ amount: z.number().min(MIN_WITHDRAWAL_KOBO) }))
    .mutation(async ({ ctx, input }) => {
      // Verify bank account exists
      const bankAccount = await ctx.prisma.bankAccount.findUnique({
        where: { userId: ctx.user.id },
      });

      if (!bankAccount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Please add your bank account details before requesting a withdrawal.",
        });
      }

      // Verify available balance
      const availableCommissions = await ctx.prisma.commission.findMany({
        where: {
          referral: { referrerId: ctx.user.id },
          status: "AVAILABLE",
        },
      });

      const availableBalance = availableCommissions.reduce(
        (sum, c) => sum + c.amount,
        0
      );

      if (availableBalance < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient available balance for this withdrawal.",
        });
      }

      // Mark commissions as withdrawn (FIFO)
      let remaining = input.amount;
      for (const commission of availableCommissions) {
        if (remaining <= 0) break;

        if (commission.amount <= remaining) {
          await ctx.prisma.commission.update({
            where: { id: commission.id },
            data: { status: "WITHDRAWN" },
          });
          remaining -= commission.amount;
        }
      }

      // Create withdrawal record
      const withdrawal = await ctx.prisma.withdrawal.create({
        data: {
          userId: ctx.user.id,
          amount: input.amount,
          status: "PROCESSING",
        },
      });

      // Trigger Inngest job to process payout via Paystack Transfer
      await inngest.send({
        name: "payout/process",
        data: { withdrawalId: withdrawal.id },
      });

      return withdrawal;
    }),

  /** Get withdrawal history. */
  withdrawalHistory: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.withdrawal.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),
});
