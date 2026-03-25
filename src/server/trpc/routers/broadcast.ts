import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/server/inngest/client";

export const broadcastRouter = createTRPCRouter({
  /** List broadcasts for the current user. */
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .enum([
            "DRAFT",
            "SCHEDULED",
            "SENDING",
            "COMPLETED",
            "FAILED",
            "CANCELLED",
          ])
          .optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.broadcast.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.status && { status: input.status }),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { account: true, list: true },
      });

      let nextCursor: typeof input.cursor | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  /** Get broadcast stats for the current user. */
  stats: protectedProcedure.query(async ({ ctx }) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, sent, scheduled, failed] = await Promise.all([
      ctx.prisma.broadcast.count({ where: { userId: ctx.user.id } }),
      ctx.prisma.broadcast.count({
        where: { userId: ctx.user.id, status: "COMPLETED" },
      }),
      ctx.prisma.broadcast.count({
        where: { userId: ctx.user.id, status: "SCHEDULED" },
      }),
      ctx.prisma.broadcast.count({
        where: { userId: ctx.user.id, status: "FAILED" },
      }),
    ]);

    // Calculate delivery rate
    const completedBroadcasts = await ctx.prisma.broadcast.findMany({
      where: { userId: ctx.user.id, status: "COMPLETED" },
      select: { sentCount: true, totalRecipients: true },
    });

    const totalSent = completedBroadcasts.reduce(
      (sum, b) => sum + b.sentCount,
      0
    );
    const totalRecipients = completedBroadcasts.reduce(
      (sum, b) => sum + b.totalRecipients,
      0
    );
    const deliveryRate =
      totalRecipients > 0
        ? Math.round((totalSent / totalRecipients) * 100)
        : 0;

    return { total, sent, scheduled, failed, deliveryRate };
  }),

  /** Get detailed analytics for a specific broadcast. */
  analytics: protectedProcedure
    .input(z.object({ broadcastId: z.string() }))
    .query(async ({ ctx, input }) => {
      const broadcast = await ctx.prisma.broadcast.findFirst({
        where: { id: input.broadcastId, userId: ctx.user.id },
        include: {
          recipients: {
            include: { contact: { select: { name: true, phoneNumber: true } } },
          },
          account: { select: { instanceName: true, phoneNumber: true } },
        },
      });

      if (!broadcast) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const recipientStats = {
        pending: broadcast.recipients.filter((r) => r.status === "PENDING")
          .length,
        sent: broadcast.recipients.filter((r) => r.status === "SENT").length,
        delivered: broadcast.recipients.filter((r) => r.status === "DELIVERED")
          .length,
        failed: broadcast.recipients.filter((r) => r.status === "FAILED")
          .length,
        optedOut: broadcast.recipients.filter((r) => r.status === "OPTED_OUT")
          .length,
      };

      return { broadcast, recipientStats };
    }),

  /** Create a new broadcast. */
  create: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        listId: z.string().optional(),
        name: z.string().min(1).max(200),
        messageType: z.enum([
          "TEXT",
          "IMAGE",
          "VIDEO",
          "DOCUMENT",
          "AUDIO",
          "CONTACT",
          "LOCATION",
        ]),
        messageBody: z.string().min(1),
        mediaUrl: z.string().url().optional(),
        scheduledAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { id: input.accountId, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check monthly broadcast limit
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await ctx.prisma.broadcast.count({
        where: {
          userId: ctx.user.id,
          createdAt: { gte: startOfMonth },
          status: { not: "CANCELLED" },
        },
      });

      const maxBroadcasts =
        ctx.user.subscription?.plan.maxBroadcastsPerMonth ?? 15;
      if (monthlyCount >= maxBroadcasts) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You have reached your monthly limit of ${maxBroadcasts} broadcasts.`,
        });
      }

      // Get contacts for the broadcast
      const contactFilter: Record<string, unknown> = {
        userId: ctx.user.id,
        accountId: input.accountId,
        isOptedOut: false, // Respect opt-out
      };

      if (input.listId) {
        contactFilter.lists = { some: { listId: input.listId } };
      }

      const contacts = await ctx.prisma.contact.findMany({
        where: contactFilter,
        select: { id: true },
      });

      const broadcast = await ctx.prisma.broadcast.create({
        data: {
          userId: ctx.user.id,
          accountId: input.accountId,
          listId: input.listId,
          name: input.name,
          messageType: input.messageType,
          messageBody: input.messageBody,
          mediaUrl: input.mediaUrl,
          scheduledAt: input.scheduledAt
            ? new Date(input.scheduledAt)
            : undefined,
          status: input.scheduledAt ? "SCHEDULED" : "DRAFT",
          totalRecipients: contacts.length,
          recipients: {
            create: contacts.map((c) => ({
              contactId: c.id,
              status: "PENDING",
            })),
          },
        },
      });

      return broadcast;
    }),

  /** Send a broadcast (trigger the Inngest job). */
  send: protectedProcedure
    .input(z.object({ broadcastId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const broadcast = await ctx.prisma.broadcast.findFirst({
        where: {
          id: input.broadcastId,
          userId: ctx.user.id,
          status: { in: ["DRAFT", "SCHEDULED"] },
        },
      });

      if (!broadcast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Broadcast not found or already sent.",
        });
      }

      // Trigger the Inngest job
      await inngest.send({
        name: "broadcast/send",
        data: { broadcastId: input.broadcastId },
      });

      return { success: true, broadcastId: input.broadcastId };
    }),

  /** Cancel a scheduled broadcast. */
  cancel: protectedProcedure
    .input(z.object({ broadcastId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const broadcast = await ctx.prisma.broadcast.findFirst({
        where: {
          id: input.broadcastId,
          userId: ctx.user.id,
          status: { in: ["DRAFT", "SCHEDULED"] },
        },
      });

      if (!broadcast) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.broadcast.update({
        where: { id: input.broadcastId },
        data: { status: "CANCELLED" },
      });
    }),

  /** Handle opt-out for a contact from broadcasts. */
  optOut: protectedProcedure
    .input(
      z.object({
        contactId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.findFirst({
        where: { id: input.contactId, userId: ctx.user.id },
      });

      if (!contact) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.contact.update({
        where: { id: input.contactId },
        data: { isOptedOut: true },
      });
    }),

  /** Opt a contact back into broadcasts. */
  optIn: protectedProcedure
    .input(z.object({ contactId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.findFirst({
        where: { id: input.contactId, userId: ctx.user.id },
      });

      if (!contact) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.contact.update({
        where: { id: input.contactId },
        data: { isOptedOut: false },
      });
    }),
});
