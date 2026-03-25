# ⚡ Zappix — Full Development Roadmap
> The Operating System for WhatsApp TV Businesses
> Domain: **zappix.ng**

**21 weeks · 11 phases · 9 features · v1.0 launch at Week 11 · v2.0 at Week 21**

> All phase files have been consolidated into this single document. Each phase includes exact tasks, code snippets, file structures, and acceptance criteria.

---

## Table of Contents

- [Phase 1 — Foundation & Infrastructure (Weeks 1–2)](#phase-1--foundation--infrastructure)
- [Phase 2 — Auth, Onboarding & Billing (Weeks 3–4)](#phase-2--auth-onboarding--billing)
- [Phase 3 — Status Scheduler (Weeks 5–6)](#phase-3--status-scheduler)
- [Phase 4 — Broadcast Engine (Weeks 7–8)](#phase-4--broadcast-engine)
- [Phase 5 — Analytics Dashboard (Week 9)](#phase-5--analytics-dashboard)
- [Phase 6 — Referral System (Week 10)](#phase-6--referral-system)
- [Phase 7 — Contact Manager (Weeks 12–13)](#phase-7--contact-manager)
- [Phase 8 — Multi-Account Manager (Weeks 14–15)](#phase-8--multi-account-manager)
- [Phase 9 — Ad Slot Manager (Weeks 16–17)](#phase-9--ad-slot-manager)
- [Phase 10 — Chatbot Builder (Weeks 18–19)](#phase-10--chatbot-builder)
- [Phase 11 — WhatsApp Menu Bot (Weeks 20–21)](#phase-11--whatsapp-menu-bot)

---

## 🚀 Launch Gates

### v1.0 Public Launch — End of Week 11
Phases 1–6 complete. Core product live at zappix.ng with:
- Status Scheduler
- Broadcast Engine
- Analytics Dashboard
- Referral System
- Founding member pricing active

### v2.0 Full Product — End of Week 21
All 11 phases complete. Every feature live.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| API | tRPC |
| Database | PostgreSQL 15 (self-hosted on Hetzner) |
| ORM | Prisma |
| Cache/Queues | Redis + BullMQ |
| WhatsApp | Baileys (@whiskeysockets/baileys) |
| Auth | NextAuth v5 + Google OAuth |
| Payments | Paystack |
| Hosting | Hetzner VPS (CX32 → CX42 → CX52) |
| Web Server | Nginx + Certbot (Let's Encrypt) |
| Process Manager | PM2 |
| CI/CD | GitHub Actions |
| Email | Resend |
| Styling | Tailwind CSS + shadcn/ui |

---

## ⚠️ Before You Start

1. Register **zappix.ng** domain
2. Create **Hetzner Cloud** account at hetzner.com
3. Create **Paystack** account at paystack.com
4. Create **Google Cloud Console** project for OAuth credentials
5. Create **Resend** account at resend.com
6. Create **GitHub** repository for the codebase
7. Create **Sentry** account for error monitoring

---


---

# Phase 1 — Foundation & Infrastructure
**Weeks 1–2 | "Build the bones"**

> At the end of this phase: A Hetzner server is live, your project is deployed, and a WhatsApp number can connect via QR code and send a test message.

---

## ✅ Acceptance Criteria
- [ ] Hetzner CX32 server running Ubuntu 24.04
- [ ] PostgreSQL, Redis, Nginx, PM2 installed and running
- [ ] zappix.ng pointing to your server with HTTPS working
- [ ] Next.js app deployed and visible at https://zappix.ng
- [ ] GitHub Actions deploys automatically on push to main
- [ ] Prisma schema created with all tables and first migration run
- [ ] Baileys connects a WhatsApp number via QR scan
- [ ] Baileys sends a test text message successfully
- [ ] Baileys posts a test WhatsApp Status successfully

---

## Step 1 — Provision Hetzner Server

### 1.1 Create the Server
1. Go to [hetzner.com](https://hetzner.com) → Cloud → New Project → Name it "Zappix"
2. Click **Add Server** with these settings:
   - **Location**: Falkenstein (FSN1) — best latency to Nigeria
   - **Image**: Ubuntu 24.04 LTS
   - **Type**: CX32 (4 vCPU, 8 GB RAM, 80 GB SSD) — ~€6.80/month
   - **Networking**: Enable public IPv4
   - **SSH Keys**: Add your public SSH key
   - **Backups**: Enable (+20% cost — strongly recommended)
   - **Name**: zappix-prod

3. Click **Create & Buy**. Note the server IP address.

### 1.2 Create a Hetzner Volume (Media Storage)
1. In the same project → **Volumes** → **Create Volume**
   - Size: 50 GB
   - Name: zappix-media
   - Server: attach to zappix-prod
2. Cost: €2.49/month

### 1.3 Configure Hetzner Firewall
1. **Firewalls** → **Create Firewall** → Name: "zappix-firewall"
2. Add these **Inbound Rules**:

| Protocol | Port | Source | Description |
|----------|------|--------|-------------|
| TCP | 22 | Your IP only | SSH |
| TCP | 80 | Any 0.0.0.0/0 | HTTP (redirected to HTTPS) |
| TCP | 443 | Any 0.0.0.0/0 | HTTPS |

> **Never** add rules for port 5432 (PostgreSQL) or 6379 (Redis) — these must only be accessible internally.

3. Apply firewall to zappix-prod server.

---

## Step 2 — Point Your Domain

In your domain registrar (wherever you bought zappix.ng):

1. Create an **A record**:
   - Host: `@`
   - Value: `YOUR_SERVER_IP`
   - TTL: 300

2. Create another **A record**:
   - Host: `www`
   - Value: `YOUR_SERVER_IP`
   - TTL: 300

Wait 5–30 minutes for DNS propagation before continuing.

---

## Step 3 — Initial Server Setup

SSH into your server:
```bash
ssh root@YOUR_SERVER_IP
```

Run the full setup script:

```bash
# ── Update system ──────────────────────────────────────────────────────────
apt update && apt upgrade -y

# ── Install Node.js 20 ────────────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version   # Should show v20.x.x

# ── Install PM2 ───────────────────────────────────────────────────────────
npm install -g pm2

# ── Install PostgreSQL 15 ─────────────────────────────────────────────────
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql
psql --version   # Should show PostgreSQL 15.x

# ── Install Redis ─────────────────────────────────────────────────────────
apt install -y redis-server
systemctl enable redis-server
cat >> /etc/redis/redis.conf << 'EOF'
maxmemory 2gb
maxmemory-policy allkeys-lru
bind 127.0.0.1
EOF
systemctl restart redis-server
redis-cli ping   # Should return PONG

# ── Install Nginx ─────────────────────────────────────────────────────────
apt install -y nginx
systemctl enable nginx

# ── Install Certbot (free SSL) ────────────────────────────────────────────
apt install -y certbot python3-certbot-nginx

# ── Install Git ───────────────────────────────────────────────────────────
apt install -y git

# ── Install build tools ───────────────────────────────────────────────────
apt install -y build-essential

# ── Create app user (never run app as root) ───────────────────────────────
adduser --disabled-password --gecos "" zappix
usermod -aG sudo zappix

# ── Mount Hetzner Volume ──────────────────────────────────────────────────
mkfs.ext4 /dev/disk/by-id/scsi-0HC_Volume_$(ls /dev/disk/by-id/ | grep HC_Volume | head -1 | cut -d_ -f4)
mkdir -p /mnt/zappix-media
mount /dev/disk/by-id/scsi-0HC_Volume_* /mnt/zappix-media
# Add to fstab for auto-mount on reboot
echo "/dev/disk/by-id/scsi-0HC_Volume_* /mnt/zappix-media ext4 defaults 0 0" >> /etc/fstab

# Create subdirectories
mkdir -p /mnt/zappix-media/{media,sessions,exports,backups}
chown -R zappix:zappix /mnt/zappix-media
```

---

## Step 4 — Set Up PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

-- Run these SQL commands:
CREATE DATABASE zappix;
CREATE USER zappix_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE zappix TO zappix_user;
ALTER DATABASE zappix OWNER TO zappix_user;
\q

# Allow local password auth
echo "host zappix zappix_user 127.0.0.1/32 md5" >> /etc/postgresql/15/main/pg_hba.conf
systemctl restart postgresql

# Test connection
psql -U zappix_user -h 127.0.0.1 -d zappix -c "SELECT 1;"
```

---

## Step 5 — Scaffold the Next.js Project

On your **local machine**:

```bash
# Create Next.js app
npx create-next-app@latest zappix \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd zappix

# Install all dependencies
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install @tanstack/react-query
npm install @prisma/client prisma
npm install next-auth@beta
npm install @auth/prisma-adapter
npm install bullmq ioredis
npm install @whiskeysockets/baileys
npm install zod
npm install react-hook-form @hookform/resolvers
npm install paystack
npm install resend
npm install recharts
npm install @dnd-kit/core @dnd-kit/sortable
npm install date-fns
npm install sharp  # image processing

# Install shadcn/ui
npx shadcn@latest init
# Choose: Default style, Slate base color, CSS variables: yes

# Install common shadcn components
npx shadcn@latest add button card input label select textarea
npx shadcn@latest add table badge dialog sheet tabs
npx shadcn@latest add dropdown-menu avatar progress toast
npx shadcn@latest add calendar popover separator skeleton

# Dev dependencies
npm install -D @types/node tsx
```

### 5.1 Project Structure

Create this folder structure:

```
zappix/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   └── page.tsx              # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── app/                      # Dashboard (protected)
│   │   │   └── dashboard/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── trpc/[trpc]/route.ts
│   │   │   └── webhooks/
│   │   │       └── paystack/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── server/
│   │   ├── trpc/
│   │   │   ├── routers/
│   │   │   │   └── index.ts
│   │   │   ├── context.ts
│   │   │   └── root.ts
│   │   ├── baileys/
│   │   │   ├── manager.ts
│   │   │   ├── sender.ts
│   │   │   └── session-store.ts
│   │   ├── queues/
│   │   │   └── index.ts
│   │   └── services/
│   │       ├── paystack.ts
│   │       └── email.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── components/
│       ├── ui/                       # shadcn components (auto-generated)
│       └── layout/
│           ├── navbar.tsx
│           └── sidebar.tsx
├── prisma/
│   └── schema.prisma
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Step 6 — Prisma Schema

Create `prisma/schema.prisma` with the full Zappix schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Auth ──────────────────────────────────────────────────────────────────────
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]

  // Zappix fields
  accountType   String?   // whatsapp_tv | business | agency
  planId        String?
  plan          Plan?     @relation(fields: [planId], references: [id])
  isFounder     Boolean   @default(false)
  onboarded     Boolean   @default(false)
  riskAccepted  Boolean   @default(false)
  riskAcceptedAt DateTime?

  whatsappNumbers   WhatsappNumber[]
  contactLists      ContactList[]
  contacts          Contact[]
  broadcasts        Broadcast[]
  scheduledStatuses ScheduledStatus[]
  adSlots           AdSlot[]
  bots              Bot[]
  menuBots          MenuBot[]
  teamMemberships   TeamMember[]      @relation("MemberOf")
  teamOwnerships    TeamMember[]      @relation("OwnerOf")
  referralCode      ReferralCode?
  referralsMade     Referral[]        @relation("ReferrerUser")
  referredBy        Referral?         @relation("ReferredUser")
  commissions       Commission[]
  withdrawals       Withdrawal[]
  activityLogs      ActivityLog[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ── Plans ─────────────────────────────────────────────────────────────────────
model Plan {
  id                   String  @id @default(cuid())
  name                 String  // creator | growth | agency
  monthlyPrice         Int     // in kobo
  yearlyPrice          Int
  founderMonthlyPrice  Int
  founderYearlyPrice   Int
  maxNumbers           Int?    // null = unlimited
  maxContacts          Int?
  maxBroadcastsMonth   Int?
  maxStatusMonth       Int?
  maxTeamMembers       Int?
  maxAdSlots           Int?
  storageGb            Int?
  hasAdvancedBot       Boolean @default(false)
  hasApiAccess         Boolean @default(false)
  hasFullAnalytics     Boolean @default(false)
  hasCsvExport         Boolean @default(false)
  hasPdfExport         Boolean @default(false)
  paystackPlanCode     String?
  paystackYearlyCode   String?
  users                User[]
}

// ── WhatsApp Numbers ──────────────────────────────────────────────────────────
model WhatsappNumber {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  phoneNumber      String
  displayName      String
  colourTag        String   @default("green")
  category         String   @default("whatsapp_tv") // whatsapp_tv | business | support
  connectionStatus String   @default("disconnected") // connected|reconnecting|disconnected|paused|suspended
  sessionPath      String?
  lastConnectedAt  DateTime?
  warmupDay        Int      @default(0)
  warmupComplete   Boolean  @default(false)
  isActive         Boolean  @default(true)
  notes            String?

  scheduledStatuses ScheduledStatus[]
  broadcasts        BroadcastNumber[]
  adSlots           AdSlotNumber[]
  bots              Bot[]
  activityLogs      ActivityLog[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, phoneNumber])
}

// ── Contacts ──────────────────────────────────────────────────────────────────
model Contact {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  phoneNumber  String
  firstName    String?
  lastName     String?
  email        String?
  city         String?
  state        String?
  source       String   @default("manual") // manual | csv_import | bot_capture
  isOptedOut   Boolean  @default(false)
  optedOutAt   DateTime?
  notes        String?
  customValues ContactCustomValue[]
  lists        ContactListMember[]
  tags         ContactTag[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, phoneNumber])
}

model ContactList {
  id        String              @id @default(cuid())
  userId    String
  user      User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  isDefault Boolean             @default(false)
  members   ContactListMember[]
  createdAt DateTime            @default(now())
}

model ContactListMember {
  contactId String
  listId    String
  contact   Contact     @relation(fields: [contactId], references: [id], onDelete: Cascade)
  list      ContactList @relation(fields: [listId], references: [id], onDelete: Cascade)
  addedAt   DateTime    @default(now())
  @@id([contactId, listId])
}

model Tag {
  id       String       @id @default(cuid())
  userId   String
  name     String
  colour   String       @default("green")
  contacts ContactTag[]
  @@unique([userId, name])
}

model ContactTag {
  contactId  String
  tagId      String
  contact    Contact  @relation(fields: [contactId], references: [id], onDelete: Cascade)
  tag        Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())
  @@id([contactId, tagId])
}

model CustomField {
  id         String               @id @default(cuid())
  userId     String
  name       String
  fieldType  String               // text | number | dropdown | date | boolean
  options    String?              // JSON for dropdown values
  sortOrder  Int                  @default(0)
  values     ContactCustomValue[]
}

model ContactCustomValue {
  id            String      @id @default(cuid())
  contactId     String
  customFieldId String
  value         String?
  contact       Contact     @relation(fields: [contactId], references: [id], onDelete: Cascade)
  customField   CustomField @relation(fields: [customFieldId], references: [id], onDelete: Cascade)
  @@unique([contactId, customFieldId])
}

// ── Scheduled Statuses ────────────────────────────────────────────────────────
model ScheduledStatus {
  id               String   @id @default(cuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  mediaUrl         String?
  mediaType        String   // image | video | gif | text
  caption          String?
  label            String?
  scheduledAt      DateTime
  postedAt         DateTime?
  status           String   @default("pending") // pending|processing|posted|failed|cancelled
  targetAll        Boolean  @default(true)
  errorMessage     String?
  bulkBatchId      String?
  targetNumbers    StatusTargetNumber[]

  createdAt DateTime @default(now())
}

model StatusTargetNumber {
  statusId  String
  numberId  String
  status    ScheduledStatus @relation(fields: [statusId], references: [id], onDelete: Cascade)
  @@id([statusId, numberId])
}

// ── Broadcasts ────────────────────────────────────────────────────────────────
model Broadcast {
  id            String            @id @default(cuid())
  userId        String
  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  messageType   String            // text | image | video | document | contact
  content       String            // JSON
  status        String            @default("draft") // draft|scheduled|sending|sent|failed|cancelled
  scheduledAt   DateTime?
  startedAt     DateTime?
  completedAt   DateTime?
  throttleSpeed String            @default("safe") // safe | normal | fast
  autoSplit     Boolean           @default(true)
  numbers       BroadcastNumber[]
  audiences     BroadcastAudience[]
  deliveries    BroadcastDelivery[]
  replies       BroadcastReply[]

  createdAt DateTime @default(now())
}

model BroadcastNumber {
  id          String    @id @default(cuid())
  broadcastId String
  numberId    String
  broadcast   Broadcast @relation(fields: [broadcastId], references: [id], onDelete: Cascade)
  number      WhatsappNumber @relation(fields: [numberId], references: [id])
  assigned    Int       @default(0)
  sent        Int       @default(0)
  delivered   Int       @default(0)
  failed      Int       @default(0)
}

model BroadcastAudience {
  broadcastId    String
  contactListId  String
  broadcast      Broadcast   @relation(fields: [broadcastId], references: [id], onDelete: Cascade)
  @@id([broadcastId, contactListId])
}

model BroadcastDelivery {
  id          String    @id @default(cuid())
  broadcastId String
  contactId   String
  numberId    String
  status      String    @default("queued") // queued | sent | delivered | failed
  sentAt      DateTime?
  deliveredAt DateTime?
  errorMessage String?
  broadcast   Broadcast @relation(fields: [broadcastId], references: [id], onDelete: Cascade)
}

model BroadcastReply {
  id          String    @id @default(cuid())
  broadcastId String
  contactPhone String
  message     String
  repliedAt   DateTime  @default(now())
  broadcast   Broadcast @relation(fields: [broadcastId], references: [id], onDelete: Cascade)
}

model OptOut {
  id                   String    @id @default(cuid())
  userId               String
  contactPhone         String
  optedOutViaBroadcast String?
  optedOutAt           DateTime  @default(now())
  isResubscribed       Boolean   @default(false)
  resubscribedAt       DateTime?
  @@unique([userId, contactPhone])
}

// ── Ad Slots ──────────────────────────────────────────────────────────────────
model AdSlot {
  id                   String         @id @default(cuid())
  userId               String
  user                 User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  name                 String
  slotType             String         // status | broadcast | combo
  estimatedReach       Int            @default(0)
  price                Int            // in kobo
  bookingMode          String         @default("both") // online | manual | both
  maxBookingsPerDay    Int            @default(3)
  creativeRequirements String?
  isActive             Boolean        @default(true)
  numbers              AdSlotNumber[]
  bookings             AdBooking[]

  createdAt DateTime @default(now())
}

model AdSlotNumber {
  slotId   String
  numberId String
  slot     AdSlot         @relation(fields: [slotId], references: [id], onDelete: Cascade)
  number   WhatsappNumber @relation(fields: [numberId], references: [id])
  @@id([slotId, numberId])
}

model AdBooking {
  id              String      @id @default(cuid())
  slotId          String
  ownerId         String
  slot            AdSlot      @relation(fields: [slotId], references: [id])
  clientName      String
  clientEmail     String?
  clientPhone     String?
  creativeUrl     String?
  caption         String?
  broadcastText   String?
  scheduledDate   DateTime
  status          String      @default("pending_approval") // pending_approval|approved|rejected|delivered|cancelled
  bookingMode     String      // online | manual
  amount          Int         // in kobo
  paystackRef     String?
  approvedAt      DateTime?
  deliveredAt     DateTime?
  rejectionReason String?
  delivery        AdDelivery?

  createdAt DateTime @default(now())
}

model AdDelivery {
  id               String    @id @default(cuid())
  bookingId        String    @unique
  booking          AdBooking @relation(fields: [bookingId], references: [id])
  statusViews      Int       @default(0)
  broadcastSent    Int       @default(0)
  broadcastFailed  Int       @default(0)
  broadcastReplies Int       @default(0)
  estimatedReach   Int       @default(0)
  deliveredAt      DateTime?
  reportSentAt     DateTime?
}

// ── Bots ──────────────────────────────────────────────────────────────────────
model Bot {
  id                  String      @id @default(cuid())
  userId              String
  user                User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  numberId            String
  number              WhatsappNumber @relation(fields: [numberId], references: [id])
  isEnabled           Boolean     @default(false)
  activeHoursStart    String?     // "08:00"
  activeHoursEnd      String?     // "22:00"
  greetingTrigger     String      @default("any")
  language            String      @default("en")
  humanTakeoverMins   Int         @default(30)
  reEngageMins        Int         @default(10)
  awayMessage         AwayMessage?
  menus               BotMenu[]
  faqEntries          FaqEntry[]
  flows               BotFlow[]
  sessions            BotSession[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AwayMessage {
  id               String  @id @default(cuid())
  botId            String  @unique
  bot              Bot     @relation(fields: [botId], references: [id], onDelete: Cascade)
  message          String
  scheduleType     String  @default("always") // always | custom_hours | weekends
  oneReplyPerHours Int     @default(24)
  isActive         Boolean @default(true)
}

model BotMenu {
  id             String     @id @default(cuid())
  botId          String
  bot            Bot        @relation(fields: [botId], references: [id], onDelete: Cascade)
  welcomeMessage String
  footerText     String?
  items          MenuItem[]
}

model MenuItem {
  id            String   @id @default(cuid())
  menuId        String
  menu          BotMenu  @relation(fields: [menuId], references: [id], onDelete: Cascade)
  number        Int
  label         String
  actionType    String   // faq | payment | lead_capture | order | submenu | escalate
  actionPayload String?  // JSON
  sortOrder     Int      @default(0)
}

model FaqEntry {
  id              String  @id @default(cuid())
  botId           String
  bot             Bot     @relation(fields: [botId], references: [id], onDelete: Cascade)
  triggerPhrases  String  // JSON array
  responseText    String
  isActive        Boolean @default(true)
}

model BotFlow {
  id           String         @id @default(cuid())
  botId        String
  bot          Bot            @relation(fields: [botId], references: [id], onDelete: Cascade)
  flowType     String         // lead_capture | order
  config       String         // JSON
  notifyOwner  Boolean        @default(true)
  isActive     Boolean        @default(true)
  submissions  BotSubmission[]
}

model BotSession {
  id            String    @id @default(cuid())
  botId         String
  bot           Bot       @relation(fields: [botId], references: [id])
  contactPhone  String
  currentFlowId String?
  currentStep   Int       @default(0)
  collectedData String?   // JSON
  status        String    @default("active") // active|completed|paused|escalated
  startedAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model BotSubmission {
  id           String   @id @default(cuid())
  flowId       String
  flow         BotFlow  @relation(fields: [flowId], references: [id])
  contactPhone String
  data         String   // JSON
  submissionType String // lead | order
  createdAt    DateTime @default(now())
}

// ── Menu Bot ──────────────────────────────────────────────────────────────────
model MenuBot {
  id               String     @id @default(cuid())
  userId           String
  user             User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  numberId         String
  triggerKeyword   String     @default("any")
  welcomeMessage   String
  footerText       String?
  sessionTimeoutMins Int      @default(10)
  language         String     @default("en")
  isActive         Boolean    @default(false)
  items            MenuBotItem[]

  createdAt DateTime @default(now())
}

model MenuBotItem {
  id           String   @id @default(cuid())
  menuBotId    String
  menuBot      MenuBot  @relation(fields: [menuBotId], references: [id], onDelete: Cascade)
  parentId     String?
  itemType     String   // product | service | download | submenu | action
  number       Int
  keyword      String?
  title        String
  description  String?
  price        String?
  imageUrl     String?
  fileUrl      String?
  ctaType      String?
  ctaPayload   String?  // JSON
  sortOrder    Int      @default(0)
  isActive     Boolean  @default(true)
}

// ── Referral System ───────────────────────────────────────────────────────────
model ReferralCode {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  code         String   @unique
  linkSlug     String   @unique
  isCustomised Boolean  @default(false)
  firstUsedAt  DateTime?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
}

model Referral {
  id             String    @id @default(cuid())
  referrerId     String
  referredUserId String    @unique
  referrer       User      @relation("ReferrerUser", fields: [referrerId], references: [id])
  referredUser   User      @relation("ReferredUser", fields: [referredUserId], references: [id])
  planId         String?
  status         String    @default("trial") // active | churned | trial | paused
  convertedAt    DateTime?
  churnedAt      DateTime?
  commissions    Commission[]
  createdAt      DateTime  @default(now())
}

model Commission {
  id                 String   @id @default(cuid())
  referralId         String
  referrerId         String
  referral           Referral @relation(fields: [referralId], references: [id])
  referrer           User     @relation(fields: [referrerId], references: [id])
  amount             Int      // in kobo
  status             String   @default("pending") // pending | available | withdrawn | reversed | paused
  billingCycleMonth  String   // "2026-03"
  paymentReference   String?
  releasedAt         DateTime?
  createdAt          DateTime @default(now())
}

model BankAccount {
  id                   String      @id @default(cuid())
  userId               String      @unique
  bankName             String
  accountNumber        String
  accountName          String
  paystackRecipientCode String?
  isVerified           Boolean     @default(false)
  createdAt            DateTime    @default(now())
  withdrawals          Withdrawal[]
}

model Withdrawal {
  id                String      @id @default(cuid())
  userId            String
  user              User        @relation(fields: [userId], references: [id])
  bankAccountId     String
  bankAccount       BankAccount @relation(fields: [bankAccountId], references: [id])
  amount            Int         // in kobo
  paystackTransferId String?
  status            String      @default("processing") // processing | completed | failed
  requestedAt       DateTime    @default(now())
  completedAt       DateTime?
}

// ── Team ──────────────────────────────────────────────────────────────────────
model TeamMember {
  id           String   @id @default(cuid())
  ownerId      String
  memberId     String
  owner        User     @relation("OwnerOf", fields: [ownerId], references: [id], onDelete: Cascade)
  member       User     @relation("MemberOf", fields: [memberId], references: [id], onDelete: Cascade)
  role         String   // admin | editor | viewer
  inviteEmail  String
  inviteStatus String   @default("pending") // pending | accepted | revoked
  invitedAt    DateTime @default(now())
  acceptedAt   DateTime?
  @@unique([ownerId, memberId])
}

// ── Analytics ─────────────────────────────────────────────────────────────────
model AnalyticsDaily {
  id                    String   @id @default(cuid())
  userId                String
  date                  DateTime @db.Date
  statusEstimatedReach  Int      @default(0)
  statusPostsPublished  Int      @default(0)
  broadcastsSent        Int      @default(0)
  messagesSent          Int      @default(0)
  messagesDelivered     Int      @default(0)
  broadcastReplies      Int      @default(0)
  optOuts               Int      @default(0)
  newContacts           Int      @default(0)
  totalContacts         Int      @default(0)
  adRevenue             Int      @default(0)
  adBookingsCount       Int      @default(0)
  botConversations      Int      @default(0)
  @@unique([userId, date])
}

// ── Activity Log ──────────────────────────────────────────────────────────────
model ActivityLog {
  id         String          @id @default(cuid())
  userId     String
  actorId    String
  user       User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  numberId   String?
  number     WhatsappNumber? @relation(fields: [numberId], references: [id])
  action     String
  targetType String?
  targetId   String?
  details    String?         // JSON
  ipAddress  String?
  createdAt  DateTime        @default(now())
}
```

---

## Step 7 — Environment Variables

Create `.env` on the server:

```bash
# Database
DATABASE_URL="postgresql://zappix_user:YOUR_PASSWORD@127.0.0.1:5432/zappix"

# Auth
NEXTAUTH_URL="https://zappix.ng"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
GOOGLE_CLIENT_ID="from Google Cloud Console"
GOOGLE_CLIENT_SECRET="from Google Cloud Console"

# Redis
REDIS_URL="redis://127.0.0.1:6379"

# Paystack
PAYSTACK_SECRET_KEY="sk_live_your_key_here"
PAYSTACK_PUBLIC_KEY="pk_live_your_key_here"
PAYSTACK_WEBHOOK_SECRET="from Paystack dashboard"

# Email
RESEND_API_KEY="re_your_key_here"

# Storage
MEDIA_PATH="/mnt/zappix-media/media"
SESSIONS_PATH="/mnt/zappix-media/sessions"
EXPORTS_PATH="/mnt/zappix-media/exports"

# App
NEXT_PUBLIC_APP_URL="https://zappix.ng"
NODE_ENV="production"
```

---

## Step 8 — Build the Baileys Connection Manager

Create `src/server/baileys/manager.ts`:

```typescript
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  WASocket,
  AnyMessageContent,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import path from 'path'
import fs from 'fs'

const SESSIONS_PATH = process.env.SESSIONS_PATH || '/mnt/zappix-media/sessions'

class WhatsAppManager {
  private connections = new Map<string, WASocket>()
  private qrCallbacks = new Map<string, (qr: string) => void>()
  private statusCallbacks = new Map<string, (status: string) => void>()

  async connect(numberId: string): Promise<WASocket> {
    if (this.connections.has(numberId)) {
      return this.connections.get(numberId)!
    }

    const sessionDir = path.join(SESSIONS_PATH, numberId)
    fs.mkdirSync(sessionDir, { recursive: true })

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, console as any),
      },
      printQRInTerminal: false,
      generateHighQualityLinkPreview: true,
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        const cb = this.qrCallbacks.get(numberId)
        if (cb) cb(qr)
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

        this.connections.delete(numberId)
        const statusCb = this.statusCallbacks.get(numberId)
        if (statusCb) statusCb(shouldReconnect ? 'reconnecting' : 'disconnected')

        if (shouldReconnect) {
          setTimeout(() => this.connect(numberId), 5000)
        }
      }

      if (connection === 'open') {
        const statusCb = this.statusCallbacks.get(numberId)
        if (statusCb) statusCb('connected')
      }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.key.fromMe && msg.message) {
          // Route to bot handler — implemented in Phase 10
          console.log('Incoming message on', numberId, 'from', msg.key.remoteJid)
        }
      }
    })

    this.connections.set(numberId, sock)
    return sock
  }

  onQR(numberId: string, callback: (qr: string) => void) {
    this.qrCallbacks.set(numberId, callback)
  }

  onStatus(numberId: string, callback: (status: string) => void) {
    this.statusCallbacks.set(numberId, callback)
  }

  async sendMessage(numberId: string, jid: string, content: AnyMessageContent) {
    const sock = await this.connect(numberId)
    return sock.sendMessage(jid, content)
  }

  async postStatus(numberId: string, content: AnyMessageContent, viewers: string[]) {
    const sock = await this.connect(numberId)
    return sock.sendMessage('status@broadcast', content, {
      statusJidList: viewers,
    })
  }

  async disconnect(numberId: string) {
    const sock = this.connections.get(numberId)
    if (sock) {
      await sock.logout()
      this.connections.delete(numberId)
    }
  }

  isConnected(numberId: string): boolean {
    return this.connections.has(numberId)
  }
}

// Singleton — one manager for the whole app
export const waManager = new WhatsAppManager()
```

---

## Step 9 — Configure Nginx

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/zappix << 'EOF'
server {
    listen 80;
    server_name zappix.ng www.zappix.ng;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name zappix.ng www.zappix.ng;

    # SSL — filled in by Certbot
    ssl_certificate /etc/letsencrypt/live/zappix.ng/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zappix.ng/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Critical for Baileys WebSocket connections
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
EOF

ln -s /etc/nginx/sites-available/zappix /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Get SSL certificate (DNS must be pointing to server first)
certbot --nginx -d zappix.ng -d www.zappix.ng --non-interactive --agree-tos -m your@email.com

# Auto-renewal cron
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

---

## Step 10 — GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Zappix to Hetzner

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Hetzner
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.HETZNER_IP }}
          username: zappix
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/zappix
            git pull origin main
            npm ci
            npx prisma migrate deploy
            npm run build
            pm2 restart zappix || pm2 start npm --name "zappix" -- start
            pm2 save
```

Add these **GitHub Secrets** in your repo settings:
- `HETZNER_IP` — your server IP
- `SSH_PRIVATE_KEY` — your private SSH key content

---

## Step 11 — Daily Database Backup

```bash
# Create backup script
cat > /home/zappix/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/mnt/zappix-media/backups"
pg_dump -U zappix_user -h 127.0.0.1 zappix > "$BACKUP_DIR/db_$DATE.sql"
find "$BACKUP_DIR" -name "db_*.sql" -mtime +7 -delete
echo "Backup completed: db_$DATE.sql"
EOF

chmod +x /home/zappix/backup-db.sh

# Add to crontab — 2AM daily
(crontab -l 2>/dev/null; echo "0 2 * * * /home/zappix/backup-db.sh >> /home/zappix/backup.log 2>&1") | crontab -
```

---

## Step 12 — Run First Migration and Test Baileys

```bash
# On server — switch to app user
su - zappix
cd ~/zappix

# Copy .env to server (do this via secure method, not git)
# Run migrations
npx prisma migrate deploy
npx prisma generate

# Build and start
npm run build
pm2 start npm --name "zappix" -- start
pm2 save
pm2 startup

# Test Baileys connection (create a quick test script)
node -e "
const { waManager } = require('./dist/server/baileys/manager');
waManager.onQR('test-number', (qr) => {
  console.log('QR CODE:', qr);
  console.log('Scan this QR code with WhatsApp');
});
waManager.connect('test-number');
"
```

---

## ✅ Phase 1 Complete When:
- [ ] https://zappix.ng loads the Next.js app with valid SSL
- [ ] GitHub push to main triggers automatic deploy
- [ ] PostgreSQL accepting connections from app
- [ ] Redis responding to ping
- [ ] Baileys connects a test WhatsApp number via QR scan
- [ ] Baileys successfully sends a text message
- [ ] Baileys successfully posts a test status
- [ ] Daily backup cron running

**➡️ Next: [PHASE-02-auth-billing.md](./PHASE-02-auth-billing.md)**


---

# Phase 2 — Auth, Onboarding & Billing
**Weeks 3–4 | "Get users in the door"**

> At the end of this phase: A user can sign up with Google, go through onboarding, connect a WhatsApp number, choose a plan, and pay via Paystack. The full entry funnel is working end-to-end.

---

## ✅ Acceptance Criteria
- [ ] Google OAuth sign-in and sign-up working at zappix.ng/login
- [ ] New user lands on onboarding after first login
- [ ] Onboarding: account type → connect number → choose plan → done
- [ ] Risk disclosure shown and checkbox acceptance logged to database
- [ ] QR code scan flow working in onboarding (connects real WhatsApp number)
- [ ] Warm-up programme starts automatically on number connection
- [ ] Paystack subscription created on plan selection
- [ ] Paystack webhook updates user plan in database
- [ ] Plan limits enforced — user on Creator plan cannot exceed 2 numbers
- [ ] Billing page shows current plan and payment history
- [ ] User lands on /app/dashboard after completing onboarding

---

## Step 1 — Configure Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → "Zappix"
3. **APIs & Services** → **OAuth consent screen**
   - User Type: External
   - App name: Zappix
   - Support email: your email
   - Authorised domain: `zappix.ng`
4. **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorised redirect URIs: `https://zappix.ng/api/auth/callback/google`
5. Copy **Client ID** and **Client Secret** to your `.env`

---

## Step 2 — NextAuth Configuration

Create `src/lib/auth.ts`:

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
    async signIn({ user }) {
      // Auto-create referral code on first signup
      const existing = await prisma.referralCode.findUnique({
        where: { userId: user.id! },
      })
      if (!existing && user.id) {
        const slug = generateSlug(user.name || user.email || user.id)
        await prisma.referralCode.create({
          data: {
            userId: user.id,
            code: slug.toUpperCase(),
            linkSlug: slug,
          },
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12) + Math.random().toString(36).slice(2, 6)
}
```

---

## Step 3 — Auth API Route

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

---

## Step 4 — Login & Signup Pages

Create `src/app/(auth)/login/page.tsx`:

```typescript
'use client'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your Zappix account</p>
        </div>
        <Button
          onClick={() => signIn('google', { callbackUrl: '/app/dashboard' })}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          Continue with Google
        </Button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-green-600 font-semibold">Start free trial</a>
        </p>
      </div>
    </div>
  )
}
```

---

## Step 5 — Onboarding Flow

Create `src/app/(auth)/onboarding/page.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'

const STEPS = ['account-type', 'risk-disclosure', 'connect-number', 'choose-plan', 'done']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [accountType, setAccountType] = useState('')
  const router = useRouter()

  const completeOnboarding = trpc.user.completeOnboarding.useMutation({
    onSuccess: () => router.push('/app/dashboard'),
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8">

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Step 1 — Account Type */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">What best describes you?</h2>
            <p className="text-gray-500 mb-6">This helps us set up your account correctly.</p>
            <div className="grid gap-3">
              {[
                { id: 'whatsapp_tv', label: '📺 WhatsApp TV Owner', desc: 'I run a WhatsApp TV channel and sell ad slots' },
                { id: 'business', label: '🏢 Business Owner', desc: 'I use WhatsApp to sell products or services' },
                { id: 'agency', label: '🏛️ Agency / Marketer', desc: 'I manage WhatsApp accounts for multiple clients' },
              ].map(type => (
                <button key={type.id}
                  onClick={() => { setAccountType(type.id); setStep(1) }}
                  className="text-left p-4 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all">
                  <div className="font-semibold">{type.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Risk Disclosure */}
        {step === 1 && (
          <RiskDisclosureStep onAccept={() => setStep(2)} />
        )}

        {/* Step 3 — Connect Number */}
        {step === 2 && (
          <ConnectNumberStep onConnected={() => setStep(3)} onSkip={() => setStep(3)} />
        )}

        {/* Step 4 — Choose Plan */}
        {step === 3 && (
          <ChoosePlanStep onSelected={() => setStep(4)} />
        )}

        {/* Step 5 — Done */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2">You&apos;re all set!</h2>
            <p className="text-gray-500 mb-6">Your Zappix account is ready. Let&apos;s grow your WhatsApp TV.</p>
            <button
              onClick={() => completeOnboarding.mutate({ accountType })}
              className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700">
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Risk Disclosure Component
function RiskDisclosureStep({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false)
  const acceptRisk = trpc.user.acceptRiskDisclosure.useMutation({
    onSuccess: onAccept,
  })

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">⚠️ Important — Please Read</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-gray-700 space-y-2">
        <p>Zappix connects to WhatsApp using the WhatsApp Web protocol — the same technology that powers WhatsApp Web on your browser.</p>
        <p><strong>Please understand:</strong></p>
        <ul className="list-disc pl-4 space-y-1">
          <li>WhatsApp may restrict or ban numbers used with third-party tools</li>
          <li>Zappix is not responsible for account bans</li>
          <li>Use established numbers (12+ months old) for best results</li>
          <li>New numbers must complete our 21-day warm-up programme</li>
          <li>Never use Zappix to send spam or unsolicited messages</li>
        </ul>
      </div>
      <label className="flex items-start gap-3 cursor-pointer mb-6">
        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 accent-green-600" />
        <span className="text-sm text-gray-700">
          I understand the risks and agree to use Zappix responsibly. I accept the{' '}
          <a href="/legal/terms" target="_blank" className="text-green-600 underline">Terms of Service</a>.
        </span>
      </label>
      <button
        disabled={!accepted || acceptRisk.isPending}
        onClick={() => acceptRisk.mutate()}
        className="w-full bg-green-600 text-white py-3 rounded-full font-bold disabled:opacity-50 hover:bg-green-700">
        {acceptRisk.isPending ? 'Saving...' : 'I Understand — Continue →'}
      </button>
    </div>
  )
}
```

---

## Step 6 — Paystack Plans Setup

In your Paystack dashboard, create these subscription plans:

| Plan Code | Name | Amount | Interval |
|-----------|------|--------|----------|
| PLN_creator_monthly | Creator Monthly | ₦15,000 | monthly |
| PLN_creator_yearly | Creator Yearly | ₦150,000 | annually |
| PLN_growth_monthly | Growth Monthly | ₦35,000 | monthly |
| PLN_growth_yearly | Growth Yearly | ₦350,000 | annually |
| PLN_agency_monthly | Agency Monthly | ₦75,000 | monthly |
| PLN_agency_yearly | Agency Yearly | ₦750,000 | annually |

Seed these into your database:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const plans = [
    {
      id: 'creator',
      name: 'creator',
      monthlyPrice: 1500000,    // ₦15,000 in kobo
      yearlyPrice: 15000000,
      founderMonthlyPrice: 1200000,
      founderYearlyPrice: 12000000,
      maxNumbers: 2,
      maxContacts: 10000,
      maxBroadcastsMonth: 20,
      maxStatusMonth: 60,
      maxTeamMembers: 1,
      maxAdSlots: 3,
      storageGb: 5,
      hasAdvancedBot: false,
      hasApiAccess: false,
      hasFullAnalytics: false,
      hasCsvExport: false,
      hasPdfExport: false,
      paystackPlanCode: 'PLN_creator_monthly',
      paystackYearlyCode: 'PLN_creator_yearly',
    },
    {
      id: 'growth',
      name: 'growth',
      monthlyPrice: 3500000,
      yearlyPrice: 35000000,
      founderMonthlyPrice: 2900000,
      founderYearlyPrice: 29000000,
      maxNumbers: 10,
      maxContacts: 100000,
      maxBroadcastsMonth: 200,
      maxStatusMonth: 500,
      maxTeamMembers: 5,
      maxAdSlots: 20,
      storageGb: 20,
      hasAdvancedBot: true,
      hasApiAccess: false,
      hasFullAnalytics: true,
      hasCsvExport: true,
      hasPdfExport: false,
      paystackPlanCode: 'PLN_growth_monthly',
      paystackYearlyCode: 'PLN_growth_yearly',
    },
    {
      id: 'agency',
      name: 'agency',
      monthlyPrice: 7500000,
      yearlyPrice: 75000000,
      founderMonthlyPrice: 6500000,
      founderYearlyPrice: 65000000,
      maxNumbers: null,
      maxContacts: null,
      maxBroadcastsMonth: null,
      maxStatusMonth: null,
      maxTeamMembers: null,
      maxAdSlots: null,
      storageGb: 100,
      hasAdvancedBot: true,
      hasApiAccess: true,
      hasFullAnalytics: true,
      hasCsvExport: true,
      hasPdfExport: true,
      paystackPlanCode: 'PLN_agency_monthly',
      paystackYearlyCode: 'PLN_agency_yearly',
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    })
  }
  console.log('Plans seeded')
}

main()
```

---

## Step 7 — Paystack Webhook Handler

Create `src/app/api/webhooks/paystack/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-paystack-signature')

  // Verify webhook authenticity
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex')

  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  switch (event.event) {
    case 'subscription.create':
      await handleSubscriptionCreate(event.data)
      break
    case 'charge.success':
      await handleChargeSuccess(event.data)
      break
    case 'subscription.disable':
      await handleSubscriptionDisable(event.data)
      break
    case 'transfer.success':
      await handleTransferSuccess(event.data)
      break
    case 'transfer.failed':
      await handleTransferFailed(event.data)
      break
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionCreate(data: any) {
  const userEmail = data.customer.email
  const planCode = data.plan.plan_code

  const plan = await prisma.plan.findFirst({
    where: {
      OR: [
        { paystackPlanCode: planCode },
        { paystackYearlyCode: planCode },
      ],
    },
  })

  if (plan) {
    await prisma.user.update({
      where: { email: userEmail },
      data: { planId: plan.id },
    })

    // Credit referral commission if applicable
    await creditReferralCommission(userEmail, plan)
  }
}

async function handleChargeSuccess(data: any) {
  // Handle recurring charge — trigger new commission for referrer
  const userEmail = data.customer.email
  const planCode = data.plan?.plan_code

  if (planCode) {
    const plan = await prisma.plan.findFirst({
      where: {
        OR: [
          { paystackPlanCode: planCode },
          { paystackYearlyCode: planCode },
        ],
      },
    })

    if (plan) {
      await creditReferralCommission(userEmail, plan)
    }
  }
}

async function handleSubscriptionDisable(data: any) {
  const userEmail = data.customer.email
  await prisma.user.update({
    where: { email: userEmail },
    data: { planId: null },
  })
}

async function handleTransferSuccess(data: any) {
  await prisma.withdrawal.updateMany({
    where: { paystackTransferId: data.transfer_code },
    data: { status: 'completed', completedAt: new Date() },
  })
}

async function handleTransferFailed(data: any) {
  await prisma.withdrawal.updateMany({
    where: { paystackTransferId: data.transfer_code },
    data: { status: 'failed' },
  })
}

async function creditReferralCommission(userEmail: string, plan: any) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } })
  if (!user) return

  const referral = await prisma.referral.findUnique({
    where: { referredUserId: user.id },
  })
  if (!referral || referral.status !== 'active') return

  const commission = Math.floor(plan.monthlyPrice * 0.25)
  const month = new Date().toISOString().slice(0, 7) // "2026-03"

  await prisma.commission.create({
    data: {
      referralId: referral.id,
      referrerId: referral.referrerId,
      amount: commission,
      status: 'pending',
      billingCycleMonth: month,
    },
  })
}
```

---

## Step 8 — Plan Limits Middleware

Create `src/server/trpc/middleware/plan-limits.ts`:

```typescript
import { TRPCError } from '@trpc/server'
import { prisma } from '@/lib/prisma'

export async function checkNumberLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      plan: true,
      whatsappNumbers: { where: { isActive: true } },
    },
  })

  if (!user?.plan) throw new TRPCError({ code: 'FORBIDDEN', message: 'No active plan' })
  if (user.plan.maxNumbers === null) return // unlimited

  if (user.whatsappNumbers.length >= user.plan.maxNumbers) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Your ${user.plan.name} plan allows up to ${user.plan.maxNumbers} WhatsApp numbers. Upgrade to add more.`,
    })
  }
}

export async function checkContactLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true, _count: { select: { contacts: true } } },
  })

  if (!user?.plan || user.plan.maxContacts === null) return

  if (user._count.contacts >= user.plan.maxContacts) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You have reached the contact limit on your ${user.plan.name} plan.`,
    })
  }
}

export async function checkBroadcastLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  })

  if (!user?.plan || user.plan.maxBroadcastsMonth === null) return

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const count = await prisma.broadcast.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
      status: { not: 'draft' },
    },
  })

  if (count >= user.plan.maxBroadcastsMonth) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You have used all ${user.plan.maxBroadcastsMonth} broadcasts for this month. Upgrade for more.`,
    })
  }
}
```

---

## Step 9 — Protected Route Middleware

Create `src/middleware.ts`:

```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAppRoute = req.nextUrl.pathname.startsWith('/app')
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/signup')

  if (isAppRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/app/dashboard', req.nextUrl))
  }

  // Redirect to onboarding if not completed
  if (isAppRoute && isLoggedIn && !req.auth?.user) {
    return NextResponse.redirect(new URL('/onboarding', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/app/:path*', '/login', '/signup', '/onboarding'],
}
```

---

## Step 10 — Warm-Up Auto-Enrolment

When a number connects, automatically enrol it in the warm-up programme. Add to your tRPC accounts router:

```typescript
// src/server/trpc/routers/accounts.ts
connectNumber: protectedProcedure
  .input(z.object({ displayName: z.string(), phoneNumber: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await checkNumberLimit(ctx.session.user.id)

    const number = await ctx.prisma.whatsappNumber.create({
      data: {
        userId: ctx.session.user.id,
        phoneNumber: input.phoneNumber,
        displayName: input.displayName,
        warmupDay: 0,
        warmupComplete: false,
        connectionStatus: 'disconnected',
      },
    })

    // Log activity
    await ctx.prisma.activityLog.create({
      data: {
        userId: ctx.session.user.id,
        actorId: ctx.session.user.id,
        numberId: number.id,
        action: 'number_connected',
        details: JSON.stringify({ displayName: input.displayName }),
      },
    })

    return number
  }),
```

Add a daily cron to advance warm-up days:

```typescript
// src/app/api/cron/warmup/route.ts
export async function GET() {
  // Advance warm-up day for all numbers that are connected
  const numbers = await prisma.whatsappNumber.findMany({
    where: { warmupComplete: false, connectionStatus: 'connected' },
  })

  for (const number of numbers) {
    const newDay = number.warmupDay + 1
    await prisma.whatsappNumber.update({
      where: { id: number.id },
      data: {
        warmupDay: newDay,
        warmupComplete: newDay >= 21,
      },
    })
  }

  return Response.json({ updated: numbers.length })
}
```

Schedule in crontab on server:
```bash
# Run daily warm-up advancement at midnight WAT (23:00 UTC)
echo "0 23 * * * curl -s https://zappix.ng/api/cron/warmup" | crontab -l | { cat; echo "0 23 * * * curl -s https://zappix.ng/api/cron/warmup"; } | crontab -
```

---

## ✅ Phase 2 Complete When:
- [ ] Sign in with Google works end-to-end
- [ ] Risk disclosure stored in database with timestamp
- [ ] QR code displays in onboarding and connects a real number
- [ ] Number stored in database with warmupDay: 0
- [ ] Plan selection triggers Paystack checkout
- [ ] Paystack webhook updates planId on User record
- [ ] Creator plan user cannot add a 3rd number (limit enforced)
- [ ] /app/dashboard accessible only when logged in
- [ ] Unauthenticated users redirected to /login

**➡️ Next: [PHASE-03-status-scheduler.md](./PHASE-03-status-scheduler.md)**


---

# Phase 3 — Status Scheduler
**Weeks 5–6 | "First core feature"**

> At the end of this phase: Users can schedule single status posts, bulk upload 30 days of content, see everything in a calendar, and Zappix auto-posts at the right time.

---

## ✅ Acceptance Criteria
- [ ] Single post form works — pick media, set time, select numbers, save
- [ ] Bulk upload accepts multiple files and assigns them to time slots
- [ ] Content calendar shows all scheduled posts as thumbnails by day
- [ ] Cron job runs every minute and posts due statuses via Baileys
- [ ] Failed posts trigger owner notification and show retry button
- [ ] Status is marked "posted" in database after successful delivery
- [ ] Content gap highlighting — days with no posts shown in amber
- [ ] Estimated reach shown on each post (based on contact list size)

---

## Step 1 — Media Upload to Hetzner Volume

Create `src/server/services/storage.ts`:

```typescript
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const MEDIA_PATH = process.env.MEDIA_PATH || '/mnt/zappix-media/media'

export async function saveMediaFile(
  buffer: Buffer,
  originalName: string,
  userId: string
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase()
  const filename = `${userId}/${randomUUID()}${ext}`
  const fullPath = path.join(MEDIA_PATH, filename)

  // Create user directory if it doesn't exist
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, buffer)

  // Return relative URL path
  return `/media/${filename}`
}

export function getMediaPath(relativePath: string): string {
  return path.join(MEDIA_PATH, relativePath.replace('/media/', ''))
}

export function deleteMediaFile(relativePath: string): void {
  const fullPath = getMediaPath(relativePath)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}
```

Serve media files via Next.js API route:

```typescript
// src/app/api/media/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const session = await auth()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const filePath = path.join(process.env.MEDIA_PATH!, ...params.path)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.gif': 'image/gif',
    '.mp4': 'video/mp4', '.pdf': 'application/pdf',
  }

  return new NextResponse(buffer, {
    headers: { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' },
  })
}
```

---

## Step 2 — BullMQ Status Queue

Create `src/server/queues/status.queue.ts`:

```typescript
import { Queue, Worker } from 'bullmq'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { waManager } from '@/server/baileys/manager'
import path from 'path'

export const statusQueue = new Queue('status-posts', { connection: redis })

export const statusWorker = new Worker(
  'status-posts',
  async (job) => {
    const { statusId } = job.data
    const post = await prisma.scheduledStatus.findUnique({
      where: { id: statusId },
      include: { targetNumbers: true },
    })

    if (!post || post.status !== 'pending') return

    await prisma.scheduledStatus.update({
      where: { id: statusId },
      data: { status: 'processing' },
    })

    // Get target numbers
    let numberIds: string[]
    if (post.targetAll) {
      const numbers = await prisma.whatsappNumber.findMany({
        where: { userId: post.userId, isActive: true, connectionStatus: 'connected' },
        select: { id: true },
      })
      numberIds = numbers.map(n => n.id)
    } else {
      numberIds = post.targetNumbers.map(t => t.numberId)
    }

    let allPosted = true

    for (const numberId of numberIds) {
      try {
        // Get all contacts who can see status on this number
        const contacts = await prisma.contact.findMany({
          where: { userId: post.userId, isOptedOut: false },
          select: { phoneNumber: true },
        })
        const viewers = contacts.map(c => `${c.phoneNumber}@s.whatsapp.net`)

        // Build media content
        let content: any
        const mediaPath = post.mediaUrl
          ? path.join(process.env.MEDIA_PATH!, post.mediaUrl.replace('/media/', ''))
          : null

        if (post.mediaType === 'text') {
          content = { text: post.caption || '' }
        } else if (post.mediaType === 'image' && mediaPath) {
          content = { image: { url: mediaPath }, caption: post.caption || '' }
        } else if (post.mediaType === 'video' && mediaPath) {
          content = { video: { url: mediaPath }, caption: post.caption || '' }
        } else if (post.mediaType === 'gif' && mediaPath) {
          content = { video: { url: mediaPath }, gifPlayback: true }
        }

        if (content) {
          await waManager.postStatus(numberId, content, viewers)
        }
      } catch (err) {
        console.error(`Failed to post status ${statusId} on number ${numberId}:`, err)
        allPosted = false
      }
    }

    await prisma.scheduledStatus.update({
      where: { id: statusId },
      data: {
        status: allPosted ? 'posted' : 'failed',
        postedAt: allPosted ? new Date() : undefined,
        errorMessage: allPosted ? undefined : 'Failed to post on one or more numbers',
      },
    })
  },
  { connection: redis, concurrency: 3 }
)
```

---

## Step 3 — Scheduler Cron Job

Create `src/app/api/cron/process-statuses/route.ts`:

```typescript
export async function GET() {
  const now = new Date()

  const duePosts = await prisma.scheduledStatus.findMany({
    where: {
      scheduledAt: { lte: now },
      status: 'pending',
    },
    take: 50, // Process in batches
  })

  for (const post of duePosts) {
    await statusQueue.add('post', { statusId: post.id }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 30000 },
    })
  }

  return Response.json({ queued: duePosts.length })
}
```

Add to crontab:
```bash
# Run every minute
* * * * * curl -s https://zappix.ng/api/cron/process-statuses
```

---

## Step 4 — tRPC Scheduler Router

Create `src/server/trpc/routers/scheduler.ts`:

```typescript
import { z } from 'zod'
import { router, protectedProcedure } from '../context'
import { statusQueue } from '@/server/queues/status.queue'
import { saveMediaFile } from '@/server/services/storage'

