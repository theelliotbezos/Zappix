import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { messagingService } from "@/server/evolution/messaging";

/**
 * Inngest function: Send a broadcast to all recipients.
 *
 * Handles throttled sending and delivery tracking.
 */
export const sendBroadcastFunction = inngest.createFunction(
  {
    id: "broadcast-send",
    name: "Send Broadcast",
    retries: 1, // Broadcasts handle their own per-message retries
  },
  { event: "broadcast/send" },
  async ({ event, step }) => {
    const { broadcastId } = event.data as { broadcastId: string };

    // Fetch broadcast and recipients
    const broadcast = await step.run("fetch-broadcast", async () => {
      return prisma.broadcast.findUnique({
        where: { id: broadcastId },
        include: {
          account: true,
          recipients: { include: { contact: true } },
        },
      });
    });

    if (!broadcast || !broadcast.account) {
      throw new Error(`Broadcast ${broadcastId} not found`);
    }

    // Mark as sending
    await step.run("mark-sending", async () => {
      await prisma.broadcast.update({
        where: { id: broadcastId },
        data: {
          status: "SENDING",
          startedAt: new Date(),
          totalRecipients: broadcast.recipients.length,
        },
      });
    });

    // Send to all recipients
    const results = await step.run("send-messages", async () => {
      const numbers = broadcast.recipients.map(
        (r) => r.contact.phoneNumber
      );

      if (broadcast.messageType === "TEXT") {
        return messagingService.broadcastText(
          broadcast.account.instanceId,
          numbers,
          broadcast.messageBody
        );
      } else if (broadcast.mediaUrl) {
        return messagingService.broadcastMedia(
          broadcast.account.instanceId,
          numbers,
          broadcast.mediaUrl,
          broadcast.messageType.toLowerCase() as
            | "image"
            | "video"
            | "document"
            | "audio",
          broadcast.messageBody
        );
      }

      return [];
    });

    // Update delivery stats
    await step.run("update-stats", async () => {
      const sent = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      await prisma.broadcast.update({
        where: { id: broadcastId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          sentCount: sent,
          failedCount: failed,
        },
      });

      // Update individual recipient statuses
      for (const result of results) {
        const recipient = broadcast.recipients.find(
          (r) => r.contact.phoneNumber === result.number
        );
        if (recipient) {
          await prisma.broadcastRecipient.update({
            where: { id: recipient.id },
            data: {
              status: result.success ? "SENT" : "FAILED",
              sentAt: result.success ? new Date() : undefined,
              errorMessage: result.error,
            },
          });
        }
      }
    });

    return { broadcastId, sent: results.filter((r) => r.success).length };
  }
);
