FROM oven/bun:1 AS deps
WORKDIR /app

COPY bun.lock package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/logger/package.json ./packages/logger/

RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN cd apps/web && bun run next build

# Resolve bun's symlinks in standalone so Docker COPY works correctly
RUN cp -rL /app/apps/web/.next/standalone /standalone-resolved

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /standalone-resolved ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