export const schedulerRouter = router({
  // Get all scheduled posts for calendar
  getAll: protectedProcedure
    .input(z.object({
      from: z.date(),
      to: z.date(),
      numberId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.scheduledStatus.findMany({
        where: {
          userId: ctx.session.user.id,
          scheduledAt: { gte: input.from, lte: input.to },
          status: { not: 'cancelled' },
        },
        orderBy: { scheduledAt: 'asc' },
        include: { targetNumbers: true },
      })
    }),

  // Create single post
  create: protectedProcedure
    .input(z.object({
      mediaBase64: z.string().optional(),
      mediaType: z.enum(['image', 'video', 'gif', 'text']),
      mediaFilename: z.string().optional(),
      caption: z.string().optional(),
      label: z.string().optional(),
      scheduledAt: z.date(),
      targetAll: z.boolean().default(true),
      targetNumberIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      let mediaUrl: string | undefined

      if (input.mediaBase64 && input.mediaFilename) {
        const buffer = Buffer.from(input.mediaBase64, 'base64')
        mediaUrl = await saveMediaFile(buffer, input.mediaFilename, ctx.session.user.id)
      }

      return ctx.prisma.scheduledStatus.create({
        data: {
          userId: ctx.session.user.id,
          mediaUrl,
          mediaType: input.mediaType,
          caption: input.caption,
          label: input.label,
          scheduledAt: input.scheduledAt,
          targetAll: input.targetAll,
          targetNumbers: input.targetNumberIds ? {
            create: input.targetNumberIds.map(id => ({ numberId: id })),
          } : undefined,
        },
      })
    }),

  // Bulk create posts
  bulkCreate: protectedProcedure
    .input(z.object({
      posts: z.array(z.object({
        mediaBase64: z.string().optional(),
        mediaType: z.enum(['image', 'video', 'gif', 'text']),
        mediaFilename: z.string().optional(),
        caption: z.string().optional(),
        scheduledAt: z.date(),
      })),
      targetAll: z.boolean().default(true),
      targetNumberIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const batchId = `batch_${Date.now()}`
      const created = []

      for (const post of input.posts) {
        let mediaUrl: string | undefined

        if (post.mediaBase64 && post.mediaFilename) {
          const buffer = Buffer.from(post.mediaBase64, 'base64')
          mediaUrl = await saveMediaFile(buffer, post.mediaFilename, ctx.session.user.id)
        }

        const created_post = await ctx.prisma.scheduledStatus.create({
          data: {
            userId: ctx.session.user.id,
            mediaUrl,
            mediaType: post.mediaType,
            caption: post.caption,
            scheduledAt: post.scheduledAt,
            targetAll: input.targetAll,
            bulkBatchId: batchId,
          },
        })
        created.push(created_post)
      }

      return { count: created.length, batchId }
    }),

  // Delete post
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.scheduledStatus.update({
        where: { id: input, userId: ctx.session.user.id },
        data: { status: 'cancelled' },
      })
    }),

  // Retry failed post
  retry: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.scheduledStatus.update({
        where: { id: input, userId: ctx.session.user.id },
        data: { status: 'pending', errorMessage: null },
      })
      await statusQueue.add('post', { statusId: post.id })
      return post
    }),
})
```

---

## Pages to Build

- `/app/scheduler` — Calendar view (month/week/day, thumbnails per day, gap highlights)
- `/app/scheduler/new` — Single post form with media upload and datetime picker
- `/app/scheduler/bulk` — Multi-file upload with draggable grid and time assignment

---

## ✅ Phase 3 Complete When:
- [ ] Single post can be created and appears in calendar
- [ ] Bulk upload creates multiple posts across the calendar
- [ ] Cron job processes due posts every minute
- [ ] Status appears on connected WhatsApp numbers at scheduled time
- [ ] Failed posts shown in red with retry button
- [ ] Content gaps (days with no posts) highlighted in amber

**➡️ Next: [PHASE-04-broadcast-engine.md](./PHASE-04-broadcast-engine.md)**


---

# Phase 4 — Broadcast Engine
**Weeks 7–8 | "The power tool"**

> At the end of this phase: Users can compose a broadcast, select contact lists, pick WhatsApp numbers, set throttle speed, schedule or send now, and see a full send/reply/opt-out report.

---

## ✅ Acceptance Criteria
- [ ] 5-step broadcast composer works end-to-end
- [ ] All 5 message types (text, image, video, doc, contact) send correctly
- [ ] Personalisation tokens ({firstName} etc) are replaced before sending
- [ ] Safe throttle mode delays 2-3 seconds between each message
- [ ] Warm-up number limits enforced (max 50/day in Days 4-7)
- [ ] Auto-split distributes contacts evenly across selected numbers
- [ ] Opt-out keyword detection works (contact replies STOP → opted out)
- [ ] Opt-out auto-reply sent to contact
- [ ] Broadcast report shows: sent, failed, replies, opt-outs
- [ ] Scheduled broadcasts send at the right time

---

## Step 1 — Broadcast Queue with Throttling

Create `src/server/queues/broadcast.queue.ts`:

```typescript
import { Queue, Worker, Job } from 'bullmq'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { waManager } from '@/server/baileys/manager'
import { replaceTokens } from '@/lib/utils'
import path from 'path'

