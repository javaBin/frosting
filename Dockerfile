# syntax=docker/dockerfile:1.28

FROM node:26-trixie-slim AS build

ENV CI=true

RUN npm install -g pnpm@12.15.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:26-trixie-slim AS deploy

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/.output ./

# uid 1000 (node), matching the platform's compute.user default.
USER node

CMD ["node", "/app/server/index.mjs"]

