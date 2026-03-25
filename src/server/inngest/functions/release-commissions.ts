import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { COMMISSION_HOLD_DAYS } from "@/lib/constants";

/**
 * Inngest function: Release commissions that have passed the hold period.
 *
 * Runs daily to check for PENDING commissions that are older than 30 days
 * and updates them to AVAILABLE status so they can be withdrawn.
 */
export const releaseCommissionsFunction = inngest.createFunction(
  {
    id: "commissions-release",
    name: "Release Held Commissions",
    triggers: [{ cron: "0 2 * * *" }], // Run at 2 AM daily
  },
  async ({ step }) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - COMMISSION_HOLD_DAYS);

    // Find pending commissions older than the hold period
    const pendingCommissions = await step.run(
      "find-pending-commissions",
      async () => {
        return prisma.commission.findMany({
          where: {
            status: "PENDING",
            createdAt: { lte: cutoffDate },
          },
          include: {
            referral: {
              select: {
                referrerId: true,
                status: true,
              },
            },
          },
        });
      }
    );

    // Release commissions where the referred user is still subscribed
    const released = await step.run("release-commissions", async () => {
      let count = 0;

      for (const commission of pendingCommissions) {
        // Only release if the referral is still active (user hasn't churned)
        if (commission.referral.status === "SUBSCRIBED") {
          await prisma.commission.update({
            where: { id: commission.id },
            data: {
              status: "AVAILABLE",
              releasedAt: new Date(),
            },
          });
          count++;
        } else if (commission.referral.status === "CHURNED") {
          // If user churned, void the commission
          await prisma.commission.delete({
            where: { id: commission.id },
          });
        }
      }

      return count;
    });

    return {
      checked: pendingCommissions.length,
      released,
    };
  }
);
