# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Frosting is a Vue 3/Nuxt frontend (SPA mode, no SSR) for the [Cupcake](https://github.com/javaBin/cupcake) backend. It lets javaBin heroes (`helter` group) browse JavaZone conferences and sessions to find potential speakers for local events.

## Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server on :3000 (proxies /api/* to :8080)
pnpm build        # Production build (outputs to .output/)
pnpm preview      # Preview production build
pnpm lint         # ESLint check
pnpm lint:fix     # ESLint auto-fix
pnpm format       # Prettier format
```

There are no unit tests in this project.

## Architecture

### Authentication
- OIDC Authorization Code flow via `oidc-client-ts`
- Tokens in browser `sessionStorage`; cleared on browser close
- Global auth middleware in `app/plugins/auth.client.ts` protects all routes
- `helter` group required for access; home page warns if user is not a member
- Logic lives in `app/composables/useAuth.ts`

### API layer
- `app/composables/useApiFetch.ts` — wraps `$fetch` with Bearer token injection; on 401, silently refreshes token and retries
- `server/middleware/proxy.ts` — Nitro/h3 server middleware that transparently proxies `/api/*`, `/login`, and `/refresh` to the Cupcake backend, keeping everything same-origin to avoid CORS

### State management
- No Pinia — uses Nuxt `useState()` composables
- `app/composables/conferences.ts` — conference list
- `app/composables/sessions.ts` — sessions per conference
- `app/composables/useSessionData.ts` — single session detail
- `app/composables/useUser.ts` — current user from `/api/me`
- Each composable uses `Pending`/`Loaded` flags to prevent duplicate API calls

### Pages
| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/pages/index.vue` | Auth check, user info, role warning |
| `/conference/[conferenceId]` | `app/pages/conference/[conferenceId]/index.vue` | Session browser with format/language/status filters |
| `/conference/[conferenceId]/session/[sessionId]` | `app/pages/conference/[conferenceId]/session/[sessionId]/index.vue` | Session detail with full speaker info |

## Key environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CUPCAKE_BACKEND` | `http://127.0.0.1:8080` (dev) / `https://cupcake-backend.java.no` (prod) | Backend URL for server-side proxy |
| `CUPCAKE_FRONTEND` | `localhost` | Hostname for Vite `allowedHosts` |
| `NUXT_PUBLIC_OIDC_AUTHORITY` | `https://auth.home.chrissearle.org/realms/HA12` | Keycloak realm URL |
| `NUXT_PUBLIC_OIDC_CLIENT_ID` | `cupcake-client` | OIDC client ID |

For local dev against the Cupcake backend with `JWT_ENABLED=false`, no OIDC config overrides are needed.

## Code style

- TypeScript throughout; `any` is not acceptable
- No semicolons (Prettier config)
- ESLint + Prettier enforced via pre-commit hooks (lint-staged + husky)
- All changes must pass `pnpm lint` before merging (enforced in `pr.yaml`)
- Use exact versions for dependencies
