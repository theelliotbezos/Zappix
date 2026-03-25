import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";
import { paystackService } from "@/server/services/paystack";
import { paystackTransferService } from "@/server/services/paystack-transfer";
import { APP_URL } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";

export const billingRouter = createTRPCRouter({
  /** Get the current user's subscription and payment history. */
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.subscription.findUnique({
      where: { userId: ctx.user.id },
      include: {
        plan: true,
        payments: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
  }),

  /** Get available plans for upgrade/downgrade. */
  getPlans: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.plan.findMany({
      orderBy: { priceMonthly: "asc" },
    });
  }),

  /** Initialize a Paystack checkout for subscription. */
  initializeCheckout: protectedProcedure
    .input(
      z.object({
        planSlug: z.string(),
        billingCycle: z.enum(["MONTHLY", "YEARLY"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.plan.findUnique({
        where: { slug: input.planSlug },
      });

      if (!plan) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found." });
      }

      const amount =
        input.billingCycle === "MONTHLY"
          ? plan.priceMonthly
          : plan.priceYearly;

      const paystackPlanCode =
        input.billingCycle === "MONTHLY"
          ? plan.paystackPlanCodeMonthly
          : plan.paystackPlanCodeYearly;

      const reference = `sub_${ctx.user.id}_${Date.now()}`;

      const result = await paystackService.initializeTransaction({
        email: ctx.user.email,
        amount,
        plan: paystackPlanCode ?? undefined,
        reference,
        callbackUrl: `${APP_URL}/app/settings/billing?ref=${reference}`,
        metadata: {
          userId: ctx.user.id,
          planSlug: input.planSlug,
          billingCycle: input.billingCycle,
        },
      });

      // Create a pending payment record
      const existingSub = await ctx.prisma.subscription.findUnique({
        where: { userId: ctx.user.id },
      });

      if (existingSub) {
        await ctx.prisma.payment.create({
          data: {
            subscriptionId: existingSub.id,
            amount,
            paystackReference: reference,
            status: "PENDING",
          },
        });
      } else {
        // Create subscription and payment together
        const now = new Date();
        const periodEnd = new Date(now);
        if (input.billingCycle === "MONTHLY") {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        } else {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        }

        await ctx.prisma.subscription.create({
          data: {
            userId: ctx.user.id,
            planId: plan.id,
            status: "ACTIVE",
            billingCycle: input.billingCycle,
            paystackCustomerCode: ctx.user.email,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            payments: {
              create: {
                amount,
                paystackReference: reference,
                status: "PENDING",
              },
            },
          },
        });
      }

      return {
        authorizationUrl: result.data.authorization_url,
        reference: result.data.reference,
        plan: plan.name,
        amount,
      };
    }),

  /** Verify a payment after callback. */
  verifyPayment: protectedProcedure
    .input(z.object({ reference: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await paystackService.verifyTransaction(input.reference);

      if (result.data.status === "success") {
        await ctx.prisma.payment.updateMany({
          where: { paystackReference: input.reference },
          data: {
            status: "SUCCESS",
            paidAt: new Date(),
          },
        });

        // Update subscription status
        const payment = await ctx.prisma.payment.findFirst({
          where: { paystackReference: input.reference },
          include: { subscription: true },
        });

        if (payment) {
          await ctx.prisma.subscription.update({
            where: { id: payment.subscriptionId },
            data: {
              status: "ACTIVE",
              paystackCustomerCode:
                result.data.customer.customer_code ?? undefined,
            },
          });
        }

        return { success: true, status: "verified" };
      }

      return { success: false, status: result.data.status };
    }),

  /** Cancel current subscription. */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await ctx.prisma.subscription.findUnique({
      where: { userId: ctx.user.id },
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No active subscription found.",
      });
    }

    if (
      subscription.paystackSubscriptionCode &&
      subscription.paystackCustomerCode
    ) {
      try {
        await paystackService.disableSubscription({
          code: subscription.paystackSubscriptionCode,
          token: subscription.paystackCustomerCode,
        });
      } catch (error) {
        console.error("Failed to disable Paystack subscription:", error);
      }
    }

    return ctx.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });
  }),

  /** Add bank account for Paystack Transfer payouts. */
  addBankAccount: protectedProcedure
    .input(
      z.object({
        bankCode: z.string(),
        accountNumber: z.string().length(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify account via Paystack API
      const resolved = await paystackTransferService.resolveAccountNumber(
        input.accountNumber,
        input.bankCode
      );

      if (!resolved.status) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not verify this bank account. Please check the details.",
        });
      }

      const accountName = resolved.data.account_name;

      // Create transfer recipient
      const recipient = await paystackTransferService.createTransferRecipient({
        name: accountName,
        accountNumber: input.accountNumber,
        bankCode: input.bankCode,
      });

      // Get bank name from the banks list
      const banks = await paystackService.listBanks();
      const bank = banks.data.find((b) => b.code === input.bankCode);
      const bankName = bank?.name ?? input.bankCode;

      return ctx.prisma.bankAccount.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          bankName,
          bankCode: input.bankCode,
          accountNumber: input.accountNumber,
          accountName,
          paystackRecipientCode: recipient.data.recipient_code,
        },
        update: {
          bankName,
          bankCode: input.bankCode,
          accountNumber: input.accountNumber,
          accountName,
          paystackRecipientCode: recipient.data.recipient_code,
        },
      });
    }),

  /** List available Nigerian banks. */
  listBanks: protectedProcedure.query(async () => {
    const result = await paystackService.listBanks();
    return result.data
      .filter((bank) => bank.active)
      .map((bank) => ({ name: bank.name, code: bank.code }));
  }),
});
