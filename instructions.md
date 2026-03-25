# Zappix Deployment Guide

> Step-by-step instructions to deploy Zappix from scratch.
> Estimated time: 2-3 hours for full setup.

---

## Prerequisites

You will need accounts on the following services (all have free tiers):

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| [Render](https://render.com) | Frontend hosting | 750 hours/month |
| [Railway](https://railway.app) | Evolution API hosting | $5/month (Hobby) |
| [Neon](https://neon.tech) | PostgreSQL database | 0.5 GB storage |
| [Clerk](https://clerk.com) | Authentication | 10,000 MAUs |
| [Paystack](https://paystack.com) | Payments & bank transfers | No monthly fee |
| [Resend](https://resend.com) | Transactional email | 3,000 emails/month |
| [Sanity](https://sanity.io) | Blog CMS | Free tier |
| [Cloudinary](https://cloudinary.com) | Media storage | 25 GB |
| [Upstash](https://upstash.com) | Redis cache | 10,000 commands/day |
| [Inngest](https://inngest.com) | Background jobs | Free tier |

---

## Step 1: Clone Repository

```bash
git clone https://github.com/digimajextensions/Zappix.git
cd Zappix
npm install
cp .env.example .env.local
```

---

## Step 2: Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project named "zappix"
3. Copy the **pooled** connection string for `DATABASE_URL`
4. Copy the **direct** connection string for `DATABASE_URL_UNPOOLED`
5. Add both to your `.env.local`
6. Run the database migration:
   ```bash
   npx prisma migrate dev --name init
   ```
7. Seed the pricing plans:
   ```bash
   npx prisma db seed
   ```

---

## Step 3: Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an application
2. Enable Google OAuth and Email/Password sign-in methods
3. Copy keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Set up a webhook endpoint:
   - URL: `https://your-domain/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
5. Copy `CLERK_WEBHOOK_SECRET` to `.env.local`

---

## Step 4: Deploy Evolution API on Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Add a new service from Docker image: `atendai/evolution-api:latest`
3. Set environment variables:
   ```
   AUTHENTICATION_API_KEY=<generate-a-secure-key>
   AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true
   DATABASE_ENABLED=true
   DATABASE_PROVIDER=postgresql
   DATABASE_CONNECTION_URI=<your-neon-direct-connection-string>
   DATABASE_SAVE_DATA_INSTANCE=true
   DATABASE_SAVE_DATA_NEW_MESSAGE=true
   DATABASE_SAVE_DATA_CONTACTS=true
   SERVER_URL=https://<your-railway-url>
   WEBHOOK_GLOBAL_URL=https://<your-domain>/api/webhooks/evolution
   WEBHOOK_GLOBAL_ENABLED=true
   WEBHOOK_EVENTS_APPLICATION_STARTUP=true
   WEBHOOK_EVENTS_QRCODE_UPDATED=true
   WEBHOOK_EVENTS_MESSAGES_UPSERT=true
   WEBHOOK_EVENTS_CONNECTION_UPDATE=true
   WEBHOOK_EVENTS_SEND_MESSAGE=true
   ```
4. Add a persistent volume mounted at `/evolution/store`
5. Expose port 8080
6. Deploy and copy the public URL for `EVOLUTION_API_URL`
7. Copy your API key for `EVOLUTION_API_KEY`

---

## Step 5: Set Up Paystack

1. Go to [paystack.com](https://paystack.com) and create an account
2. In Settings > API Keys, copy:
   - `PAYSTACK_SECRET_KEY`
   - `PAYSTACK_PUBLIC_KEY`
3. Create 4 subscription plans for monthly billing:
   - Starter: N10,000/month
   - Growth: N25,000/month
   - Business: N55,000/month
   - Scale: N100,000/month
4. Create 4 subscription plans for yearly billing:
   - Starter: N99,600/year
   - Growth: N249,000/year
   - Business: N547,800/year
   - Scale: N996,000/year
5. Note the plan codes and add them to the database seed or environment
6. Set up webhooks:
   - URL: `https://your-domain/api/webhooks/paystack`
   - Events: `charge.success`, `subscription.create`, `subscription.disable`, `transfer.success`, `transfer.failed`

---

## Step 6: Set Up Resend

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain (zappix.ng) via DNS records
3. Copy `RESEND_API_KEY` to `.env.local`

---

## Step 7: Set Up Sanity CMS

1. Go to [sanity.io](https://sanity.io) and create a new project
2. Copy `NEXT_PUBLIC_SANITY_PROJECT_ID` to `.env.local`
3. Set `NEXT_PUBLIC_SANITY_DATASET` to "production"
4. Generate an API token with editor permissions
5. Copy `SANITY_API_TOKEN` to `.env.local`
6. Optionally deploy Sanity Studio for content management

---

## Step 8: Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and create an account
2. Copy to `.env.local`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

## Step 9: Set Up Upstash Redis

1. Go to [upstash.com](https://upstash.com) and create a Redis database
2. Select a region close to your Render deployment
3. Copy to `.env.local`:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

## Step 10: Set Up Inngest

1. Go to [inngest.com](https://inngest.com) and create an account
2. Copy to `.env.local`:
   - `INNGEST_EVENT_KEY`
   - `INNGEST_SIGNING_KEY`

---

## Step 11: Deploy to Render

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository (digimajextensions/Zappix)
3. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18+
4. Add ALL environment variables from `.env.example` (filled with real values)
5. Deploy

---

## Step 12: Configure Webhook URLs

After deployment, update webhook URLs in all services:
- **Clerk**: Dashboard > Webhooks > `https://zappix.ng/api/webhooks/clerk`
- **Paystack**: Dashboard > Settings > Webhooks > `https://zappix.ng/api/webhooks/paystack`
- **Evolution API**: Update `WEBHOOK_GLOBAL_URL` on Railway to `https://zappix.ng/api/webhooks/evolution`

---

## Step 13: Run Migration and Seed

If you have not already:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Step 14: Verify Everything Works

1. Visit your domain and check the landing page renders
2. Check the features, pricing, blog, and legal pages
3. Sign up with a test account (should create user in Neon via Clerk webhook)
4. Complete the onboarding flow
5. Connect a WhatsApp number via QR code
6. Send a test status post
7. Process a test payment via Paystack
8. Verify Inngest dashboard shows registered functions
9. Check Sanity Studio can create blog posts

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Database connection fails | Ensure you are using the pooled URL with `?sslmode=require` |
| Clerk webhook 400 errors | Verify CLERK_WEBHOOK_SECRET matches the one in Clerk dashboard |
| Evolution API not responding | Check Railway logs, ensure container is running on port 8080 |
| Paystack webhook not receiving | Verify URL is correct and publicly accessible (no auth required) |
| QR code not showing | Check EVOLUTION_API_URL and EVOLUTION_API_KEY are correct |
| Inngest functions not triggering | Verify INNGEST_SIGNING_KEY and check Inngest dashboard |
| Sanity blog empty | Create content in Sanity Studio, check SANITY_API_TOKEN permissions |
| Render cold start slow | Set up health check pings via Upstash QStash to keep instance warm |

---

## Environment Variable Checklist

Before deploying, ensure all these are set:

- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `DATABASE_URL`
- [ ] `DATABASE_URL_UNPOOLED`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `CLERK_WEBHOOK_SECRET`
- [ ] `EVOLUTION_API_URL`
- [ ] `EVOLUTION_API_KEY`
- [ ] `EVOLUTION_WEBHOOK_SECRET`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `PAYSTACK_SECRET_KEY`
- [ ] `PAYSTACK_PUBLIC_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] `NEXT_PUBLIC_SANITY_DATASET`
- [ ] `SANITY_API_TOKEN`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `INNGEST_EVENT_KEY`
- [ ] `INNGEST_SIGNING_KEY`
