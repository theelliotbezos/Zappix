import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";

export const botRouter = createTRPCRouter({
  /** Get chatbot config for an account. */
  getChatbotConfig: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.chatbotConfig.findUnique({
        where: { accountId: input.accountId },
        include: {
          faqEntries: { orderBy: { sortOrder: "asc" } },
          flows: true,
        },
      });
    }),

  /** Update chatbot config. */
  updateChatbotConfig: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        isActive: z.boolean().optional(),
        welcomeMessage: z.string().max(1000).optional(),
        fallbackMessage: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { accountId, ...data } = input;

      return ctx.prisma.chatbotConfig.upsert({
        where: { accountId },
        create: {
          userId: ctx.user.id,
          accountId,
          ...data,
        },
        update: data,
      });
    }),

  /** Get menu bot config for an account. */
  getMenuBotConfig: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.menuBotConfig.findUnique({
        where: { accountId: input.accountId },
      });
    }),

  /** Update menu bot config. */
  updateMenuBotConfig: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        isActive: z.boolean().optional(),
        menuTree: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { accountId, ...data } = input;

      return ctx.prisma.menuBotConfig.upsert({
        where: { accountId },
        create: {
          userId: ctx.user.id,
          accountId,
          menuTree: data.menuTree ?? {},
          ...data,
        },
        update: data,
      });
    }),
});
