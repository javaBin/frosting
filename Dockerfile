# syntax=docker/dockerfile:1.23

FROM --platform=$BUILDPLATFORM node:25-trixie-slim AS build

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:25-trixie-slim AS deploy

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/.output ./

CMD ["node", "/app/server/index.mjs"]

