import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";

export const userRouter = createTRPCRouter({
  /** Get the current user's profile with subscription info. */
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        subscription: { include: { plan: true } },
        referralCode: true,
        bankAccount: true,
      },
    });
  }),

  /** Update the current user's profile. */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        phone: z.string().max(20).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
      });
    }),
});
