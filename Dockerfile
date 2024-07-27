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
RUN yarn prisma db push
RUN yarn run build

FROM base AS runner
WORKDIR /app
RUN yarn global add prisma
ENV PATH="${PATH}:/usr/local/share/.config/yarn/global/node_modules/.bin"
ENV NODE_ENV production
COPY --from=builder /app/public ./public
RUN mkdir .next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY entrypoint.sh ./
COPY prisma/schema.prisma ./prisma/schema.prisma

RUN chmod +x ./entrypoint.sh

ENV PORT 10003
EXPOSE 10003

ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]