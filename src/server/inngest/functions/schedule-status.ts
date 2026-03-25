import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { messagingService } from "@/server/evolution/messaging";
import { MAX_RETRIES } from "@/lib/constants";

/**
 * Inngest function: Post a scheduled WhatsApp status.
 *
 * Triggered when a status is due to be posted.
 * Handles retries on failure.
 */
export const scheduleStatusFunction = inngest.createFunction(
  {
    id: "status-post",
    name: "Post Scheduled Status",
    retries: MAX_RETRIES,
    triggers: [{ event: "status/post" }],
  },
  async ({ event, step }) => {
    const { statusId } = event.data as { statusId: string };

    // Mark as queued
    await step.run("mark-queued", async () => {
      await prisma.scheduledStatus.update({
        where: { id: statusId },
        data: { status: "QUEUED" },
      });
    });

    // Fetch status details
    const status = await step.run("fetch-status", async () => {
      return prisma.scheduledStatus.findUnique({
        where: { id: statusId },
        include: { account: true },
      });
    });

    if (!status || !status.account) {
      throw new Error(`Status ${statusId} not found`);
    }

    // Post the status
    await step.run("post-status", async () => {
      await prisma.scheduledStatus.update({
        where: { id: statusId },
        data: { status: "POSTING" },
      });

      try {
        if (status.type === "TEXT" && status.caption) {
          await messagingService.postTextStatus(
            status.account.instanceId,
            status.caption
          );
        } else if (
          (status.type === "IMAGE" || status.type === "VIDEO") &&
          status.mediaUrl
        ) {
          await messagingService.postMediaStatus(
            status.account.instanceId,
            status.type.toLowerCase() as "image" | "video",
            status.mediaUrl,
            status.caption ?? undefined
          );
        }

        await prisma.scheduledStatus.update({
          where: { id: statusId },
          data: { status: "POSTED", postedAt: new Date() },
        });
      } catch (error) {
        await prisma.scheduledStatus.update({
          where: { id: statusId },
          data: {
            status: "FAILED",
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
            retryCount: { increment: 1 },
          },
        });
        throw error; // Re-throw for Inngest retry
      }
    });

    return { statusId, result: "posted" };
  }
);
