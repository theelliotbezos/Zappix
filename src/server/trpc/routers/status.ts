import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/server/inngest/client";
import { cloudinaryService } from "@/server/services/cloudinary";

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

  /** Get a single status by ID. */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const status = await ctx.prisma.scheduledStatus.findFirst({
        where: { id: input.id, userId: ctx.user.id },
        include: { account: true },
      });

      if (!status) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return status;
    }),

  /** Upload media for a status post. */
  uploadMedia: protectedProcedure
    .input(
      z.object({
        file: z.string(), // base64 encoded file
        resourceType: z.enum(["image", "video"]).default("image"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await cloudinaryService.upload(input.file, {
        folder: `zappix/statuses/${ctx.user.id}`,
        resourceType: input.resourceType,
      });

      return {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        bytes: result.bytes,
      };
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

      const scheduledStatus = await ctx.prisma.scheduledStatus.create({
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

      // Trigger Inngest job to post the status at the scheduled time
      const scheduledAt = new Date(input.scheduledAt);
      const now = new Date();
      const delayMs = Math.max(scheduledAt.getTime() - now.getTime(), 0);

      if (delayMs > 0) {
        // Schedule for future
        await inngest.send({
          name: "status/post",
          data: { statusId: scheduledStatus.id },
          ts: Math.floor(scheduledAt.getTime() / 1000),
        });
      } else {
        // Post immediately
        await inngest.send({
          name: "status/post",
          data: { statusId: scheduledStatus.id },
        });
      }

      return scheduledStatus;
    }),

  /** Update a scheduled status post. */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        caption: z.string().optional(),
        mediaUrl: z.string().url().optional(),
        scheduledAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const status = await ctx.prisma.scheduledStatus.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!status) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (status.status !== "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only update statuses that are still pending.",
        });
      }

      const updated = await ctx.prisma.scheduledStatus.update({
        where: { id: input.id },
        data: {
          caption: input.caption,
          mediaUrl: input.mediaUrl,
          scheduledAt: input.scheduledAt
            ? new Date(input.scheduledAt)
            : undefined,
        },
      });

      // Re-schedule Inngest job if time changed
      if (input.scheduledAt) {
        await inngest.send({
          name: "status/post",
          data: { statusId: updated.id },
          ts: Math.floor(new Date(input.scheduledAt).getTime() / 1000),
        });
      }

      return updated;
    }),

  /** Retry a failed status post. */
  retry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const status = await ctx.prisma.scheduledStatus.findFirst({
        where: { id: input.id, userId: ctx.user.id, status: "FAILED" },
      });

      if (!status) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No failed status found with this ID.",
        });
      }

      await ctx.prisma.scheduledStatus.update({
        where: { id: input.id },
        data: { status: "PENDING", errorMessage: null },
      });

      await inngest.send({
        name: "status/post",
        data: { statusId: input.id },
      });

      return { success: true };
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
