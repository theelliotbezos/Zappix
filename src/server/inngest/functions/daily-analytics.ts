import { inngest } from "../client";
import { prisma } from "@/lib/prisma";

/**
 * Inngest function: Aggregate daily analytics for all users.
 *
 * Runs as a daily cron job to create AnalyticsSnapshot records.
 */
export const dailyAnalyticsFunction = inngest.createFunction(
  {
    id: "analytics-daily",
    name: "Daily Analytics Aggregation",
  },
  { cron: "0 1 * * *" }, // Run at 1 AM daily
  async ({ step }) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all users with active subscriptions
    const users = await step.run("fetch-users", async () => {
      return prisma.user.findMany({
        where: {
          subscription: { status: "ACTIVE" },
        },
        select: { id: true },
      });
    });

    // Aggregate stats for each user
    await step.run("aggregate-stats", async () => {
      for (const user of users) {
        const [statusesPosted, broadcastsSent, contactsGained] =
          await Promise.all([
            prisma.scheduledStatus.count({
              where: {
                userId: user.id,
                postedAt: { gte: yesterday, lt: today },
              },
            }),
            prisma.broadcast.count({
              where: {
                userId: user.id,
                completedAt: { gte: yesterday, lt: today },
              },
            }),
            prisma.contact.count({
              where: {
                userId: user.id,
                createdAt: { gte: yesterday, lt: today },
              },
            }),
          ]);

        // Upsert analytics snapshot
        await prisma.analyticsSnapshot.upsert({
          where: {
            userId_date: {
              userId: user.id,
              date: yesterday,
            },
          },
          create: {
            userId: user.id,
            date: yesterday,
            statusesPosted,
            broadcastsSent,
            contactsGained,
          },
          update: {
            statusesPosted,
            broadcastsSent,
            contactsGained,
          },
        });
      }
    });

    return { usersProcessed: users.length };
  }
);