export const broadcastQueue = new Queue('broadcasts', { connection: redis })

const THROTTLE_DELAYS = {
  safe: 2500,    // 2.5 seconds
  normal: 800,   // 0.8 seconds
  fast: 450,     // 0.45 seconds
}

export const broadcastWorker = new Worker(
  'broadcasts',
  async (job: Job) => {
    const { broadcastId, contactBatch, numberId } = job.data

    const broadcast = await prisma.broadcast.findUnique({
      where: { id: broadcastId },
    })

    if (!broadcast || broadcast.status === 'cancelled') return

    const delay = THROTTLE_DELAYS[broadcast.throttleSpeed as keyof typeof THROTTLE_DELAYS] || 2500
    const content = JSON.parse(broadcast.content)

    for (const contact of contactBatch) {
      try {
        // Check warm-up limits before each send
        const number = await prisma.whatsappNumber.findUnique({ where: { id: numberId } })
        if (number && !number.warmupComplete) {
          const todaySent = await getTodaySentCount(numberId)
          const limit = getWarmupLimit(number.warmupDay)
          if (todaySent >= limit) {
            // Skip this contact — daily limit reached
            await prisma.broadcastDelivery.updateMany({
              where: { broadcastId, contactId: contact.id, numberId },
              data: { status: 'failed', errorMessage: 'Warm-up daily limit reached' },
            })
            continue
          }
        }

        const jid = `${contact.phoneNumber}@s.whatsapp.net`
        const messageContent = buildMessageContent(content, contact)

        await waManager.sendMessage(numberId, jid, messageContent)

        await prisma.broadcastDelivery.updateMany({
          where: { broadcastId, contactId: contact.id, numberId },
          data: { status: 'sent', sentAt: new Date() },
        })

        await prisma.broadcastNumber.updateMany({
          where: { broadcastId, numberId },
          data: { sent: { increment: 1 } },
        })

      } catch (err) {
        await prisma.broadcastDelivery.updateMany({
          where: { broadcastId, contactId: contact.id, numberId },
          data: {
            status: 'failed',
            errorMessage: err instanceof Error ? err.message : 'Unknown error',
          },
        })

        await prisma.broadcastNumber.updateMany({
          where: { broadcastId, numberId },
          data: { failed: { increment: 1 } },
        })
      }

      // Throttle — wait between messages
      await sleep(delay + Math.random() * 500) // Add jitter
    }
  },
  { connection: redis, concurrency: 4 }
)

