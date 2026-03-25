# Zappix Deployment Guide

> Step-by-step instructions to deploy Zappix from scratch.

---

## Prerequisites

You will need accounts on the following services:

1. **Render** (render.com) - Frontend hosting
2. **Railway** (railway.app) - Evolution API hosting
3. **Neon** (neon.tech) - PostgreSQL database
4. **Clerk** (clerk.com) - Authentication
5. **Paystack** (paystack.com) - Payments and bank transfers
6. **Resend** (resend.com) - Transactional email
7. **Sanity** (sanity.io) - Blog CMS
8. **Cloudinary** (cloudinary.com) - Media storage
9. **Upstash** (upstash.com) - Redis cache
10. **Inngest** (inngest.com) - Background jobs

---

## Step 1: Clone Repository

```bash
git clone https://github.com/digimajextensions/Zappix.git
cd Zappix
npm install
```

---

## Step 2: Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project named "zappix"
3. Copy the connection string (pooled) for `DATABASE_URL`
4. Copy the direct connection string for `DATABASE_URL_UNPOOLED`
5. Run the database migration:
   ```bash
   npx prisma migrate dev --name init
   ```
6. Seed the pricing plans:
   ```bash
   npx prisma db seed
   ```

---

## Step 3: Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an application
2. Enable Google OAuth and Email/Password sign-in methods
3. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
4. Set up a webhook endpoint:
   - URL: `https://your-domain/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
5. Copy the `CLERK_WEBHOOK_SECRET`
6. Install the `svix` package (already included in dependencies)

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
   DATABASE_CONNECTION_URI=<your-neon-connection-string>
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
6. Deploy and note the public URL for `EVOLUTION_API_URL`

---

## Step 5: Set Up Paystack

1. Go to [paystack.com](https://paystack.com) and create an account
2. Create 4 subscription plans (Starter, Growth, Business, Scale) for both monthly and yearly billing
3. Copy plan codes into your database or environment
4. Copy `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY`
5. Set up webhooks:
   - URL: `https://your-domain/api/webhooks/paystack`
   - Events: `charge.success`, `subscription.create`, `subscription.disable`, `transfer.success`, `transfer.failed`

---

## Step 6: Set Up Resend

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain (zappix.ng)
3. Copy the `RESEND_API_KEY`

---

## Step 7: Set Up Sanity CMS

1. Go to [sanity.io](https://sanity.io) and create a project
2. Note the `NEXT_PUBLIC_SANITY_PROJECT_ID`
3. Set `NEXT_PUBLIC_SANITY_DATASET` to "production"
4. Generate and copy `SANITY_API_TOKEN`
5. Deploy Sanity Studio (optional - can use the hosted studio)

---

## Step 8: Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and create an account
2. Copy `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

## Step 9: Set Up Upstash Redis

1. Go to [upstash.com](https://upstash.com) and create a Redis database
2. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

---

## Step 10: Set Up Inngest

1. Go to [inngest.com](https://inngest.com) and create an account
2. Copy `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`

---

## Step 11: Deploy to Render

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add all environment variables from `.env.example`
6. Deploy

---

## Step 12: Configure Webhooks

After deployment, update webhook URLs in:
- **Clerk**: `https://zappix.ng/api/webhooks/clerk`
- **Paystack**: `https://zappix.ng/api/webhooks/paystack`
- **Evolution API**: Update `WEBHOOK_GLOBAL_URL` on Railway

---

## Step 13: Run Migration and Seed

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Step 14: Verify

1. Visit your domain and check the landing page
2. Sign up with a test account
3. Connect a WhatsApp number via QR code
4. Send a test status post
5. Process a test payment via Paystack

---

## Troubleshooting

- **Database connection issues**: Ensure you are using the pooled connection URL with `?sslmode=require`
- **Clerk webhook failures**: Check the webhook secret and ensure the endpoint is accessible
- **Evolution API not responding**: Check Railway logs and ensure the container is running
- **Paystack webhook not receiving**: Verify the webhook URL is correct and publicly accessible
