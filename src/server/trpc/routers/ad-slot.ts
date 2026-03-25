import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";

export const adSlotRouter = createTRPCRouter({
  /** List ad slots for the current user. */
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.adSlot.findMany({
      where: { userId: ctx.user.id },
      include: {
        account: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  /** Create a new ad slot. */
  create: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        title: z.string().min(1).max(200),
        description: z.string().max(500).optional(),
        price: z.number().min(10000), // Min ₦100 in kobo
        duration: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check ad slot limit
      const slotCount = await ctx.prisma.adSlot.count({
        where: { userId: ctx.user.id },
      });

      const maxSlots = ctx.user.subscription?.plan.maxAdSlots ?? 2;
      if (slotCount >= maxSlots) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your plan allows a maximum of ${maxSlots} ad slots.`,
        });
      }

      return ctx.prisma.adSlot.create({
        data: {
          userId: ctx.user.id,
          accountId: input.accountId,
          title: input.title,
          description: input.description,
          price: input.price,
          duration: input.duration,
        },
      });
    }),

  /** Get bookings for an ad slot. */
  getBookings: protectedProcedure
    .input(z.object({ adSlotId: z.string() }))
    .query(async ({ ctx, input }) => {
      const slot = await ctx.prisma.adSlot.findFirst({
        where: { id: input.adSlotId, userId: ctx.user.id },
      });

      if (!slot) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.adBooking.findMany({
        where: { adSlotId: input.adSlotId },
        orderBy: { createdAt: "desc" },
      });
    }),
});
