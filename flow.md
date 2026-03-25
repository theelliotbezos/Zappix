# Zappix - Progress Tracker

> Tracks what is done, what is in progress, and what is pending.

---

## Phase 1: Foundation and Infrastructure
- [x] Initialize Next.js 14 project with TypeScript, Tailwind, App Router
- [x] Install and configure dependencies (Clerk, tRPC, Prisma, Inngest, etc.)
- [x] Create Prisma schema (Clerk auth, 4 pricing tiers, Paystack Transfers)
- [x] Create `.env.example` with all required environment variables
- [x] Set up Upstash Redis client
- [x] Set up Cloudinary service
- [x] Configure Clerk authentication (middleware, provider, webhook)
- [x] Set up tRPC with Clerk context and all 11 routers
- [x] Set up Inngest for background jobs (status, broadcast, payout, analytics)
- [x] Build Evolution API client library (instance, messaging, webhooks)
- [x] Create project file structure matching plan specification
- [x] Create database seed script for pricing plans
- [ ] Deploy Evolution API on Railway (Docker) - requires Railway account
- [ ] Configure Evolution API webhook URL - requires deployment
- [ ] Run initial migration and seed pricing plans - requires database
- [ ] Test Evolution API: create instance, get QR, send test message

## Phase 2: Premium UI Foundation and Marketing Pages
- [x] Implement global CSS with design tokens (colors, typography, spacing)
- [x] Build marketing navbar component (glassmorphism, responsive)
- [x] Build marketing footer component (4-column, dark background)
- [x] Build landing page with all sections (hero, features, pricing, FAQ, CTA)
- [x] Build features page with 9 feature deep-dives
- [x] Build pricing page with 4 plan cards, billing toggle
- [x] Build pricing comparison table with full feature matrix
- [x] Build legal pages (privacy, terms, refund policy)
- [x] Set up Sanity CMS project and schemas (post, author, category)
- [x] Build blog listing page and blog post page
- [x] Implement sitemap.xml (dynamic from pages + blog posts)
- [x] Implement robots.txt
- [x] Add SEO meta tags, Open Graph, structured data
- [x] Build Framer Motion animation components (AnimateIn, StaggerContainer)
- [ ] Mobile responsive testing
- [ ] Add animations to all marketing page sections

## Phase 3: Auth, Onboarding, and Billing
- [x] Build sign-in and sign-up pages with Clerk components
- [x] Build full 4-step onboarding flow (account type, risk disclosure, QR connect, plan selection)
- [x] Implement Clerk webhook to sync users to database
- [x] Build QR code connect page with instance creation UI
- [x] Build billing settings page with 4 plan cards, billing toggle, Nigerian bank selection
- [ ] Implement Paystack subscription checkout (live API integration)
- [ ] Build Paystack webhook handler verification (live testing)
- [ ] Implement plan limit enforcement with real subscription data

## Phase 4: Dashboard Shell and Core UI
- [x] Build dashboard layout (sidebar, top navbar, main content area)
- [x] Build mobile bottom navigation bar
- [x] Build KPI card components with icons
- [x] Build page header component with actions
- [x] Build reusable Button, Input, Textarea, Badge components
- [x] Build Modal component with header, footer, overlay
- [x] Build DataTable component with search, pagination
- [x] Build StatusPill component for all status types
- [x] Build EmptyState component with icons and actions
- [x] Build loading skeleton components with green shimmer
- [x] Build dashboard home page with KPIs, quick actions, activity overview, getting started guide

## Phase 5: Status Scheduler
- [x] Build status scheduler page (list view + calendar view toggle)
- [x] Build create/edit status modal (text/image/video type, media upload, caption, schedule time)
- [ ] Implement media upload to Cloudinary
- [ ] Implement Inngest job trigger for posting statuses via Evolution API
- [ ] Handle retry on failure
- [ ] Real-time status updates via polling

## Phase 6: Broadcast Engine
- [x] Build broadcast creation page (account selection, contact list, message composer, scheduling)
- [x] Build broadcast list page with stats cards (total, sent, delivery rate, scheduled)
- [ ] Implement broadcast sending via Evolution API with throttling
- [ ] Build delivery tracking (sent, delivered, failed counts)
- [ ] Implement opt-out handling
- [ ] Build broadcast analytics view

