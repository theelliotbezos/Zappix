import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { TRPCError } from "@trpc/server";
import { emailService } from "@/server/services/email";

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

      // Check if already invited
      const existing = await ctx.prisma.teamMember.findFirst({
        where: { userId: ctx.user.id, email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This email has already been invited.",
        });
      }

      const member = await ctx.prisma.teamMember.create({
        data: {
          userId: ctx.user.id,
          email: input.email,
          name: input.name,
          role: input.role,
          status: "PENDING",
        },
      });

      // Send invite email
      try {
        await emailService.sendTeamInvite(
          input.email,
          input.name ?? "there",
          ctx.user.name ?? "A Zappix user",
          input.role
        );
      } catch (error) {
        console.error("Failed to send team invite email:", error);
        // Don't fail the mutation if email sending fails
      }

      return member;
    }),

  /** Update a team member's role. */
  updateRole: protectedProcedure
    .input(
      z.object({
        memberId: z.string(),
        role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.prisma.teamMember.findFirst({
        where: { id: input.memberId, userId: ctx.user.id },
      });

      if (!member) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.teamMember.update({
        where: { id: input.memberId },
        data: { role: input.role },
      });
    }),

  /** Resend an invite email. */
  resendInvite: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.prisma.teamMember.findFirst({
        where: { id: input.memberId, userId: ctx.user.id, status: "PENDING" },
      });

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pending invite not found.",
        });
      }

      await emailService.sendTeamInvite(
        member.email,
        member.name ?? "there",
        ctx.user.name ?? "A Zappix user",
        member.role
      );

      return { success: true };
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
