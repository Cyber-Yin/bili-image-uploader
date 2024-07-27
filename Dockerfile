FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM base AS prod
WORKDIR /add
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --production
RUN yarn prisma generate

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn prisma db push
RUN yarn run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=prod /app/node_modules ./node_modules
COPY package.json ./package.json
COPY prisma/schema.prisma ./prisma

ENV PORT 10003
EXPOSE 10003

ENV HOSTNAME "0.0.0.0"

CMD ["yarn", "run", "prod"]