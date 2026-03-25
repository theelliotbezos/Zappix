import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";

export const userRouter = createTRPCRouter({
  /** Get the current user's profile with subscription info. */
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        subscription: { include: { plan: true } },
        referralCode: true,
        bankAccount: true,
      },
    });
  }),

  /** Update the current user's profile. */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        phone: z.string().max(20).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
      });
    }),

  /** Get usage stats relative to plan limits. */
  usageStats: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.prisma.subscription.findUnique({
      where: { userId: ctx.user.id },
      include: { plan: true },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [accounts, contacts, broadcasts, statuses, teamMembers, adSlots] =
      await Promise.all([
        ctx.prisma.whatsAppAccount.count({ where: { userId: ctx.user.id } }),
        ctx.prisma.contact.count({ where: { userId: ctx.user.id } }),
        ctx.prisma.broadcast.count({
          where: {
            userId: ctx.user.id,
            createdAt: { gte: startOfMonth },
            status: { not: "CANCELLED" },
          },
        }),
        ctx.prisma.scheduledStatus.count({
          where: { userId: ctx.user.id, createdAt: { gte: startOfMonth } },
        }),
        ctx.prisma.teamMember.count({ where: { userId: ctx.user.id } }),
        ctx.prisma.adSlot.count({ where: { userId: ctx.user.id } }),
      ]);

    const plan = subscription?.plan;

    return {
      accounts: {
        current: accounts,
        limit: plan?.maxWhatsappAccounts ?? 1,
      },
      contacts: {
        current: contacts,
        limit: plan?.maxContacts ?? 7_500,
      },
      broadcasts: {
        current: broadcasts,
        limit: plan?.maxBroadcastsPerMonth ?? 15,
      },
      statuses: {
        current: statuses,
        limit: plan?.maxStatusPostsPerMonth ?? 45,
      },
      teamMembers: {
        current: teamMembers,
        limit: plan?.maxTeamMembers ?? 1,
      },
      adSlots: {
        current: adSlots,
        limit: plan?.maxAdSlots ?? 2,
      },
      planName: plan?.name ?? "Starter",
    };
  }),
});
