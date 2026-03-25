import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";

export const teamRouter = createTRPCRouter({
  /** List team members for the current user. */
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.teamMember.findMany({
      where: { userId: ctx.user.id },
      orderBy: { invitedAt: "desc" },
    });
  }),

  /** Invite a new team member. */
  invite: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check team member limit
      const memberCount = await ctx.prisma.teamMember.count({
        where: { userId: ctx.user.id },
      });

      const maxMembers = ctx.user.subscription?.plan.maxTeamMembers ?? 1;
      if (memberCount >= maxMembers) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your plan allows a maximum of ${maxMembers} team members.`,
        });
      }

      return ctx.prisma.teamMember.create({
        data: {
          userId: ctx.user.id,
          email: input.email,
          name: input.name,
          role: input.role,
          status: "PENDING",
        },
      });
    }),

  /** Remove a team member. */
  remove: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.prisma.teamMember.findFirst({
        where: { id: input.memberId, userId: ctx.user.id },
      });

      if (!member) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.teamMember.delete({ where: { id: input.memberId } });
    }),
});