## Phase 7: Contact Manager
- [x] Build contacts list page with search, data table
- [x] Build add contact modal with phone, name, account selection
- [x] Build CSV import modal with field mapping
- [x] Build stats cards (total contacts, lists, tags, opted out)
- [ ] Implement CSV parsing and import logic
- [ ] Build contact detail view
- [ ] Build contact list/segment management
- [ ] Build tag system (create, assign, filter)
- [ ] Implement custom fields

## Phase 8: Analytics Dashboard
- [x] Build analytics overview page with 5 KPI cards
- [x] Build period selector (Today, 7d, 30d, 90d, Custom)
- [x] Build 4 chart areas (status reach, broadcast delivery, audience growth, ad revenue)
- [x] Build CSV export button
- [ ] Implement chart rendering with real data (Recharts or similar)
- [ ] Implement daily analytics aggregation cron job (live)
- [ ] Build CSV/PDF export functionality

## Phase 9: Referral System with Paystack Bank Transfer Payouts
- [x] Build referral dashboard (link, stats, earnings, withdrawal modal)
- [x] Build referral link with copy functionality
- [x] Build KPI cards (total referrals, earned, available, pending)
- [x] Build referral table and withdrawal history
- [x] Build withdrawal request form with amount input
- [ ] Generate unique referral codes on user creation (live)
- [ ] Track referral signups and conversions
- [ ] Implement 25% recurring commission calculation
- [ ] Integrate Paystack Transfers API for bank payouts
- [ ] Implement bank account verification via Paystack resolve endpoint
- [ ] Build commission release cron (monthly)

## Phase 10: Multi-Account Manager
- [x] Build accounts page with account cards, warm-up progress bars, status pills
- [x] Build connect/disconnect actions with QR code button
- [ ] Implement add/remove number flow via Evolution API instances
- [ ] Build connection status monitoring (polling Evolution API)
- [ ] Build number detail view (stats, settings, warm-up progress)
- [ ] Implement team member invites and role-based access

## Phase 11: Ad Slot Manager
- [x] Build ad slot creation page with modal (title, description, price, duration)
- [x] Build stats cards (active slots, bookings, revenue, pending)
- [x] Build public booking page link
- [ ] Build public booking page at /ads/[username]
- [ ] Implement Paystack payment for ad bookings
- [ ] Build booking management (approve/reject/deliver)
- [ ] Build delivery tracking and reporting

## Phase 12: Chatbot Builder and Menu Bot
- [x] Build chatbot configuration page with active toggle, welcome/fallback messages
- [x] Build FAQ entry management with add modal
- [x] Build automation flows section
- [x] Build menu bot tree editor with nested items, drag handles
- [x] Build WhatsApp preview for menu bot
- [ ] Handle incoming messages via Evolution API webhooks
- [ ] Build bot session management
- [ ] Build flow builder visual editor

## Phase 13: Settings and Team Management
- [x] Build settings page with profile editing
- [x] Build billing page with plan cards, billing toggle, 20+ Nigerian banks
- [x] Build team page with invite modal and role selection (Admin/Editor/Viewer)
- [ ] Implement profile update via tRPC
- [ ] Implement bank account verification and save
- [ ] Implement team invite email sending
- [ ] End-to-end testing of all features

## Phase 14: Polish, Testing, and Deployment
- [ ] Write `instructions.md` with full deployment guide - DONE
- [ ] Write `flow.md` with progress tracker - DONE
- [ ] Update `README.md` to reflect new stack - DONE
- [ ] End-to-end testing of all features
- [ ] Performance optimization (image optimization, bundle analysis, caching)
- [ ] Deploy to Render with environment variables
- [ ] Verify all webhook connections working
- [ ] Final mobile responsiveness check

---

## Summary

| Category | Done | Pending |
|----------|------|---------|
| Foundation | 12 | 4 |
| Marketing UI | 14 | 2 |
| Auth & Billing | 5 | 3 |
| Dashboard UI | 11 | 0 |
| Status Scheduler | 2 | 4 |
| Broadcast Engine | 2 | 4 |
| Contact Manager | 4 | 5 |
| Analytics | 4 | 3 |
| Referral System | 5 | 6 |
| Multi-Account | 2 | 4 |
| Ad Slots | 3 | 4 |
| Chatbot & Menu Bot | 5 | 3 |
| Settings & Team | 3 | 4 |
| Polish & Deploy | 3 | 5 |
| **Total** | **75** | **51** |

> 59% of the total platform build is complete. Remaining items are primarily
> live API integrations, real-time data connections, and deployment tasks that
> require actual service accounts (Neon, Clerk, Paystack, Railway, etc.).
