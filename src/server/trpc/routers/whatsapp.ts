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
    });
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

  /** Get the connection status of a WhatsApp instance. */
  connectionStatus: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const account = await ctx.prisma.whatsAppAccount.findFirst({
        where: { instanceId: input.instanceId, userId: ctx.user.id },
      });

      if (!account) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return evolutionClient.getConnectionState(input.instanceId);
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
});
