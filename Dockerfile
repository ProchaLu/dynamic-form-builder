FROM node:lts-alpine AS base

# Install necessary tools
RUN apk add --no-cache libc6-compat postgresql-client

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure the .next directory is created
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PGHOST=db
ENV PGDATABASE=forms
ENV PGUSERNAME=forms
ENV PGPASSWORD=forms

# Create a non-root user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/scripts ./scripts

# Install production dependencies
RUN pnpm install --prod

# Set proper permissions before switching user
RUN chmod +x ./scripts/docker-entrypoint.sh
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application using the entrypoint script
CMD ["./scripts/docker-entrypoint.sh"]
