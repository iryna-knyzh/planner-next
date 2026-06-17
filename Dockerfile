# syntax=docker/dockerfile:1

# Shared base: Node 22 on Alpine with pnpm enabled via corepack.
# openssl is required by the Prisma query engine on musl/Alpine.
FROM node:22-alpine AS base
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@10.33.1 --activate
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# --- deps: install all dependencies (cached on the lockfile) ---
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# prisma schema is needed because `postinstall` runs `prisma generate`.
COPY prisma ./prisma
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --- builder: produce the standalone Next.js server ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm build

# --- runner: minimal image that just runs the built server ---
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
# Create the uploads dir owned by the runtime user so the mounted volume
# inherits writable ownership instead of defaulting to root.
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads
COPY --from=builder /app/public ./public
# .next/standalone already contains the traced node_modules + server.js.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
