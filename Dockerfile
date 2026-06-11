# syntax=docker/dockerfile:1.24

FROM node:26-trixie-slim AS build

ENV CI=true

RUN npm install -g pnpm@11.5.3

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:26-trixie-slim AS deploy

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/.output ./
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

