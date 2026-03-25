import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";

export const contactRouter = createTRPCRouter({
  /** List contacts for the current user with search and filtering. */
  list: protectedProcedure
    .input(
      z.object({
        accountId: z.string().optional(),
        search: z.string().optional(),
        tagId: z.string().optional(),
        listId: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.contact.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.accountId && { accountId: input.accountId }),
          ...(input.search && {
            OR: [
              { name: { contains: input.search, mode: "insensitive" } },
              { phoneNumber: { contains: input.search } },
            ],
          }),
          ...(input.tagId && {
            tags: { some: { tagId: input.tagId } },
          }),
          ...(input.listId && {
            lists: { some: { listId: input.listId } },
          }),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { tags: { include: { tag: true } } },
      });

      let nextCursor: typeof input.cursor | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  /** Create a new contact. */
  create: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        phoneNumber: z.string().min(10).max(20),
        name: z.string().optional(),
        customFields: z.record(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check contact limit
      const contactCount = await ctx.prisma.contact.count({
        where: { userId: ctx.user.id },
      });

      const maxContacts = ctx.user.subscription?.plan.maxContacts ?? 7_500;
      if (contactCount >= maxContacts) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You have reached your contact limit of ${maxContacts}. Please upgrade your plan.`,
        });
      }

      return ctx.prisma.contact.create({
        data: {
          userId: ctx.user.id,
          accountId: input.accountId,
          phoneNumber: input.phoneNumber,
          name: input.name,
          customFields: input.customFields,
        },
      });
    }),

  /** Get contact lists. */
  getLists: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.contactList.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  /** Get tags. */
  getTags: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tag.findMany({
      include: { _count: { select: { contacts: true } } },
      orderBy: { name: "asc" },
    });
  }),
});
