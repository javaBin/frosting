let frontend_host = "localhost"

if (
  "CUPCAKE_FRONTEND" in process.env &&
  process.env.CUPCAKE_FRONTEND !== undefined
) {
  frontend_host = process.env.CUPCAKE_FRONTEND
}

// Production builds always require login. `pnpm dev` loads local.env and logs in
// only with JWT_ENABLED=true there, the same switch the cupcake backend uses.
// NUXT_PUBLIC_AUTH_ENABLED overrides this at runtime.
const authEnabled =
  process.env.NODE_ENV !== "development" || process.env.JWT_ENABLED === "true"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-08-06",

  runtimeConfig: {
    public: {
      authEnabled,
      oidcAuthority:
        "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_Icikv3dtD",
      // The prod public client (no secret); its callback and logout URLs include
      // http://localhost:3000/ so local login works against the same pool
      oidcClientId: "70picsu9i2ubl8vpu4p587isqa",
      oidcLogoutDomain: "javabin-internal.auth.eu-central-1.amazoncognito.com",
      // Cognito IdP to sign in through (platform COGNITO_IDENTITY_PROVIDER).
      // Empty locally: Cognito then picks the client's only IdP, but drops
      // prompt, so the Google account chooser only shows when this is set.
      oidcIdentityProvider: "",
    },
  },

  ssr: false,
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@artmizu/nuxt-prometheus",
  ],
  vite: {
    server: {
      allowedHosts: [frontend_host],
    },
  },
  icon: {
    serverBundle: {
      collections: ["carbon", "lucide", "logos", "openmoji"],
    },
    // Ship the icons the source uses with the app instead of fetching each one at
    // runtime. The default scan skips .ts files, where app/utils/sessionDisplay.ts
    // names the session icons.
    clientBundle: {
      scan: { globInclude: ["**/*.{vue,ts}"] },
    },
  },

  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "system",
    fallback: "dark",
    classSuffix: "",
  },
})
