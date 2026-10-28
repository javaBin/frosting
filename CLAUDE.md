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
pnpm format:check # Prettier check only
pnpm typecheck    # vue-tsc via nuxt typecheck
pnpm check        # lint + format:check + typecheck — run after every change
```

There are no unit tests in this project.

## Architecture

### Authentication
- OIDC Authorization Code flow via `oidc-client-ts`
- Tokens in browser `sessionStorage`; cleared on browser close
- Global auth middleware in `app/plugins/auth.client.ts` protects all routes; the plugin also passes runtime config to `initAuth()`, and code elsewhere checks `isAuthEnabled()` rather than calling `useRuntimeConfig()`
- Login is always on in production builds; under `pnpm dev` (which loads `local.env`) only with `JWT_ENABLED=true`, against the same prod Cognito pool
- `helter` group required for access; home page warns if user is not a member
- Logic lives in `app/composables/useAuth.ts`

### API layer
- `app/composables/useApiFetch.ts` — `apiFetch`/`apiJson` wrap `fetch` with Bearer token injection; on 401, refresh the token and retry once
- `server/middleware/proxy.ts` — Nitro/h3 server middleware that proxies `/api/*` (except `/api/_nuxt_icon`) to the Cupcake backend, keeping everything same-origin to avoid CORS. It streams the body and gzips JSON for clients that accept it: Node's `fetch` decodes the backend's gzip, so without this the browser would get the session lists uncompressed (~1.3 MB instead of ~450 KB)

### State management
- No Pinia — uses Nuxt `useState()` composables
- `app/composables/conferences.ts` — conference list
- `app/composables/useSessionData.ts` — sessions per conference (state keyed by conference id)
- `app/composables/sessions.ts` — session helpers (links, lookup, duration formatting); no state
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
| `CUPCAKE_BACKEND` | `http://127.0.0.1:8080` (dev) / `https://cupcake-backend.javazone.no` (prod) | Backend URL for server-side proxy |
| `CUPCAKE_FRONTEND` | `localhost` | Hostname for Vite `allowedHosts` |
| `NUXT_PUBLIC_OIDC_AUTHORITY` | Cognito internal pool issuer | OIDC issuer URL |
| `NUXT_PUBLIC_OIDC_CLIENT_ID` | prod public Cognito client | OIDC client ID |
| `JWT_ENABLED` | unset | `true` in `local.env` turns login on under `pnpm dev` |

Local dev needs no OIDC overrides either way; the defaults are the prod Cognito values.

## Code style

- TypeScript throughout; `any` is not acceptable
- No semicolons (Prettier config)
- ESLint + Prettier enforced via pre-commit hooks (lint-staged + husky)
- All changes must pass `pnpm check` before merging (enforced in `pr.yaml`)
- Use exact versions for dependencies
