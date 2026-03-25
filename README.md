# Zappix

> The Operating System for WhatsApp TV Businesses
> Domain: **zappix.ng**

---

## Overview

Zappix is a production-ready SaaS platform built for Nigerian WhatsApp TV businesses. It provides tools for scheduling WhatsApp statuses, sending broadcasts, managing contacts, selling ad slots, building chatbots, and more -- all from a single premium dashboard.

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

1. **Status Scheduler** - Schedule and auto-post WhatsApp statuses
2. **Broadcast Engine** - Send messages to thousands with smart throttling
3. **Contact Manager** - Import, tag, and segment contacts
4. **Analytics Dashboard** - Track reach, delivery, growth, and revenue
5. **Ad Slot Manager** - Create bookable ad slots with Paystack payments
6. **Chatbot Builder** - Build FAQ bots and auto-responders
7. **Menu Bot** - Interactive WhatsApp menu system
8. **Multi-Account Manager** - Manage multiple WhatsApp numbers
9. **Referral System** - 25% recurring commission with bank payouts

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

See [instructions.md](./instructions.md) for the full deployment guide.

---

## Project Structure

```
src/
  app/
    (marketing)/     # Landing, features, pricing, blog, legal pages
    (auth)/          # Sign-in, sign-up, onboarding
    app/             # Protected dashboard pages
    api/             # tRPC, webhooks, cron, Inngest
  server/
    trpc/            # tRPC routers and context
    evolution/       # Evolution API client library
    services/        # Paystack, Resend, Sanity, Cloudinary
    inngest/         # Background job functions
    middleware/      # Plan limit enforcement
  lib/               # Prisma, Redis, utils, constants
  components/
    marketing/       # Navbar, hero, features, pricing, footer
    dashboard/       # Sidebar, top navbar, KPI cards
    shared/          # Logo, loading skeletons, SEO
    ui/              # shadcn/ui components
prisma/
  schema.prisma      # Database schema
  seed.ts            # Pricing plan seeder
sanity/
  schemas/           # Blog CMS schemas
```

---

## Documentation

- [instructions.md](./instructions.md) - Full deployment guide
- [flow.md](./flow.md) - Progress tracker
- [ROADMAP.md](./ROADMAP.md) - Development roadmap
- [UI-UX-DESIGN-SPEC.md](./UI-UX-DESIGN-SPEC.md) - Design specification

---

*Built for Nigeria's WhatsApp economy.*
