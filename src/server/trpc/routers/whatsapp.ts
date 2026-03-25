import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { evolutionClient } from "@/server/evolution/client";
import { TRPCError } from "@trpc/server";

export const whatsappRouter = createTRPCRouter({
  /** List all connected WhatsApp accounts for the current user. */
  listAccounts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.whatsAppAccount.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            contacts: true,
            broadcasts: true,
            scheduledStatuses: true,
          },
        },
      },
    });
  }),

  /** Get a single account with full details. */
  getAccount: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { id: input.id, userId: ctx.user.id },
        include: {
          _count: {
            select: {
              contacts: true,
              broadcasts: true,
              scheduledStatuses: true,
              adSlots: true,
            },
          },
          chatbotConfig: { select: { isActive: true } },
          menuBotConfig: { select: { isActive: true } },
        },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return account;
    }),

  /** Create a new WhatsApp instance via Evolution API. */
  createInstance: protectedProcedure
    .input(z.object({ instanceName: z.string().min(1).max(50) }))
    .mutation(async ({ ctx, input }) => {
      // Check plan limits
      const accountCount = await ctx.prisma.whatsAppAccount.count({
        where: { userId: ctx.user.id },
      });

      const maxAccounts =
        ctx.user.subscription?.plan.maxWhatsappAccounts ?? 1;
      if (accountCount >= maxAccounts) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your plan allows a maximum of ${maxAccounts} WhatsApp accounts. Please upgrade to add more.`,
        });
      }

      // Create instance via Evolution API
      const instance = await evolutionClient.createInstance(
        input.instanceName
      );

      // Save to database
      return ctx.prisma.whatsAppAccount.create({
        data: {
          userId: ctx.user.id,
          instanceId: instance.instanceId,
          instanceName: input.instanceName,
          status: "DISCONNECTED",
        },
      });
    }),

  /** Get QR code for connecting a WhatsApp account. */
  getQrCode: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { instanceId: input.instanceId, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return evolutionClient.getQrCode(input.instanceId);
    }),

  /** Get the connection status of a WhatsApp instance (for polling). */
  connectionStatus: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { instanceId: input.instanceId, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      try {
        const state = await evolutionClient.getConnectionState(
          input.instanceId
        );

        // Sync DB with actual state from Evolution API
        const statusMap = {
          open: "CONNECTED" as const,
          close: "DISCONNECTED" as const,
          connecting: "CONNECTING" as const,
        };

        const newStatus = statusMap[state.state];
        if (newStatus !== account.status) {
          await ctx.prisma.whatsAppAccount.update({
            where: { id: account.id },
            data: {
              status: newStatus,
              ...(state.state === "open" && { lastConnectedAt: new Date() }),
            },
          });
        }

        return {
          instanceId: input.instanceId,
          state: state.state,
          dbStatus: newStatus,
        };
      } catch (error) {
        // If Evolution API is unreachable, return DB status
        return {
          instanceId: input.instanceId,
          state: "close" as const,
          dbStatus: account.status,
        };
      }
    }),

  /** Reconnect a disconnected instance. */
  reconnect: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { instanceId: input.instanceId, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Update status to connecting
      await ctx.prisma.whatsAppAccount.update({
        where: { id: account.id },
        data: { status: "CONNECTING" },
      });

      // Get new QR code to trigger reconnection
      const qr = await evolutionClient.getQrCode(input.instanceId);
      return { qrCode: qr.base64, instanceId: input.instanceId };
    }),

  /** Disconnect (logout) a WhatsApp instance without deleting it. */
  disconnect: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { instanceId: input.instanceId, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await evolutionClient.logoutInstance(input.instanceId);

      return ctx.prisma.whatsAppAccount.update({
        where: { id: account.id },
        data: { status: "DISCONNECTED" },
      });
    }),

  /** Disconnect and delete a WhatsApp instance. */
  deleteInstance: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { instanceId: input.instanceId, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Delete from Evolution API
      await evolutionClient.deleteInstance(input.instanceId);

      // Delete from database
      return ctx.prisma.whatsAppAccount.delete({
        where: { id: account.id },
      });
    }),

  /** Update display info for an account. */
  updateAccount: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        displayName: z.string().max(100).optional(),
        phoneNumber: z.string().max(20).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { id, ...data } = input;
      return ctx.prisma.whatsAppAccount.update({
        where: { id },
        data,
      });
    }),
});
