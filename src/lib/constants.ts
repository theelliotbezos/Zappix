// ── App Constants ────────────────────────────────────────

export const APP_NAME = "Zappix";
export const APP_DOMAIN = "zappix.ng";
export const APP_DESCRIPTION =
  "The Operating System for WhatsApp TV Businesses";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zappix.ng";

// ── Pricing (amounts in kobo) ───────────────────────────

export const PRICING_PLANS = {
  starter: {
    name: "Starter",
    slug: "starter",
    priceMonthly: 1_000_000, // ₦10,000
    priceYearly: 9_960_000, // ₦99,600 (₦8,300/mo)
    maxWhatsappAccounts: 1,
    maxContacts: 7_500,
    maxBroadcastsPerMonth: 15,
    maxStatusPostsPerMonth: 45,
    maxTeamMembers: 1,
    maxAdSlots: 2,
    maxStorageGb: 2,
    analyticsRetentionDays: 7,
    hasCsvExport: false,
    hasPdfExport: false,
    hasApiAccess: false,
    chatbotLevel: "BASIC_MENU" as const,
    supportLevel: "NONE" as const,
  },
  growth: {
    name: "Growth",
    slug: "growth",
    priceMonthly: 2_500_000, // ₦25,000
    priceYearly: 24_900_000, // ₦249,000 (₦20,750/mo)
    maxWhatsappAccounts: 3,
    maxContacts: 37_500,
    maxBroadcastsPerMonth: 75,
    maxStatusPostsPerMonth: 225,
    maxTeamMembers: 3,
    maxAdSlots: 10,
    maxStorageGb: 10,
    analyticsRetentionDays: 30,
    hasCsvExport: false,
    hasPdfExport: false,
    hasApiAccess: false,
    chatbotLevel: "FULL_FAQ" as const,
    supportLevel: "EMAIL" as const,
  },
  business: {
    name: "Business",
    slug: "business",
    priceMonthly: 5_500_000, // ₦55,000
    priceYearly: 54_780_000, // ₦547,800 (₦45,650/mo)
    maxWhatsappAccounts: 7,
    maxContacts: 112_500,
    maxBroadcastsPerMonth: 225,
    maxStatusPostsPerMonth: 600,
    maxTeamMembers: 7,
    maxAdSlots: 30,
    maxStorageGb: 30,
    analyticsRetentionDays: 90,
    hasCsvExport: true,
    hasPdfExport: false,
    hasApiAccess: true,
    chatbotLevel: "FULL_LEAD_CAPTURE" as const,
    supportLevel: "EMAIL_WHATSAPP" as const,
  },
  scale: {
    name: "Scale",
    slug: "scale",
    priceMonthly: 10_000_000, // ₦100,000
    priceYearly: 99_600_000, // ₦996,000 (₦83,000/mo)
    maxWhatsappAccounts: 15,
    maxContacts: 300_000,
    maxBroadcastsPerMonth: 600,
    maxStatusPostsPerMonth: 1_500,
    maxTeamMembers: 15,
    maxAdSlots: 80,
    maxStorageGb: 80,
    analyticsRetentionDays: 365,
    hasCsvExport: true,
    hasPdfExport: true,
    hasApiAccess: true,
    chatbotLevel: "FULL_ALL_FLOWS" as const,
    supportLevel: "DEDICATED" as const,
  },
} as const;

// ── Referral System ─────────────────────────────────────

export const REFERRAL_COMMISSION_PERCENT = 25;
export const COMMISSION_HOLD_DAYS = 30;
export const MIN_WITHDRAWAL_KOBO = 500_000; // ₦5,000

// ── Paystack Transfer Fees (in kobo) ────────────────────

export const PAYSTACK_TRANSFER_FEE_SMALL = 1_000; // ₦10 for < ₦5,000
export const PAYSTACK_TRANSFER_FEE_MEDIUM = 2_500; // ₦25 for ₦5,001 - ₦50,000
export const PAYSTACK_TRANSFER_FEE_LARGE = 5_000; // ₦50 for > ₦50,000

// ── WhatsApp Throttling ─────────────────────────────────

export const BROADCAST_DELAY_MS = 3_000; // 3 seconds between messages
export const STATUS_POST_DELAY_MS = 2_000; // 2 seconds between status posts
export const MAX_RETRIES = 3;

// ── SEO ─────────────────────────────────────────────────

export const SEO_DEFAULTS = {
  title: "Zappix - The Operating System for WhatsApp TV Businesses",
  description:
    "Schedule WhatsApp statuses, send broadcasts, manage contacts, sell ad slots, and grow your WhatsApp TV business with Zappix.",
  ogImage: "/og-image.png",
  twitterHandle: "@zappixng",
};

// ── Navigation ──────────────────────────────────────────

export const MARKETING_NAV_ITEMS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
] as const;

export const DASHBOARD_NAV_ITEMS = [
  { label: "Dashboard", href: "/app/dashboard", icon: "LayoutDashboard" },
  { label: "Status Scheduler", href: "/app/status-scheduler", icon: "Clock" },
  { label: "Broadcasts", href: "/app/broadcasts", icon: "Send" },
  { label: "Contacts", href: "/app/contacts", icon: "Users" },
  { label: "Analytics", href: "/app/analytics", icon: "BarChart3" },
  { label: "Ad Slots", href: "/app/ad-slots", icon: "Megaphone" },
  { label: "Chatbot", href: "/app/chatbot", icon: "Bot" },
  { label: "Menu Bot", href: "/app/menu-bot", icon: "List" },
  { label: "Accounts", href: "/app/accounts", icon: "Smartphone" },
  { label: "Referrals", href: "/app/referrals", icon: "Gift" },
  { label: "Settings", href: "/app/settings", icon: "Settings" },
] as const;
