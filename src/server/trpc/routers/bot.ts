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

  /** Add a FAQ entry. */
  addFaqEntry: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        question: z.string().min(1).max(500),
        answer: z.string().min(1).max(2000),
        keywords: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.prisma.chatbotConfig.findUnique({
        where: { accountId: input.accountId },
      });

      if (!config || config.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const maxSort = await ctx.prisma.faqEntry.aggregate({
        where: { chatbotId: config.id },
        _max: { sortOrder: true },
      });

      return ctx.prisma.faqEntry.create({
        data: {
          chatbotId: config.id,
          question: input.question,
          answer: input.answer,
          keywords: input.keywords,
          sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
        },
      });
    }),

  /** Update a FAQ entry. */
  updateFaqEntry: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        question: z.string().min(1).max(500).optional(),
        answer: z.string().min(1).max(2000).optional(),
        keywords: z.array(z.string()).optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.prisma.faqEntry.findUnique({
        where: { id: input.id },
        include: { chatbot: true },
      });

      if (!entry || entry.chatbot.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { id, ...data } = input;
      return ctx.prisma.faqEntry.update({ where: { id }, data });
    }),

  /** Delete a FAQ entry. */
  deleteFaqEntry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.prisma.faqEntry.findUnique({
        where: { id: input.id },
        include: { chatbot: true },
      });

      if (!entry || entry.chatbot.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.faqEntry.delete({ where: { id: input.id } });
    }),

  /** Create a chatbot flow. */
  createFlow: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        name: z.string().min(1).max(200),
        triggerType: z.enum([
          "KEYWORD",
          "FIRST_MESSAGE",
          "BUTTON_REPLY",
          "LIST_REPLY",
        ]),
        triggerValue: z.string().optional(),
        flowData: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.prisma.chatbotConfig.findUnique({
        where: { accountId: input.accountId },
      });

      if (!config || config.userId !== ctx.user.id) {
        // Create config if it does not exist
        const newConfig = await ctx.prisma.chatbotConfig.create({
          data: {
            userId: ctx.user.id,
            accountId: input.accountId,
          },
        });

        return ctx.prisma.chatbotFlow.create({
          data: {
            chatbotId: newConfig.id,
            name: input.name,
            triggerType: input.triggerType,
            triggerValue: input.triggerValue,
            flowData: input.flowData ?? {},
          },
        });
      }

      return ctx.prisma.chatbotFlow.create({
        data: {
          chatbotId: config.id,
          name: input.name,
          triggerType: input.triggerType,
          triggerValue: input.triggerValue,
          flowData: input.flowData ?? {},
        },
      });
    }),

  /** Update a chatbot flow. */
  updateFlow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(200).optional(),
        triggerType: z
          .enum(["KEYWORD", "FIRST_MESSAGE", "BUTTON_REPLY", "LIST_REPLY"])
          .optional(),
        triggerValue: z.string().optional(),
        flowData: z.any().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const flow = await ctx.prisma.chatbotFlow.findUnique({
        where: { id: input.id },
        include: { chatbot: true },
      });

      if (!flow || flow.chatbot.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { id, ...data } = input;
      return ctx.prisma.chatbotFlow.update({ where: { id }, data });
    }),

  /** Delete a chatbot flow. */
  deleteFlow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const flow = await ctx.prisma.chatbotFlow.findUnique({
        where: { id: input.id },
        include: { chatbot: true },
      });

      if (!flow || flow.chatbot.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.chatbotFlow.delete({ where: { id: input.id } });
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
