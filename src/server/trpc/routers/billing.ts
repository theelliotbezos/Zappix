import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";

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

      // TODO: Call Paystack API to initialize transaction
      // Return the authorization URL for the user to complete payment

      return {
        authorizationUrl: "https://paystack.com/pay/...",
        reference: "ref_...",
        plan: plan.name,
        amount:
          input.billingCycle === "MONTHLY"
            ? plan.priceMonthly
            : plan.priceYearly,
      };
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
      // TODO: Verify account via Paystack API
      // POST /bank/resolve?account_number=XXX&bank_code=XXX
      // Then create transfer recipient
      // POST /transferrecipient

      const accountName = "Verified Account Name"; // From Paystack
      const recipientCode = "RCP_xxx"; // From Paystack

      return ctx.prisma.bankAccount.upsert({
        where: { userId: ctx.user.id },
        create: {
          userId: ctx.user.id,
          bankName: input.bankCode, // TODO: Map code to name
          bankCode: input.bankCode,
          accountNumber: input.accountNumber,
          accountName,
          paystackRecipientCode: recipientCode,
        },
        update: {
          bankCode: input.bankCode,
          accountNumber: input.accountNumber,
          accountName,
          paystackRecipientCode: recipientCode,
        },
      });
    }),
});
