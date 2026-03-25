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

      // Format chart data for the frontend (Recharts format)
      const chartData = snapshots.map((snap) => ({
        date: snap.date.toISOString().split("T")[0],
        statusesPosted: snap.statusesPosted,
        broadcastsSent: snap.broadcastsSent,
        messagesReceived: snap.messagesReceived,
        contactsGained: snap.contactsGained,
        adRevenue: snap.adRevenue / 100, // Convert kobo to naira for display
      }));

      return { snapshots, totals, chartData };
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

  /** Export analytics data as CSV. */
  exportCsv: protectedProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user's plan supports CSV export
      const subscription = await ctx.prisma.subscription.findUnique({
        where: { userId: ctx.user.id },
        include: { plan: true },
      });

      if (!subscription?.plan.hasCsvExport) {
        return {
          allowed: false,
          csv: null,
          message: "CSV export is not available on your current plan. Please upgrade to Business or Scale.",
        };
      }

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

      // Build CSV string
      const headers = [
        "Date",
        "Statuses Posted",
        "Broadcasts Sent",
        "Messages Received",
        "Contacts Gained",
        "Ad Revenue (NGN)",
      ];
      const rows = snapshots.map((snap) => [
        snap.date.toISOString().split("T")[0],
        snap.statusesPosted.toString(),
        snap.broadcastsSent.toString(),
        snap.messagesReceived.toString(),
        snap.contactsGained.toString(),
        (snap.adRevenue / 100).toFixed(2),
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );

      return { allowed: true, csv, message: null };
    }),

  /** Export analytics data as PDF-ready structured data. */
  exportPdf: protectedProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user's plan supports PDF export
      const subscription = await ctx.prisma.subscription.findUnique({
        where: { userId: ctx.user.id },
        include: { plan: true },
      });

      if (!subscription?.plan.hasPdfExport) {
        return {
          allowed: false,
          data: null,
          message: "PDF export is not available on your current plan. Please upgrade to Scale.",
        };
      }

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

      return {
        allowed: true,
        data: {
          period: {
            start: input.startDate,
            end: input.endDate,
          },
          totals,
          dailyBreakdown: snapshots.map((snap) => ({
            date: snap.date.toISOString().split("T")[0],
            statusesPosted: snap.statusesPosted,
            broadcastsSent: snap.broadcastsSent,
            messagesReceived: snap.messagesReceived,
            contactsGained: snap.contactsGained,
            adRevenue: snap.adRevenue,
          })),
        },
        message: null,
      };
    }),
});