function buildMessageContent(content: any, contact: any): any {
  const text = content.text ? replaceTokens(content.text, contact) : undefined

  switch (content.type) {
    case 'text':
      return { text: text! }
    case 'image':
      return {
        image: { url: path.join(process.env.MEDIA_PATH!, content.mediaUrl.replace('/media/', '')) },
        caption: text,
      }
    case 'video':
      return {
        video: { url: path.join(process.env.MEDIA_PATH!, content.mediaUrl.replace('/media/', '')) },
        caption: text,
      }
    case 'document':
      return {
        document: { url: path.join(process.env.MEDIA_PATH!, content.mediaUrl.replace('/media/', '')) },
        fileName: content.fileName,
        caption: text,
      }
    case 'contact':
      return {
        contacts: {
          displayName: content.contactName,
          contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${content.contactName}\nTEL:${content.contactPhone}\nEND:VCARD` }],
        },
      }
    default:
      return { text: text || '' }
  }
}

function getWarmupLimit(day: number): number {
  if (day <= 3) return 0
  if (day <= 7) return 50
  if (day <= 14) return 200
  if (day <= 21) return 500
  return Infinity
}

async function getTodaySentCount(numberId: string): Promise<number> {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  return prisma.broadcastDelivery.count({
    where: {
      numberId,
      status: 'sent',
      sentAt: { gte: startOfDay },
    },
  })
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
```

---

## Step 2 — Token Replacement Utility

Add to `src/lib/utils.ts`:

```typescript
export function replaceTokens(template: string, contact: {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  city?: string | null
  phoneNumber?: string
  customValues?: Array<{ customField: { name: string }, value: string | null }>
}): string {
  const fallback = (value: string | null | undefined, fb: string) => value || fb

  return template
    .replace(/\{firstName\|([^}]+)\}/g, (_, fb) => fallback(contact.firstName, fb))
    .replace(/\{firstName\}/g, fallback(contact.firstName, 'there'))
    .replace(/\{lastName\|([^}]+)\}/g, (_, fb) => fallback(contact.lastName, fb))
    .replace(/\{lastName\}/g, fallback(contact.lastName, ''))
    .replace(/\{fullName\}/g, [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'there')
    .replace(/\{city\}/g, fallback(contact.city, ''))
    .replace(/\{phone\}/g, contact.phoneNumber || '')
    .replace(/\{custom1\}/g, contact.customValues?.find(v => v.customField.name === 'custom1')?.value || '')
    .replace(/\{custom2\}/g, contact.customValues?.find(v => v.customField.name === 'custom2')?.value || '')
}
```

---

## Step 3 — Opt-Out Detection

In your Baileys incoming message handler (`src/server/baileys/manager.ts`), add:

```typescript
import { prisma } from '@/lib/prisma'

const OPT_OUT_KEYWORDS = ['stop', 'unsubscribe', 'no more', 'remove me', 'opt out']

async function handleIncomingMessage(numberId: string, jid: string, text: string, userId: string) {
  const phone = jid.replace('@s.whatsapp.net', '').replace('@g.us', '')
  const lowerText = text.toLowerCase().trim()

  // Check for opt-out
  const isOptOut = OPT_OUT_KEYWORDS.some(kw => lowerText.includes(kw))

  if (isOptOut) {
    // Mark contact as opted out
    await prisma.contact.updateMany({
      where: { userId, phoneNumber: phone },
      data: { isOptedOut: true, optedOutAt: new Date() },
    })

    // Upsert opt-out record
    await prisma.optOut.upsert({
      where: { userId_contactPhone: { userId, contactPhone: phone } },
      update: { isResubscribed: false, resubscribedAt: null },
      create: { userId, contactPhone: phone },
    })

    // Send opt-out confirmation
    const sock = await waManager.connect(numberId)
    await sock.sendMessage(jid, {
      text: "You've been unsubscribed ✅\nYou won't receive further messages.\nReply JOIN anytime to resubscribe.",
    })
  }

  // Check for re-subscribe
  if (lowerText === 'join') {
    await prisma.contact.updateMany({
      where: { userId, phoneNumber: phone },
      data: { isOptedOut: false, optedOutAt: null },
    })
    await prisma.optOut.updateMany({
      where: { userId, contactPhone: phone },
      data: { isResubscribed: true, resubscribedAt: new Date() },
    })
  }

  // Track as broadcast reply
  const recentBroadcast = await prisma.broadcast.findFirst({
    where: { userId, status: 'sent', completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    orderBy: { completedAt: 'desc' },
  })

  if (recentBroadcast) {
    await prisma.broadcastReply.create({
      data: { broadcastId: recentBroadcast.id, contactPhone: phone, message: text },
    })
  }
}
```

---

## Step 4 — Send Broadcast tRPC Mutation

```typescript
// In src/server/trpc/routers/broadcasts.ts
send: protectedProcedure
  .input(z.object({ broadcastId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await checkBroadcastLimit(ctx.session.user.id)

    const broadcast = await ctx.prisma.broadcast.findUnique({
      where: { id: input.broadcastId, userId: ctx.session.user.id },
      include: {
        numbers: true,
        audiences: true,
      },
    })

    if (!broadcast) throw new TRPCError({ code: 'NOT_FOUND' })

    // Get all contacts from selected lists (excluding opted out)
    const contacts = await ctx.prisma.contact.findMany({
      where: {
        userId: ctx.session.user.id,
        isOptedOut: false,
        lists: {
          some: {
            listId: { in: broadcast.audiences.map(a => a.contactListId) },
          },
        },
      },
      include: { customValues: { include: { customField: true } } },
    })

    // Auto-split across numbers
    const numbers = broadcast.numbers
    const contactsPerNumber = Math.ceil(contacts.length / numbers.length)

    for (let i = 0; i < numbers.length; i++) {
      const batch = contacts.slice(i * contactsPerNumber, (i + 1) * contactsPerNumber)
      const numberId = numbers[i].numberId

      // Create delivery records
      await ctx.prisma.broadcastDelivery.createMany({
        data: batch.map(c => ({
          broadcastId: broadcast.id,
          contactId: c.id,
          numberId,
          status: 'queued',
        })),
      })

      // Queue in chunks of 100
      for (let j = 0; j < batch.length; j += 100) {
        await broadcastQueue.add('send', {
          broadcastId: broadcast.id,
          contactBatch: batch.slice(j, j + 100),
          numberId,
        })
      }
    }

    return ctx.prisma.broadcast.update({
      where: { id: broadcast.id },
      data: { status: 'sending', startedAt: new Date() },
    })
  }),
```

---

## Pages to Build

- `/app/broadcasts` — List page with status pills (sending, sent, scheduled, draft, failed)
- `/app/broadcasts/new` — 5-step wizard (type → compose → audience → numbers → schedule)
- `/app/broadcasts/[id]` — Report page with charts and per-contact failed list + retry

---

## ✅ Phase 4 Complete When:
- [ ] Broadcast composer completes all 5 steps
- [ ] Text broadcast sent to 100 test contacts successfully
- [ ] Throttle delays visible in logs (2.5s between messages on Safe)
- [ ] Warm-up limit prevents >50 sends on a Day 5 number
- [ ] Reply STOP → contact opted out and confirmation sent
- [ ] Broadcast report shows correct sent/failed/replies/opt-outs
- [ ] Scheduled broadcast sends at the right time

**➡️ Next: [PHASE-05-analytics.md](./PHASE-05-analytics.md)**


---

# Phase 5 — Analytics Dashboard
**Week 9 | "The intelligence layer"**

> At the end of this phase: Users see an overview dashboard with KPIs, charts for status estimated reach, broadcast send rates, and audience growth — with period comparison and CSV export.

---

## ✅ Acceptance Criteria
- [ ] Overview dashboard shows 6 KPI cards with period-over-period change
- [ ] Status analytics shows estimated reach (contact list size × numbers used)
- [ ] Broadcast analytics shows send rate, reply rate, opt-out trend
- [ ] Audience growth chart shows contact count over time
- [ ] Period selector works: Today, 7 Days, 30 Days, Custom
- [ ] Compare toggle shows current vs previous period side by side
- [ ] CSV export downloads a spreadsheet of broadcast history
- [ ] Analytics aggregation job runs hourly

---

## Step 1 — Analytics Aggregation Job

Create `src/app/api/cron/aggregate-analytics/route.ts`:

```typescript
import { prisma } from '@/lib/prisma'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all users
  const users = await prisma.user.findMany({ select: { id: true } })

  for (const user of users) {
    const [
      statusPosts,
      broadcasts,
      contacts,
      adBookings,
    ] = await Promise.all([
      // Status posts published today
      prisma.scheduledStatus.count({
        where: { userId: user.id, postedAt: { gte: today }, status: 'posted' },
      }),
      // Broadcasts data
      prisma.broadcast.findMany({
        where: { userId: user.id, completedAt: { gte: today } },
        include: { numbers: true, replies: true },
      }),
      // Total contacts
      prisma.contact.count({ where: { userId: user.id } }),
      // Ad revenue today
      prisma.adBooking.findMany({
        where: {
          ownerId: user.id,
          status: 'delivered',
          deliveredAt: { gte: today },
        },
        select: { amount: true },
      }),
    ])

    const messagesSent = broadcasts.reduce((sum, b) => sum + b.numbers.reduce((s, n) => s + n.sent, 0), 0)
    const messagesFailed = broadcasts.reduce((sum, b) => sum + b.numbers.reduce((s, n) => s + n.failed, 0), 0)
    const broadcastReplies = broadcasts.reduce((sum, b) => sum + b.replies.length, 0)
    const adRevenue = adBookings.reduce((sum, b) => sum + b.amount, 0)

    await prisma.analyticsDaily.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      update: {
        statusPostsPublished: statusPosts,
        broadcastsSent: broadcasts.length,
        messagesSent,
        messagesDelivered: messagesSent - messagesFailed,
        broadcastReplies,
        totalContacts: contacts,
        adRevenue,
        adBookingsCount: adBookings.length,
      },
      create: {
        userId: user.id,
        date: today,
        statusPostsPublished: statusPosts,
        broadcastsSent: broadcasts.length,
        messagesSent,
        messagesDelivered: messagesSent - messagesFailed,
        broadcastReplies,
        totalContacts: contacts,
        adRevenue,
        adBookingsCount: adBookings.length,
      },
    })
  }

  return Response.json({ processed: users.length })
}
```

Crontab — run hourly:
```bash
0 * * * * curl -s https://zappix.ng/api/cron/aggregate-analytics
```

---

## Step 2 — Analytics tRPC Router

```typescript
// src/server/trpc/routers/analytics.ts
export const analyticsRouter = router({
  overview: protectedProcedure
    .input(z.object({
      from: z.date(),
      to: z.date(),
      compare: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const current = await ctx.prisma.analyticsDaily.aggregate({
        where: { userId: ctx.session.user.id, date: { gte: input.from, lte: input.to } },
        _sum: {
          statusEstimatedReach: true,
          broadcastsSent: true,
          messagesSent: true,
          broadcastReplies: true,
          optOuts: true,
          newContacts: true,
          adRevenue: true,
        },
        _max: { totalContacts: true },
      })

      let previous = null
      if (input.compare) {
        const diff = input.to.getTime() - input.from.getTime()
        const prevFrom = new Date(input.from.getTime() - diff)
        const prevTo = new Date(input.to.getTime() - diff)
        previous = await ctx.prisma.analyticsDaily.aggregate({
          where: { userId: ctx.session.user.id, date: { gte: prevFrom, lte: prevTo } },
          _sum: { broadcastsSent: true, messagesSent: true, adRevenue: true },
          _max: { totalContacts: true },
        })
      }

      return { current: current._sum, totalContacts: current._max.totalContacts, previous: previous?._sum }
    }),

  daily: protectedProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.analyticsDaily.findMany({
        where: { userId: ctx.session.user.id, date: { gte: input.from, lte: input.to } },
        orderBy: { date: 'asc' },
      })
    }),

  broadcastHistory: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.broadcast.findMany({
        where: { userId: ctx.session.user.id, status: 'sent' },
        include: { numbers: true, replies: true },
        orderBy: { completedAt: 'desc' },
        take: 50,
      })
    }),
})
```

---

## Pages to Build

- `/app/analytics` — Overview with KPI bar, period selector, combined activity chart (Recharts LineChart), audience growth area chart
- `/app/analytics/status` — Status estimated reach table, posts list, best time analysis
- `/app/analytics/broadcasts` — Delivery trend, reply rate trend, opt-out trend, best/worst broadcasts
- `/app/analytics/audience` — Contact growth area chart, list breakdown table
- `/app/analytics/revenue` — Ad revenue bars, top clients table

**Key Recharts components to use:**
- `LineChart` + `AreaChart` for trends
- `BarChart` for weekly/monthly comparison
- `ResponsiveContainer` to make charts fill their containers

---

## ✅ Phase 5 Complete When:
- [ ] KPI cards show correct numbers with up/down arrows vs previous period
- [ ] Line chart shows 7-day broadcast activity
- [ ] Status page shows estimated reach (not "view counts")
- [ ] CSV export downloads and opens correctly in Excel
- [ ] Aggregation job runs hourly without errors

**➡️ Next: [PHASE-06-referral-system.md](./PHASE-06-referral-system.md)**


---

# Phase 6 — Referral System
**Week 10 | "The growth engine"**

> At the end of this phase: Every user has a referral link (zappix.ng/ref/slug) and code. Referrals are tracked. Monthly commissions are calculated. The leaderboard is live. Users can withdraw to their bank account.

---

## ✅ Acceptance Criteria
- [ ] Every user has a unique referral link and code auto-generated on signup
- [ ] Visiting zappix.ng/ref/[slug] sets a referral cookie for 30 days
- [ ] Referral code can be entered at signup checkout
- [ ] Referral relationship created in database when referred user subscribes
- [ ] Commission (25%) created on every Paystack charge.success webhook
- [ ] Monthly cron on 1st of month moves pending → available
- [ ] User can add bank account (verified via Paystack name enquiry)
- [ ] Withdrawal request triggers Paystack transfer
- [ ] Leaderboard shows top 10 referrers with rankings
- [ ] Monthly earnings summary email sent on 1st of month

---

## Step 1 — Referral Landing Page

Create `src/app/ref/[slug]/page.tsx`:

```typescript
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ReferralPage({ params }: { params: { slug: string } }) {
  const code = await prisma.referralCode.findUnique({
    where: { linkSlug: params.slug },
    include: { user: { select: { name: true, image: true } } },
  })

  if (!code) redirect('/signup')

  // Set referral cookie (30 days)
  const cookieStore = cookies()
  cookieStore.set('zappix_ref', code.id, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    httpOnly: true,
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-sm border max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚡</div>
        <h1 className="text-2xl font-bold mb-2">
          {code.user.name} invited you to Zappix
        </h1>
        <p className="text-gray-500 mb-6">
          The operating system for WhatsApp TV businesses.
          Schedule posts, sell ad slots, grow your audience.
        </p>
        <a href="/signup"
          className="block bg-green-600 text-white py-3 px-8 rounded-full font-bold hover:bg-green-700">
          Start Free Trial →
        </a>
        <p className="text-xs text-gray-400 mt-4">No credit card required</p>
      </div>
    </div>
  )
}
```

---

## Step 2 — Track Referral on Signup

In `src/lib/auth.ts` signIn callback, read the referral cookie:

```typescript
async signIn({ user, account }) {
  if (account?.provider === 'google' && user.id) {
    // Check for referral cookie (set server-side from middleware)
    const refCodeId = await getReferralCookieFromSession()
    if (refCodeId) {
      const refCode = await prisma.referralCode.findUnique({
        where: { id: refCodeId },
      })
      if (refCode && refCode.userId !== user.id) {
        // Create referral relationship (pending until they subscribe)
        await prisma.referral.upsert({
          where: { referredUserId: user.id },
          update: {},
          create: {
            referrerId: refCode.userId,
            referredUserId: user.id,
            status: 'trial',
          },
        })
      }
    }
  }
  return true
}
```

---

## Step 3 — Monthly Commission Release Cron

Create `src/app/api/cron/release-commissions/route.ts`:

```typescript
import { prisma } from '@/lib/prisma'
import { sendMonthlyEarningsSummary } from '@/server/services/email'

export async function GET() {
  const now = new Date()
  const isFirstOfMonth = now.getDate() === 1

  if (!isFirstOfMonth) {
    return Response.json({ skipped: 'Not the 1st of the month' })
  }

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
  const monthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`

  // Release all pending commissions from last month
  const released = await prisma.commission.updateMany({
    where: { status: 'pending', billingCycleMonth: monthKey },
    data: { status: 'available', releasedAt: now },
  })

  // Get all referrers who earned commissions last month
  const earners = await prisma.commission.groupBy({
    by: ['referrerId'],
    where: { billingCycleMonth: monthKey },
    _sum: { amount: true },
    _count: { id: true },
  })

  // Send monthly summary emails
  for (const earner of earners) {
    const user = await prisma.user.findUnique({
      where: { id: earner.referrerId },
      select: { email: true, name: true },
    })
    if (user && earner._sum.amount) {
      await sendMonthlyEarningsSummary({
        email: user.email!,
        name: user.name || 'there',
        amount: earner._sum.amount,
        month: monthKey,
      })
    }
  }

  // Calculate and award leaderboard bonuses
  await awardLeaderboardBonuses(monthKey)

  return Response.json({ released: released.count, emailsSent: earners.length })
}

async function awardLeaderboardBonuses(monthKey: string) {
  const prizes = [20000000, 10000000, 5000000] // ₦200k, ₦100k, ₦50k in kobo

  const leaderboard = await prisma.commission.groupBy({
    by: ['referrerId'],
    where: { billingCycleMonth: monthKey },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 3,
  })

  for (let i = 0; i < leaderboard.length; i++) {
    if (prizes[i]) {
      await prisma.commission.create({
        data: {
          referralId: leaderboard[i].referrerId, // Using referrerId as placeholder
          referrerId: leaderboard[i].referrerId,
          amount: prizes[i],
          status: 'available',
          billingCycleMonth: monthKey,
          paymentReference: `leaderboard_bonus_${i + 1}_${monthKey}`,
          releasedAt: new Date(),
        },
      })
    }
  }
}
```

Crontab — run at midnight on 1st of every month:
```bash
0 0 1 * * curl -s https://zappix.ng/api/cron/release-commissions
```

---

## Step 4 — Withdrawal via Paystack Transfer

```typescript
// src/server/trpc/routers/referrals.ts
requestWithdrawal: protectedProcedure
  .input(z.object({ amount: z.number().min(500000) })) // min ₦5,000 in kobo
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    // Check available balance
    const balance = await ctx.prisma.commission.aggregate({
      where: { referrerId: userId, status: 'available' },
      _sum: { amount: true },
    })

    const available = balance._sum.amount || 0
    if (available < input.amount) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient balance' })
    }

    const bankAccount = await ctx.prisma.bankAccount.findUnique({
      where: { userId },
    })

    if (!bankAccount?.paystackRecipientCode) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'No verified bank account' })
    }

    // Initiate Paystack transfer
    const response = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: input.amount,
        recipient: bankAccount.paystackRecipientCode,
        reason: 'Zappix Referral Commission',
      }),
    })

    const data = await response.json()

    if (!data.status) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Transfer initiation failed' })
    }

    // Mark commissions as withdrawn
    const commissions = await ctx.prisma.commission.findMany({
      where: { referrerId: userId, status: 'available' },
      orderBy: { releasedAt: 'asc' },
    })

    let remaining = input.amount
    for (const commission of commissions) {
      if (remaining <= 0) break
      const deduct = Math.min(remaining, commission.amount)
      await ctx.prisma.commission.update({
        where: { id: commission.id },
        data: { status: 'withdrawn' },
      })
      remaining -= deduct
    }

    return ctx.prisma.withdrawal.create({
      data: {
        userId,
        bankAccountId: bankAccount.id,
        amount: input.amount,
        paystackTransferId: data.data.transfer_code,
        status: 'processing',
      },
    })
  }),
