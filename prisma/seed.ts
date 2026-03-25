import { PrismaClient } from "@prisma/client";
import { PRICING_PLANS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed pricing plans
  for (const plan of Object.values(PRICING_PLANS)) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        maxWhatsappAccounts: plan.maxWhatsappAccounts,
        maxContacts: plan.maxContacts,
        maxBroadcastsPerMonth: plan.maxBroadcastsPerMonth,
        maxStatusPostsPerMonth: plan.maxStatusPostsPerMonth,
        maxTeamMembers: plan.maxTeamMembers,
        maxAdSlots: plan.maxAdSlots,
        maxStorageGb: plan.maxStorageGb,
        analyticsRetentionDays: plan.analyticsRetentionDays,
        hasCsvExport: plan.hasCsvExport,
        hasPdfExport: plan.hasPdfExport,
        hasApiAccess: plan.hasApiAccess,
        chatbotLevel: plan.chatbotLevel,
        supportLevel: plan.supportLevel,
      },
      create: {
        name: plan.name,
        slug: plan.slug,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        maxWhatsappAccounts: plan.maxWhatsappAccounts,
        maxContacts: plan.maxContacts,
        maxBroadcastsPerMonth: plan.maxBroadcastsPerMonth,
        maxStatusPostsPerMonth: plan.maxStatusPostsPerMonth,
        maxTeamMembers: plan.maxTeamMembers,
        maxAdSlots: plan.maxAdSlots,
        maxStorageGb: plan.maxStorageGb,
        analyticsRetentionDays: plan.analyticsRetentionDays,
        hasCsvExport: plan.hasCsvExport,
        hasPdfExport: plan.hasPdfExport,
        hasApiAccess: plan.hasApiAccess,
        chatbotLevel: plan.chatbotLevel,
        supportLevel: plan.supportLevel,
      },
    });

    console.log(`  Seeded plan: ${plan.name}`);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
