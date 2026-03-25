import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";

export const statusRouter = createTRPCRouter({
  /** List scheduled statuses for the current user. */
  list: protectedProcedure
    .input(
      z.object({
        accountId: z.string().optional(),
        status: z
          .enum(["PENDING", "QUEUED", "POSTING", "POSTED", "FAILED"])
          .optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.scheduledStatus.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.accountId && { accountId: input.accountId }),
          ...(input.status && { status: input.status }),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { scheduledAt: "asc" },
        include: { account: true },
      });

      let nextCursor: typeof input.cursor | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  /** Create a new scheduled status post. */
  create: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        type: z.enum(["TEXT", "IMAGE", "VIDEO"]),
        caption: z.string().optional(),
        mediaUrl: z.string().url().optional(),
        scheduledAt: z.string().datetime(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify account ownership
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { id: input.accountId, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check monthly limit
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await ctx.prisma.scheduledStatus.count({
        where: {
          userId: ctx.user.id,
          createdAt: { gte: startOfMonth },
        },
      });

      const maxPosts =
        ctx.user.subscription?.plan.maxStatusPostsPerMonth ?? 45;
      if (monthlyCount >= maxPosts) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You have reached your monthly limit of ${maxPosts} status posts.`,
        });
      }

      return ctx.prisma.scheduledStatus.create({
        data: {
          userId: ctx.user.id,
          accountId: input.accountId,
          type: input.type,
          caption: input.caption,
          mediaUrl: input.mediaUrl,
          scheduledAt: new Date(input.scheduledAt),
          status: "PENDING",
        },
      });
    }),

  /** Delete a scheduled status post. */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const status = await ctx.prisma.scheduledStatus.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!status) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (status.status === "POSTING" || status.status === "POSTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete a status that is posting or already posted.",
        });
      }

      return ctx.prisma.scheduledStatus.delete({ where: { id: input.id } });
    }),
});