```

---

## Pages to Build

- `/app/referrals` — Wallet (available + pending), link + code copy, stats, referrals table, leaderboard preview
- `/app/referrals/withdraw` — Amount input, bank details confirmation, transaction history
- `/app/referrals/leaderboard` — Full top 50, current user rank highlighted, monthly prizes shown
- `zappix.ng/ref/[slug]` — Public referral landing page (already built above)

---

## ✅ Phase 6 Complete When:
- [ ] Visiting zappix.ng/ref/tunde sets cookie and shows referral page
- [ ] Signing up after visiting referral page creates a Referral record
- [ ] Commission created on subscription payment
- [ ] 1st of month cron releases commissions
- [ ] Leaderboard shows correct rankings
- [ ] Withdrawal request initiates Paystack transfer
- [ ] Monthly email sent with earnings summary

**🎉 v1.0 LAUNCH — Week 11**

After Phase 6 completes, run the v1.0 launch checklist from the roadmap and go live at zappix.ng.


---

# Phase 7 — Contact Manager
**Weeks 12–13 | "v1.1"**

> At the end of this phase: Users have a full CRM for their contacts — lists, tags, custom fields, smart segments, CSV import, duplicate detection.

---

## ✅ Acceptance Criteria
- [ ] Contact table loads with search, filter by list/tag
- [ ] Manual contact add form works
- [ ] CSV import with column mapper imports correctly
- [ ] Duplicate detection flags matching phone numbers
- [ ] Merge duplicates combines lists, tags, and custom field data
- [ ] Tags can be created, applied, and filtered
- [ ] Smart segment with 3 conditions returns correct contacts
- [ ] Bulk actions work: add to list, apply tag, export, delete
- [ ] Contact profile shows full message history

---

## Key Implementation Notes

### CSV Import Flow
```typescript
// Use papaparse on the frontend for parsing
import Papa from 'papaparse'

