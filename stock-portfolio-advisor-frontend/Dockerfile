# Use Node.js 18 as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
# ENV NEXT_TELEMETRY_DISABLED 1
# ENV NODE_ENV development

ENV NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:9090
ENV NEXT_PUBLIC_KEYCLOAK_REALM=stock-advisor
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=sa
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_COOKIE_PREFIX=sa_
ENV NEXT_PUBLIC_SESSION_COOKIE_NAME=sa_session


# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose the port the app runs on
EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Command to run the application
CMD ["node", "server.js"]
