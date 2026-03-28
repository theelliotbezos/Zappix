# ── Stage 1: Dependencies ────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ── Stage 2: Build ───────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Next.js collects anonymous telemetry -- disable it during build
ENV NEXT_TELEMETRY_DISABLED=1

# Provide placeholder values for public env vars required at build time.
# Real values are injected at runtime via environment variables.
ARG NEXT_PUBLIC_APP_URL=https://localhost:3000
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_placeholder
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app/dashboard
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
ARG NEXT_PUBLIC_SANITY_PROJECT_ID=placeholder
ARG NEXT_PUBLIC_SANITY_DATASET=production

RUN npm run build

# ── Stage 3: Production runner ───────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what is needed to run the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Next.js standalone output is not enabled, so we copy the full build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/next.config.mjs ./next.config.mjs

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
