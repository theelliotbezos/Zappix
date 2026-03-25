import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";
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
      include: { referredUser: { select: { name: true, email: true } } },
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

    return {
      referralCode: referralCode?.code ?? null,
      referralCount: referrals.length,
      referrals,
      availableBalance,
      pendingBalance,
      totalEarned,
      commissionPercent: REFERRAL_COMMISSION_PERCENT,
      minWithdrawal: MIN_WITHDRAWAL_KOBO,
    };
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

      // Create withdrawal record
      const withdrawal = await ctx.prisma.withdrawal.create({
        data: {
          userId: ctx.user.id,
          amount: input.amount,
          status: "PROCESSING",
        },
      });

      // TODO: Trigger Inngest job to process payout via Paystack Transfer

      return withdrawal;
    }),
});
