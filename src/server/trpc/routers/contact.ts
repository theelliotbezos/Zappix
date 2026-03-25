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
        isOptedOut: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.contact.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.accountId && { accountId: input.accountId }),
          ...(input.isOptedOut !== undefined && {
            isOptedOut: input.isOptedOut,
          }),
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
        include: {
          tags: { include: { tag: true } },
          lists: { include: { list: true } },
          account: { select: { instanceName: true, phoneNumber: true } },
        },
      });

      let nextCursor: typeof input.cursor | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  /** Get a single contact by ID with full details. */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.findFirst({
        where: { id: input.id, userId: ctx.user.id },
        include: {
          tags: { include: { tag: true } },
          lists: { include: { list: true } },
          account: { select: { instanceName: true, phoneNumber: true } },
          broadcastRecipients: {
            include: {
              broadcast: {
                select: { name: true, status: true, createdAt: true },
              },
            },
            orderBy: { broadcast: { createdAt: "desc" } },
            take: 10,
          },
        },
      });

      if (!contact) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return contact;
    }),

  /** Get contact stats. */
  stats: protectedProcedure.query(async ({ ctx }) => {
    const [totalContacts, totalLists, totalTags, optedOut] = await Promise.all([
      ctx.prisma.contact.count({ where: { userId: ctx.user.id } }),
      ctx.prisma.contactList.count(),
      ctx.prisma.tag.count(),
      ctx.prisma.contact.count({
        where: { userId: ctx.user.id, isOptedOut: true },
      }),
    ]);

    return { totalContacts, totalLists, totalTags, optedOut };
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

  /** Update a contact. */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        phoneNumber: z.string().min(10).max(20).optional(),
        customFields: z.record(z.string()).optional(),
        isOptedOut: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!contact) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { id, ...data } = input;

      return ctx.prisma.contact.update({
        where: { id },
        data,
      });
    }),

  /** Delete a contact. */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.prisma.contact.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!contact) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.contact.delete({ where: { id: input.id } });
    }),

  /** Import contacts from CSV data. */
  importCsv: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        csvData: z.array(
          z.object({
            phoneNumber: z.string().min(10).max(20),
            name: z.string().optional(),
            customFields: z.record(z.string()).optional(),
          })
        ),
        listId: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
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

      // Check contact limit
      const currentCount = await ctx.prisma.contact.count({
        where: { userId: ctx.user.id },
      });

      const maxContacts = ctx.user.subscription?.plan.maxContacts ?? 7_500;
      const available = maxContacts - currentCount;

      if (available <= 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You have reached your contact limit of ${maxContacts}. Please upgrade.`,
        });
      }

      // Limit import to available slots
      const toImport = input.csvData.slice(0, available);
      const skipped = input.csvData.length - toImport.length;

      const results = {
        imported: 0,
        duplicates: 0,
        errors: 0,
        skipped,
      };

      for (const row of toImport) {
        try {
          const contact = await ctx.prisma.contact.upsert({
            where: {
              accountId_phoneNumber: {
                accountId: input.accountId,
                phoneNumber: row.phoneNumber,
              },
            },
            create: {
              userId: ctx.user.id,
              accountId: input.accountId,
              phoneNumber: row.phoneNumber,
              name: row.name,
              customFields: row.customFields,
            },
            update: {
              name: row.name ?? undefined,
              customFields: row.customFields ?? undefined,
            },
          });

          // Add to list if specified
          if (input.listId) {
            await ctx.prisma.contactListMember
              .create({
                data: {
                  contactId: contact.id,
                  listId: input.listId,
                },
              })
              .catch(() => {
                // Ignore duplicate list membership
              });
          }

          // Add tags if specified
          if (input.tagIds && input.tagIds.length > 0) {
            for (const tagId of input.tagIds) {
              await ctx.prisma.contactTag
                .create({
                  data: {
                    contactId: contact.id,
                    tagId,
                  },
                })
                .catch(() => {
                  // Ignore duplicate tag assignment
                });
            }
          }

          results.imported++;
        } catch (error) {
          results.errors++;
        }
      }

      return results;
    }),

  // ── Contact Lists ──────────────────────────────────

  /** Get contact lists. */
  getLists: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.contactList.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  /** Create a contact list. */
  createList: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contactList.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  /** Update a contact list. */
  updateList: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.contactList.update({
        where: { id },
        data,
      });
    }),

  /** Delete a contact list. */
  deleteList: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contactList.delete({ where: { id: input.id } });
    }),

  /** Add contacts to a list. */
  addToList: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        contactIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const created = await Promise.allSettled(
        input.contactIds.map((contactId) =>
          ctx.prisma.contactListMember.create({
            data: {
              contactId,
              listId: input.listId,
            },
          })
        )
      );

      return {
        added: created.filter((r) => r.status === "fulfilled").length,
        failed: created.filter((r) => r.status === "rejected").length,
      };
    }),

  /** Remove contacts from a list. */
  removeFromList: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        contactIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.contactListMember.deleteMany({
        where: {
          listId: input.listId,
          contactId: { in: input.contactIds },
        },
      });

      return { success: true };
    }),

  // ── Tags ───────────────────────────────────────────

  /** Get tags. */
  getTags: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tag.findMany({
      include: { _count: { select: { contacts: true } } },
      orderBy: { name: "asc" },
    });
  }),

  /** Create a tag. */
  createTag: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#16A34A"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.tag.create({
        data: {
          name: input.name,
          color: input.color,
        },
      });
    }),

  /** Update a tag. */
  updateTag: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(50).optional(),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.tag.update({ where: { id }, data });
    }),

  /** Delete a tag. */
  deleteTag: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.tag.delete({ where: { id: input.id } });
    }),

  /** Assign tags to a contact. */
  assignTags: protectedProcedure
    .input(
      z.object({
        contactId: z.string(),
        tagIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify contact ownership
      const contact = await ctx.prisma.contact.findFirst({
        where: { id: input.contactId, userId: ctx.user.id },
      });

      if (!contact) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Remove existing tags
      await ctx.prisma.contactTag.deleteMany({
        where: { contactId: input.contactId },
      });

      // Add new tags
      await Promise.allSettled(
        input.tagIds.map((tagId) =>
          ctx.prisma.contactTag.create({
            data: {
              contactId: input.contactId,
              tagId,
            },
          })
        )
      );

      return { success: true };
    }),

  /** Remove tags from a contact. */
  removeTags: protectedProcedure
    .input(
      z.object({
        contactId: z.string(),
        tagIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.contactTag.deleteMany({
        where: {
          contactId: input.contactId,
          tagId: { in: input.tagIds },
        },
      });

      return { success: true };
    }),
});
