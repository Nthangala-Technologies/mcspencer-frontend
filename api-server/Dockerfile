FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY api-server/package.json ./api-server/
COPY lib/db/package.json ./lib/db/
COPY lib/api-zod/package.json ./lib/api-zod/
RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY api-server/ ./api-server/
COPY lib/ ./lib/

RUN pnpm --filter @workspace/api-server run build


FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY api-server/package.json ./api-server/
COPY lib/db/package.json ./lib/db/
COPY lib/api-zod/package.json ./lib/api-zod/
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/api-server/dist ./api-server/dist

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "api-server/dist/index.mjs"]
