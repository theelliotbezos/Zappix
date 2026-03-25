import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../root";
import { TRPCError } from "@trpc/server";
import { paystackService } from "@/server/services/paystack";
import { APP_URL } from "@/lib/constants";

export const adSlotRouter = createTRPCRouter({
  /** List ad slots for the current user. */
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.adSlot.findMany({
      where: { userId: ctx.user.id },
      include: {
        account: true,
        _count: { select: { bookings: true } },
        bookings: {
          where: { status: { in: ["PENDING", "PAID", "APPROVED", "SCHEDULED"] } },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  /** Get ad slot stats. */
  stats: protectedProcedure.query(async ({ ctx }) => {
    const slots = await ctx.prisma.adSlot.findMany({
      where: { userId: ctx.user.id },
      include: {
        bookings: true,
      },
    });

    const activeSlots = slots.filter((s) => s.isActive).length;
    const totalBookings = slots.reduce((sum, s) => sum + s.bookings.length, 0);
    const totalRevenue = slots.reduce(
      (sum, s) =>
        sum +
        s.bookings
          .filter((b) => b.status === "DELIVERED" || b.status === "APPROVED")
          .reduce((bSum, b) => bSum + s.price, 0),
      0
    );
    const pendingBookings = slots.reduce(
      (sum, s) =>
        sum + s.bookings.filter((b) => b.status === "PENDING" || b.status === "PAID").length,
      0
    );

    return { activeSlots, totalBookings, totalRevenue, pendingBookings };
  }),

  /** Create a new ad slot. */
  create: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        title: z.string().min(1).max(200),
        description: z.string().max(500).optional(),
        price: z.number().min(10000), // Min 100 NGN in kobo
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

  /** Update an ad slot. */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().max(500).optional(),
        price: z.number().min(10000).optional(),
        duration: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slot = await ctx.prisma.adSlot.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!slot) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { id, ...data } = input;
      return ctx.prisma.adSlot.update({ where: { id }, data });
    }),

  /** Delete an ad slot. */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const slot = await ctx.prisma.adSlot.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!slot) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.adSlot.delete({ where: { id: input.id } });
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

  /** Approve a booking. */
  approveBooking: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.prisma.adBooking.findUnique({
        where: { id: input.bookingId },
        include: { adSlot: true },
      });

      if (!booking || booking.adSlot.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (booking.status !== "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only approve paid bookings.",
        });
      }

      return ctx.prisma.adBooking.update({
        where: { id: input.bookingId },
        data: { status: "APPROVED" },
      });
    }),

  /** Reject a booking. */
  rejectBooking: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.prisma.adBooking.findUnique({
        where: { id: input.bookingId },
        include: { adSlot: true },
      });

      if (!booking || booking.adSlot.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.adBooking.update({
        where: { id: input.bookingId },
        data: { status: "REJECTED" },
      });
    }),

  /** Mark a booking as delivered. */
  markDelivered: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.prisma.adBooking.findUnique({
        where: { id: input.bookingId },
        include: { adSlot: true },
      });

      if (!booking || booking.adSlot.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (booking.status !== "APPROVED" && booking.status !== "SCHEDULED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only mark approved or scheduled bookings as delivered.",
        });
      }

      return ctx.prisma.adBooking.update({
        where: { id: input.bookingId },
        data: { status: "DELIVERED", deliveredAt: new Date() },
      });
    }),

  // ── Public booking endpoints ──────────────────────

  /** Get public ad slots for a user (for the public booking page). */
  getPublicSlots: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: { name: true, image: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const slots = await ctx.prisma.adSlot.findMany({
        where: { userId: input.userId, isActive: true },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          duration: true,
        },
        orderBy: { price: "asc" },
      });

      return { user, slots };
    }),

  /** Create a booking (public - no auth required). */
  createBooking: publicProcedure
    .input(
      z.object({
        adSlotId: z.string(),
        advertiserName: z.string().min(1).max(200),
        advertiserEmail: z.string().email(),
        advertiserPhone: z.string().max(20).optional(),
        mediaUrl: z.string().url().optional(),
        caption: z.string().max(500).optional(),
        scheduledFor: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slot = await ctx.prisma.adSlot.findUnique({
        where: { id: input.adSlotId },
      });

      if (!slot || !slot.isActive) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ad slot not found or not active.",
        });
      }

      const reference = `ad_${input.adSlotId}_${Date.now()}`;

      // Create booking
      const booking = await ctx.prisma.adBooking.create({
        data: {
          adSlotId: input.adSlotId,
          advertiserName: input.advertiserName,
          advertiserEmail: input.advertiserEmail,
          advertiserPhone: input.advertiserPhone,
          mediaUrl: input.mediaUrl,
          caption: input.caption,
          scheduledFor: input.scheduledFor
            ? new Date(input.scheduledFor)
            : undefined,
          paystackReference: reference,
          status: "PENDING",
        },
      });

      // Initialize Paystack payment
      const payment = await paystackService.initializeTransaction({
        email: input.advertiserEmail,
        amount: slot.price,
        reference,
        callbackUrl: `${APP_URL}/ads/booking/${booking.id}/success`,
        metadata: {
          bookingId: booking.id,
          adSlotId: slot.id,
          type: "ad_booking",
        },
      });

      return {
        bookingId: booking.id,
        authorizationUrl: payment.data.authorization_url,
        reference: payment.data.reference,
      };
    }),

  /** Verify ad booking payment. */
  verifyBookingPayment: publicProcedure
    .input(z.object({ reference: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await paystackService.verifyTransaction(input.reference);

      if (result.data.status === "success") {
        await ctx.prisma.adBooking.updateMany({
          where: { paystackReference: input.reference },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        return { success: true };
      }

      return { success: false };
    }),
});
