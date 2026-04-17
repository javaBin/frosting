# Frosting

Vue 3 / Nuxt frontend for [cupcake](https://github.com/javaBin/cupcake). Lets javaBin heroes (`helter` group) browse JavaZone conferences and sessions to find potential speakers for local events.

## Tech stack

- **Framework**: Nuxt (SPA mode)
- **UI**: Nuxt UI + Tailwind CSS
- **Auth**: OIDC Authorization Code flow via `oidc-client-ts`
- **Icons**: Nuxt Icon (Carbon, Lucide, Logos, OpenMoji)
- **Metrics**: Prometheus via `@artmizu/nuxt-prometheus`
- **Package manager**: pnpm

## Pages

| Route                                            | Description                                                  |
| ------------------------------------------------ | ------------------------------------------------------------ |
| `/`                                              | Home — shows authenticated user and role check               |
| `/conference/[conferenceId]`                     | Session browser with filtering for a conference              |
| `/conference/[conferenceId]/session/[sessionId]` | Session detail with full speaker info (bio, email, location) |

## Authentication

The app uses the OIDC Authorization Code flow. Tokens are stored in browser `sessionStorage`. All API requests are automatically sent with a Bearer token, and a 401 response triggers a silent refresh before retrying.

Access requires membership in the `helter` group in Cognito. The home page displays a warning if the authenticated user is not a member.

## Local development

Install dependencies:

```bash
pnpm install
```

Start the dev server (proxies `/api/*` to `http://127.0.0.1:8080` by default):

```bash
pnpm dev
```

The cupcake backend must be running locally unless you override `CUPCAKE_BACKEND`. With `JWT_ENABLED=false` on the backend, no auth configuration is needed.

The frontend OIDC defaults point to the development Keycloak realm, so no `NUXT_PUBLIC_OIDC_*` overrides are needed for local dev against that environment.

## Preview a production build

```bash
pnpm build
pnpm preview
```

## Linting

```bash
pnpm lint        # check
pnpm lint:fix    # auto-fix
```

ESLint and Prettier are also enforced via pre-commit hooks (lint-staged).

## Configuration

| Environment Variable         | Description                                          | Default                                                                  |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| `CUPCAKE_BACKEND`            | Backend base URL for the server-side proxy           | `http://127.0.0.1:8080` (dev) / `https://cupcake-backend.java.no` (prod) |
| `CUPCAKE_FRONTEND`           | Hostname the dev server allows (Vite `allowedHosts`) | `localhost`                                                              |
| `NUXT_PUBLIC_OIDC_AUTHORITY` | OIDC authority URL (e.g. Keycloak realm URL)         | `https://auth.home.chrissearle.org/realms/HA12`                          |
| `NUXT_PUBLIC_OIDC_CLIENT_ID` | OIDC client ID                                       | `cupcake-client`                                                         |

`NUXT_PUBLIC_OIDC_AUTHORITY` and `NUXT_PUBLIC_OIDC_CLIENT_ID` must match the `OIDC_WELL_KNOWN_URL` and `OIDC_EXPECTED_AZP` values configured on the backend.

## Proxy middleware

The Nuxt server middleware transparently proxies the following paths to the cupcake backend:

- `/api/*` — conference and session data
- `/login` — OIDC login initiation
- `/refresh` — token refresh

This keeps the frontend and backend on the same origin from the browser's perspective, avoiding CORS issues.

## Docker

Multi-platform images (`linux/amd64`, `linux/arm64`) are published to `ghcr.io/javabin/frosting`.

To build locally:

```bash
docker build -t frosting .
```

The image uses a multi-stage build (Node build stage, slim runtime stage) and serves via the Nitro server on port 3000.

## CI/CD

| Trigger        | Workflow       | What it does                                                     |
| -------------- | -------------- | ---------------------------------------------------------------- |
| Push to `main` | `build.yaml`   | Builds and pushes multi-platform Docker image, tags as `staging` |
| Pull request   | `pr.yaml`      | Runs `pnpm lint` and `pnpm build`                                |
| Tag `v*`       | `release.yaml` | Promotes `staging` image to `release` and version tag            |
