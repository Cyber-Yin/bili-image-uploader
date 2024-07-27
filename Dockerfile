FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn prisma generate
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
RUN yarn run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
RUN mkdir .next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY prisma/schema.prisma ./prisma/schema.prisma

ENV PORT 10003
EXPOSE 10003

ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]