const parsed = Papa.parse(file, { header: true, skipEmptyLines: true })
// Show column mapper: let user assign CSV columns to contact fields
// Validate phone numbers: strip spaces, convert to +234 format
// Check for duplicates before insert: prisma.contact.findMany where phoneNumber in [...]
// Use createMany with skipDuplicates: true for performance
```

### Phone Number Normalisation
```typescript
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('234')) return '+' + digits
  if (digits.startsWith('0')) return '+234' + digits.slice(1)
  if (digits.length === 10) return '+234' + digits
  return '+' + digits
}
```

### Smart Segment Rules Engine
```typescript
// Store rules as JSON: { conditions: [{ field, operator, value }], logic: 'and' | 'or' }
// Build Prisma where clause dynamically from rules
function buildSegmentQuery(rules: SegmentRule[], userId: string) {
  const conditions = rules.map(rule => {
    switch (rule.field) {
      case 'tag': return { tags: { some: { tag: { name: rule.value } } } }
      case 'city': return { city: rule.operator === 'is' ? rule.value : { not: rule.value } }
      case 'optOut': return { isOptedOut: rule.value === 'true' }
      case 'source': return { source: rule.value }
      default: return {}
    }
  })
  return { userId, [rules[0]?.logic === 'or' ? 'OR' : 'AND']: conditions }
}
```

---

## Pages to Build
- `/app/contacts` — Table with sidebar filters, bulk action toolbar
- `/app/contacts/[id]` — Profile with history timeline
- `/app/contacts/import` — CSV upload → column mapper → preview → import progress
- `/app/contacts/lists` — Lists with contact counts and last used date
- `/app/contacts/segments` — Segment builder with live preview count
- `/app/contacts/duplicates` — Side-by-side merge interface

---

## ✅ Phase 7 Complete When:
- [ ] 1,000 contacts imported from CSV in under 30 seconds
- [ ] Smart segment updates automatically when new contacts are added
- [ ] Duplicate detected and successfully merged (inherits all lists and tags)
- [ ] Contacts marked opt-out are excluded from broadcasts

**➡️ Next: [PHASE-08-multi-account.md](./PHASE-08-multi-account.md)**


---

# Phase 8 — Multi-Account Manager
**Weeks 14–15 | "v1.2"**

> At the end of this phase: Users can connect multiple numbers, create link groups, invite team members with roles, and view a full activity log.

---

## ✅ Acceptance Criteria
- [ ] Multiple WhatsApp numbers can be connected (up to plan limit)
- [ ] Each number has a status indicator (connected/disconnected/reconnecting)
- [ ] Numbers can be paused (stops all scheduled posts and bots)
- [ ] Link groups allow shared scheduling across grouped numbers
- [ ] Team member invite sends email and creates pending membership
- [ ] Editor role cannot connect/disconnect numbers or manage team
- [ ] Viewer role cannot create or edit anything
- [ ] Activity log records every action with actor, timestamp, number
- [ ] Disconnected number alerts sent via email

---

## Key Implementation Notes

### Connection Status Monitor
Run a health check every 60 seconds:

```typescript
// src/app/api/cron/check-connections/route.ts
export async function GET() {
  const numbers = await prisma.whatsappNumber.findMany({
    where: { isActive: true },
  })

  for (const number of numbers) {
    const isConnected = waManager.isConnected(number.id)
    const newStatus = isConnected ? 'connected' : 'disconnected'

    if (number.connectionStatus !== newStatus) {
      await prisma.whatsappNumber.update({
        where: { id: number.id },
        data: { connectionStatus: newStatus },
      })

      // Alert owner if disconnected
      if (newStatus === 'disconnected') {
        await sendDisconnectionAlert(number)
      }
    }
  }
}
```

Crontab:
```bash
* * * * * curl -s https://zappix.ng/api/cron/check-connections
```

### Role-Based Access in tRPC
```typescript
// Middleware to check team member access
export const teamProtectedProcedure = protectedProcedure.use(async ({ ctx, next, rawInput }) => {
  const targetUserId = (rawInput as any)?.ownerId || ctx.session.user.id

  if (targetUserId === ctx.session.user.id) return next({ ctx })

  const membership = await ctx.prisma.teamMember.findFirst({
    where: {
      ownerId: targetUserId,
      memberId: ctx.session.user.id,
      inviteStatus: 'accepted',
    },
  })

  if (!membership) throw new TRPCError({ code: 'FORBIDDEN' })

  return next({ ctx: { ...ctx, teamRole: membership.role, viewingAs: targetUserId } })
})
```

---

## Pages to Build
- `/app/accounts` — Number cards with status dots, warm-up progress bars, quick actions
- `/app/accounts/new` — QR code scan modal with step-by-step instructions
- `/app/accounts/[id]` — Number settings, warm-up status, bot assignment
- `/app/accounts/team` — Invite form, member list with role badges, revoke access
- `/app/accounts/activity` — Log table with filters

---

## ✅ Phase 8 Complete When:
- [ ] 3 numbers connected simultaneously without issues
- [ ] Editor team member can schedule posts but cannot add new numbers
- [ ] Activity log shows all actions from all team members
- [ ] Owner receives email when any number disconnects

**➡️ Next: [PHASE-09-ad-slot-manager.md](./PHASE-09-ad-slot-manager.md)**


---

# Phase 9 — Ad Slot Manager
**Weeks 16–17 | "v1.3"**

> At the end of this phase: Users can create ad slots, accept online bookings with Paystack payment, approve creatives, and auto-deliver ads. Performance reports auto-sent to clients 24 hours after delivery.

---

## ✅ Acceptance Criteria
- [ ] Ad slot created with type, numbers, price, and availability
- [ ] Public booking page live at zappix.ng/ads/[username]
- [ ] Client can browse slots, pick a date, upload creative, and pay via Paystack
- [ ] Owner receives notification of new booking
- [ ] Owner approves or rejects creative from dashboard
- [ ] Approved booking auto-delivers at scheduled date and time
- [ ] Performance report auto-sent to client email 24 hours after delivery
- [ ] Manual booking entry works (for offline deals)
- [ ] Revenue dashboard shows total earnings, top clients, slot utilisation

---

## Key Implementation Notes

### Public Ad Booking Page
This page (`zappix.ng/ads/[username]`) must be **publicly accessible** (no auth required):

```typescript
// src/app/ads/[username]/page.tsx
export default async function AdBookingPage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findFirst({
    where: { email: { contains: params.username } }, // Match by slug from referral code
    include: {
      adSlots: {
        where: { isActive: true },
        include: { numbers: true },
      },
    },
  })

  // Show available slots, estimated reach per slot, prices
  // Paystack inline payment on booking form
}
```

### Paystack Payment for Ad Bookings
Use Paystack's one-time charge (not subscription):

```typescript
// After client fills booking form and clicks Pay:
const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}` },
  body: JSON.stringify({
    email: clientEmail,
    amount: slotPrice, // in kobo
    callback_url: `https://zappix.ng/ads/${username}/confirm`,
    metadata: { bookingId, slotId, ownerId },
  }),
})
// Redirect client to authorization_url
```

### Auto-Deliver Ad
```typescript
// Triggered when booking status changes to 'approved'
async function scheduleAdDelivery(booking: AdBooking) {
  const deliveryTime = new Date(booking.scheduledDate)

  await adDeliveryQueue.add('deliver', { bookingId: booking.id }, {
    delay: deliveryTime.getTime() - Date.now(),
  })
}
```

### Performance Report Email
Send via Resend 24 hours after delivery:

```typescript
await resend.emails.send({
  from: 'reports@zappix.ng',
  to: booking.clientEmail,
  subject: `Ad Performance Report — ${tvOwnerName}`,
  html: generateReportHTML(delivery),
})
```

---

## Pages to Build
- `zappix.ng/ads/[username]` — Public booking page (slot cards, availability calendar, Paystack checkout)
- `/app/ads` — Overview with pending approvals queue
- `/app/ads/slots` — Manage all slots
- `/app/ads/slots/new` — Create slot form
- `/app/ads/bookings` — All bookings table with status filter
- `/app/ads/bookings/[id]` — Booking detail with creative preview and approve/reject buttons
- `/app/ads/revenue` — Revenue charts, top clients, slot utilisation heatmap

---

## ✅ Phase 9 Complete When:
- [ ] Public booking page accessible without login
- [ ] Full booking → payment → approval → delivery → report flow works end-to-end
- [ ] Performance report delivered to client email 24 hours after ad
- [ ] Revenue dashboard shows correct totals

**➡️ Next: [PHASE-10-chatbot-builder.md](./PHASE-10-chatbot-builder.md)**


---

# Phase 10 — Chatbot Builder
**Weeks 18–19 | "v1.4"**

> At the end of this phase: Every connected number can have a bot — away messages, menu navigation, FAQ responses, lead capture, order collection, and Paystack payment links.

---

## ✅ Acceptance Criteria
- [ ] Away message sends when someone messages outside active hours
- [ ] Menu bot responds to "Hi" with the menu
- [ ] Numbered replies (1, 2, 3) and keyword replies both navigate menu
- [ ] FAQ bot matches keywords and sends correct answers
- [ ] Lead capture flow collects name, email, phone step by step
- [ ] Order collection flow collects item, qty, address, confirms order
- [ ] Payment link auto-sent when customer triggers PAY keyword
- [ ] Human takeover pauses bot when owner manually replies
- [ ] Bot submissions (leads and orders) stored and exportable
- [ ] Owner notified of new lead or order via WhatsApp

---

## Key Implementation Notes

### Incoming Message Router
This is the core of the chatbot. Add to `src/server/baileys/manager.ts`:

```typescript
import { BotEngine } from '@/server/bots/engine'

