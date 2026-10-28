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

The cupcake backend must be running locally unless you override `CUPCAKE_BACKEND`.

`pnpm dev` loads `local.env` (gitignored) if it exists. Login is off in dev by default. To test with login, set `JWT_ENABLED=true` in `local.env` here and in cupcake's. Both then use the prod Cognito pool; its public client allows `http://localhost:3000/` as a callback and logout URL, so you sign in with your `@java.no` Google account as in prod. You need to be in the `helter` group. Production builds always require login.

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
| `CUPCAKE_BACKEND`            | Backend base URL for the server-side proxy           | `http://127.0.0.1:8080` (dev) / `https://cupcake-backend.javazone.no` (prod) |
| `CUPCAKE_FRONTEND`           | Hostname the dev server allows (Vite `allowedHosts`) | `localhost`                                                              |
| `NUXT_PUBLIC_OIDC_AUTHORITY` | OIDC authority (issuer) URL                          | Cognito internal pool issuer                                             |
| `NUXT_PUBLIC_OIDC_CLIENT_ID` | OIDC client ID                                       | The prod public Cognito client                                           |
| `JWT_ENABLED`                | `true` turns login on under `pnpm dev`               | unset (login off in dev, always on in production builds)                 |

In the platform deployment the OIDC values are injected via `auth.env` in `app.yaml` (aliases of `COGNITO_ISSUER_URL` and `COGNITO_CLIENT_ID` for the platform-created public Cognito client). The defaults are the same prod values, so local login needs no OIDC settings.

## Proxy middleware

The Nuxt server middleware proxies `/api/*` (except `/api/_nuxt_icon`) to the cupcake backend, keeping API calls same-origin. It streams responses and gzips JSON for browsers that accept it.

This keeps the frontend and backend on the same origin from the browser's perspective, avoiding CORS issues.

## Docker

The javaBin platform builds and pushes the deployed image (see CI/CD). To build locally:

```bash
docker build -t frosting .
```

The image uses a multi-stage build (Node build stage, slim runtime stage) and serves via the Nitro server on port 3000.

## CI/CD

| Trigger | Workflow | What it does |
| --- | --- | --- |
| Push to `main` | `deploy.yaml` | The javaBin platform workflow runs `pnpm build` and `pnpm test` (which is `pnpm check`: lint, format check, typecheck), then builds the image and deploys it. Nothing deploys if either fails |
| Pull request | `deploy.yaml` | Platform build and Terraform plan, no deploy |
| Pull request | `pr.yaml` | Runs `pnpm check` and `pnpm build` |
