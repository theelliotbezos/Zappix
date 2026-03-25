import { prisma } from "@/lib/prisma";

interface PlanLimits {
  maxWhatsappAccounts: number;
  maxContacts: number;
  maxBroadcastsPerMonth: number;
  maxStatusPostsPerMonth: number;
  maxTeamMembers: number;
  maxAdSlots: number;
  maxStorageGb: number;
}

/**
 * Get the current user's plan limits.
 */
export async function getUserPlanLimits(
  userId: string
): Promise<PlanLimits> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });

  if (!subscription || !subscription.plan) {
    // Return Starter defaults if no subscription
    return {
      maxWhatsappAccounts: 1,
      maxContacts: 7_500,
      maxBroadcastsPerMonth: 15,
      maxStatusPostsPerMonth: 45,
      maxTeamMembers: 1,
      maxAdSlots: 2,
      maxStorageGb: 2,
    };
  }

  return {
    maxWhatsappAccounts: subscription.plan.maxWhatsappAccounts,
    maxContacts: subscription.plan.maxContacts,
    maxBroadcastsPerMonth: subscription.plan.maxBroadcastsPerMonth,
    maxStatusPostsPerMonth: subscription.plan.maxStatusPostsPerMonth,
    maxTeamMembers: subscription.plan.maxTeamMembers,
    maxAdSlots: subscription.plan.maxAdSlots,
    maxStorageGb: subscription.plan.maxStorageGb,
  };
}

/**
 * Check if a user has reached a specific limit.
 */
export async function checkLimit(
  userId: string,
  limitType: keyof PlanLimits,
  currentCount: number
): Promise<{ allowed: boolean; limit: number; current: number }> {
  const limits = await getUserPlanLimits(userId);
  const limit = limits[limitType];

  return {
    allowed: currentCount < limit,
    limit,
    current: currentCount,
  };
}

/**
 * Get usage stats for a user relative to their plan limits.
 */
export async function getUsageStats(userId: string) {
  const limits = await getUserPlanLimits(userId);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [accounts, contacts, broadcasts, statuses, teamMembers, adSlots] =
    await Promise.all([
      prisma.whatsAppAccount.count({ where: { userId } }),
      prisma.contact.count({ where: { userId } }),
      prisma.broadcast.count({
        where: {
          userId,
          createdAt: { gte: startOfMonth },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.scheduledStatus.count({
        where: { userId, createdAt: { gte: startOfMonth } },
      }),
      prisma.teamMember.count({ where: { userId } }),
      prisma.adSlot.count({ where: { userId } }),
    ]);

  return {
    accounts: { current: accounts, limit: limits.maxWhatsappAccounts },
    contacts: { current: contacts, limit: limits.maxContacts },
    broadcasts: {
      current: broadcasts,
      limit: limits.maxBroadcastsPerMonth,
    },
    statuses: {
      current: statuses,
      limit: limits.maxStatusPostsPerMonth,
    },
    teamMembers: { current: teamMembers, limit: limits.maxTeamMembers },
    adSlots: { current: adSlots, limit: limits.maxAdSlots },
  };
}