// In messages.upsert handler:
sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (msg.key.fromMe || !msg.message) continue

    const jid = msg.key.remoteJid!
    const phone = jid.replace('@s.whatsapp.net', '')
    const text = msg.message.conversation ||
                 msg.message.extendedTextMessage?.text || ''

    // Find bot for this number
    const bot = await prisma.bot.findFirst({
      where: { numberId, isEnabled: true },
      include: { awayMessage: true, menus: { include: { items: true } }, faqEntries: true, flows: true },
    })

    if (!bot) continue

    await BotEngine.handle({ bot, phone, text, numberId, sock })
  }
})
```

### Bot State Machine
```typescript
// src/server/bots/engine.ts
export class BotEngine {
  static async handle({ bot, phone, text, numberId, sock }: BotHandlerInput) {
    // Check if human has taken over
    const session = await prisma.botSession.findFirst({
      where: { botId: bot.id, contactPhone: phone, status: 'paused' },
    })
    if (session) return // Bot paused, human handling

    // Check opt-out
    await handleOptOut(phone, text, numberId, bot.userId)

    // Check active hours
    if (!isWithinActiveHours(bot)) {
      await sendAwayMessage(bot, phone, sock)
      return
    }

    // Route to appropriate handler
    const currentSession = await getOrCreateSession(bot.id, phone)

    if (currentSession.currentFlowId) {
      await handleFlowStep(bot, currentSession, text, phone, sock)
    } else if (isMenuTrigger(text, bot)) {
      await sendMenu(bot, phone, sock)
    } else if (await handleFAQ(bot, text, phone, sock)) {
      // FAQ matched and responded
    } else {
      await sendMenu(bot, phone, sock) // Default to menu
    }
  }
}
```

---

## Pages to Build
- `/app/bots` — Bot cards per number with enable/disable toggle
- `/app/bots/[id]` — Tabbed builder: Away | Menu | FAQ | Flows
- `/app/bots/[id]/submissions` — Leads and orders table with export
- Live chat panel in dashboard showing active/escalated conversations

---

## ✅ Phase 10 Complete When:
- [ ] Away message received outside business hours
- [ ] Full menu navigation working (numbers + keywords + 0 to go back)
- [ ] Lead capture stores name, email, phone in database
- [ ] Order captured and owner notified on WhatsApp
- [ ] Human takeover pauses bot and resumes after 30 minutes

**➡️ Next: [PHASE-11-menu-bot.md](./PHASE-11-menu-bot.md)**


---

# Phase 11 — WhatsApp Menu Bot & Full Product
**Weeks 20–21 | "v2.0 — Full Product"**

> At the end of this phase: Every connected number can be a full interactive storefront with product catalogue, service menu, and download hub. All 9 features are live.

---

## ✅ Acceptance Criteria
- [ ] Product catalogue with categories and product detail views
- [ ] Service menu with descriptions, pricing, and CTAs
- [ ] Download hub sends files instantly on customer request
- [ ] Multi-level submenus work (up to 3 levels deep)
- [ ] 0 = back, 00 = main menu navigation works
- [ ] Keyword shortcuts work alongside numbered replies
- [ ] Session timeout resets after configured period
- [ ] Menu analytics tracks most visited sections and downloaded files
- [ ] Full regression test of all 9 features passes

---

## Key Implementation Notes

### Menu Navigation Engine
```typescript
// src/server/bots/menu-engine.ts
export async function handleMenuNavigation(
  menuBot: MenuBot & { items: MenuBotItem[] },
  session: MenuBotSession,
  input: string,
  phone: string,
  sock: WASocket
) {
  // Handle back navigation
  if (input === '0' || input.toLowerCase() === 'back') {
    const parent = await getParentItem(session.currentParentId)
    await updateSession(session.id, { currentParentId: parent?.parentId || null })
    await sendMenu(menuBot, parent?.parentId || null, phone, sock)
    return
  }

  // Handle main menu
  if (input === '00' || input.toLowerCase() === 'menu') {
    await updateSession(session.id, { currentParentId: null })
    await sendMainMenu(menuBot, phone, sock)
    return
  }

  // Find matching item by number or keyword
  const currentItems = menuBot.items.filter(
    i => i.parentId === session.currentParentId && i.isActive
  )

  const item = currentItems.find(
    i => String(i.number) === input ||
    (i.keyword && input.toLowerCase().includes(i.keyword.toLowerCase()))
  )

  if (!item) {
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "Sorry, I didn't get that 😅\nReply MENU to see options.",
    })
    return
  }

  // Handle item action
  switch (item.itemType) {
    case 'submenu':
      await updateSession(session.id, { currentParentId: item.id })
      await sendMenu(menuBot, item.id, phone, sock)
      break
    case 'product':
    case 'service':
      await sendItemDetail(item, phone, sock)
      break
    case 'download':
      await sendFile(item, phone, sock)
      await trackDownload(item.id, phone)
      break
  }
}
```

### File Delivery for Download Hub
```typescript
async function sendFile(item: MenuBotItem, phone: string, sock: WASocket) {
  const filePath = path.join(process.env.MEDIA_PATH!, item.fileUrl!.replace('/media/', ''))
  const ext = path.extname(filePath).toLowerCase()

  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    document: { url: filePath },
    fileName: item.title + ext,
    mimetype: ext === '.pdf' ? 'application/pdf' : 'application/octet-stream',
    caption: item.description || undefined,
  })
}
```

---

## Pages to Build
- `/app/menu-bots` — All menu bots with enable/disable toggle
- `/app/menu-bots/[id]` — Tree view of menu structure with add/edit/delete per item
- Item types: product (image + price + CTA), service (description + price + CTA), download (file upload + message), submenu (just a label)

---

## v2.0 Full Regression Checklist

Before declaring v2.0 complete, test every feature end-to-end:

### Infrastructure
- [ ] HTTPS working at zappix.ng
- [ ] GitHub Actions deploys without errors
- [ ] PostgreSQL backups running daily
- [ ] Redis responding
- [ ] PM2 auto-restarting app on crash

### Auth & Billing
- [ ] Google sign-in works
- [ ] Onboarding completes for new user
- [ ] Paystack subscription created and planId updated
- [ ] Plan limits enforced across all features

### Status Scheduler
- [ ] Single post scheduled and delivered
- [ ] Bulk upload creates 30 posts
- [ ] Calendar shows all posts
- [ ] Failed post retried successfully

### Broadcast Engine
- [ ] Broadcast sent to 100 contacts
- [ ] Personalisation tokens replaced correctly
- [ ] Opt-out stops future broadcasts to that contact
- [ ] Scheduled broadcast delivers on time

### Analytics
- [ ] All KPIs showing correct numbers
- [ ] Period comparison working
- [ ] CSV export downloads correctly

### Referral System
- [ ] Referral link tracks correctly
- [ ] Commission created on payment
- [ ] Monthly release cron works
- [ ] Withdrawal initiated successfully

### Contact Manager
- [ ] CSV import works
- [ ] Segment returns correct contacts
- [ ] Duplicate merge succeeds

### Multi-Account Manager
- [ ] 3 numbers connected simultaneously
- [ ] Team member with Editor role cannot add numbers
- [ ] Activity log records all actions

### Ad Slot Manager
- [ ] Public booking page accessible
- [ ] Full booking → delivery → report flow works

### Chatbot Builder
- [ ] Menu bot navigates correctly
- [ ] Lead captured and stored
- [ ] Human takeover works

### Menu Bot
- [ ] Product catalogue navigable
- [ ] File downloaded from download hub

---

## 🎉 You've built a full SaaS product.

**zappix.ng is live with all 9 features.**

### Next Steps After v2.0
1. Monitor error logs in Sentry for 1 week
2. Interview first 10 paying customers — what do they love, what's broken
3. Start secondary ICP outreach (agencies and e-commerce sellers)
4. Write 5 SEO blog posts targeting "WhatsApp TV Nigeria" keywords
5. Plan v3.0 features based on user feedback

