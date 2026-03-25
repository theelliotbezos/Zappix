import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";

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

      return ctx.prisma.broadcast.create({
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
        },
      });
    }),
});
