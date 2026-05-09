#!/bin/sh
set -e
export NUXT_PUBLIC_OIDC_AUTHORITY="${COGNITO_ISSUER_URL}"
export NUXT_PUBLIC_OIDC_CLIENT_ID="${COGNITO_CLIENT_ID}"
exec node /app/server/index.mjs
