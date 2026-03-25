import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";

export const analyticsRouter = createTRPCRouter({
  /** Get analytics overview for a date range. */
  overview: protectedProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      const snapshots = await ctx.prisma.analyticsSnapshot.findMany({
        where: {
          userId: ctx.user.id,
          date: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        },
        orderBy: { date: "asc" },
      });

      // Aggregate totals
      const totals = snapshots.reduce(
        (acc, snap) => ({
          statusesPosted: acc.statusesPosted + snap.statusesPosted,
          broadcastsSent: acc.broadcastsSent + snap.broadcastsSent,
          messagesReceived: acc.messagesReceived + snap.messagesReceived,
          contactsGained: acc.contactsGained + snap.contactsGained,
          adRevenue: acc.adRevenue + snap.adRevenue,
        }),
        {
          statusesPosted: 0,
          broadcastsSent: 0,
          messagesReceived: 0,
          contactsGained: 0,
          adRevenue: 0,
        }
      );

      return { snapshots, totals };
    }),

  /** Get dashboard KPIs. */
  kpis: protectedProcedure.query(async ({ ctx }) => {
    const [
      totalContacts,
      totalBroadcasts,
      totalStatuses,
      connectedAccounts,
    ] = await Promise.all([
      ctx.prisma.contact.count({ where: { userId: ctx.user.id } }),
      ctx.prisma.broadcast.count({ where: { userId: ctx.user.id } }),
      ctx.prisma.scheduledStatus.count({
        where: { userId: ctx.user.id, status: "POSTED" },
      }),
      ctx.prisma.whatsAppAccount.count({
        where: { userId: ctx.user.id, status: "CONNECTED" },
      }),
    ]);

    return {
      totalContacts,
      totalBroadcasts,
      totalStatuses,
      connectedAccounts,
    };
  }),
});
