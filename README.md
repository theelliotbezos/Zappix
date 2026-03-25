# Zappix

> The Operating System for WhatsApp TV Businesses
> Domain: **zappix.ng**

---

## Overview

Zappix is a production-ready SaaS platform built for Nigerian WhatsApp TV businesses. It provides tools for scheduling WhatsApp statuses, sending broadcasts, managing contacts, selling ad slots, building chatbots, and more -- all from a single premium dashboard.

**Current Status**: 59% complete (75/126 tasks done). All UI pages, components, server infrastructure, and API routes are built. Remaining work is primarily live API integrations and deployment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| API | tRPC |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma |
| Cache/Queues | Upstash Redis + Inngest |
| WhatsApp Engine | Evolution API v2 (Railway) |
| Auth | Clerk |
| Payments | Paystack |
| Referral Payouts | Paystack Transfers (bank) |
| Email | Resend |
| Blog | Sanity CMS |
| Media Storage | Cloudinary |
| Frontend Hosting | Render |
| Styling | Tailwind CSS + shadcn/ui + Framer Motion |

---

## Features

1. **Status Scheduler** - Schedule and auto-post WhatsApp statuses with text, image, or video
2. **Broadcast Engine** - Send messages to thousands with smart throttling and delivery tracking
3. **Contact Manager** - Import, tag, segment contacts with CSV import and search
4. **Analytics Dashboard** - Track reach, delivery, growth, and revenue with period selectors
5. **Ad Slot Manager** - Create bookable ad slots with Paystack payments and public booking pages
6. **Chatbot Builder** - Build FAQ bots, auto-responders, and automation flows
7. **Menu Bot** - Interactive WhatsApp menu system with tree editor and live preview
8. **Multi-Account Manager** - Manage multiple WhatsApp numbers with warm-up tracking
9. **Referral System** - 25% recurring commission with bank payouts to 20+ Nigerian banks

---

## Pricing

| Plan | Monthly | Yearly (per month) | WhatsApp Accounts | Contacts |
|------|---------|-------------------|-------------------|----------|
| Starter | N10,000 | N8,300 | 1 | 7,500 |
| Growth | N25,000 | N20,750 | 3 | 37,500 |
| Business | N55,000 | N45,650 | 7 | 112,500 |
| Scale | N100,000 | N83,000 | 15 | 300,000 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Accounts on: Neon, Clerk, Railway, Paystack, Resend, Sanity, Cloudinary, Upstash, Inngest

### Installation

```bash
git clone https://github.com/digimajextensions/Zappix.git
cd Zappix
npm install
cp .env.example .env.local
# Fill in your environment variables
```

### Database Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

See [instructions.md](./instructions.md) for the full 14-step deployment guide.

---

## Project Structure

```
src/
  app/
    (marketing)/           # Landing, features, pricing, blog, legal pages
    (auth)/                # Sign-in, sign-up, onboarding (4-step flow)
    app/                   # Protected dashboard pages
      dashboard/           # Home with KPIs, quick actions, getting started
      status-scheduler/    # Schedule statuses (text/image/video)
      broadcasts/          # Create and send broadcasts
      contacts/            # Manage contacts, import CSV, tags
      analytics/           # Charts, KPIs, period selector
      referrals/           # Referral link, earnings, withdrawals
      ad-slots/            # Create ad slots, manage bookings
      chatbot/             # FAQ entries, automation flows
      menu-bot/            # Interactive menu tree editor
      accounts/            # Multi-account manager
      connect/             # QR code connection flow
      settings/            # Profile, billing, team management
    api/                   # tRPC, webhooks, cron, Inngest
  server/
    trpc/                  # 11 tRPC routers and context
    evolution/             # Evolution API client library
    services/              # Paystack, Resend, Sanity, Cloudinary
    inngest/               # 4 background job functions
    middleware/             # Plan limit enforcement
  lib/                     # Prisma, Redis, utils, constants
  components/
    marketing/             # Navbar, hero, features, pricing, footer, comparison
    dashboard/             # Sidebar, top navbar, KPI cards, mobile nav
    shared/                # Logo, loading skeletons, SEO, animations
    ui/                    # Button, Input, Modal, DataTable, Badge, StatusPill, EmptyState
prisma/
  schema.prisma            # 25+ models
  seed.ts                  # Pricing plan seeder
sanity/
  schemas/                 # Blog CMS schemas (post, author, category)
```

---

## Documentation

- [instructions.md](./instructions.md) - Full 14-step deployment guide
- [flow.md](./flow.md) - Detailed progress tracker (75 done / 51 pending)
- [ROADMAP.md](./ROADMAP.md) - Original development roadmap
- [UI-UX-DESIGN-SPEC.md](./UI-UX-DESIGN-SPEC.md) - Design specification

---

## What Is Built vs What Needs Live Integration

### Built (ready to use once services are connected)
- All 13 dashboard pages with full UI, modals, forms, and data tables
- All 6 marketing pages with premium design
- 4-step onboarding flow
- 11 tRPC API routers with input validation and plan limit checks
- Evolution API client with typed endpoints
- Paystack integration for subscriptions and bank transfers
- Webhook handlers for Clerk, Paystack, and Evolution API
- Inngest background jobs for status posting, broadcasts, payouts, analytics
- Prisma schema with 25+ models and seed script
- SEO: sitemap, robots.txt, meta tags, structured data

### Needs Live Integration (requires service accounts)
- Database migration and seeding (needs Neon connection)
- Clerk authentication (needs Clerk keys)
- Evolution API deployment (needs Railway)
- Paystack payment processing (needs Paystack keys)
- Media uploads (needs Cloudinary credentials)
- Blog content (needs Sanity project)
- Email sending (needs Resend API key)
- Background job execution (needs Inngest)
- Chart rendering with real analytics data
- End-to-end testing across all features

---

*Built for Nigeria's WhatsApp economy.*
