import {
  completeLoginCallback,
  initAuth,
  isAuthenticated,
  login,
} from "~/composables/useAuth"

function hasOidcParams(): boolean {
  const params = new URLSearchParams(window.location.search)
  return params.has("code") && params.has("state")
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig().public
  initAuth({
    enabled: config.authEnabled,
    oidcAuthority: config.oidcAuthority,
    oidcClientId: config.oidcClientId,
    oidcLogoutDomain: config.oidcLogoutDomain,
    oidcIdentityProvider: config.oidcIdentityProvider,
  })

  if (!config.authEnabled) return

  if (hasOidcParams()) {
    const returnUrl = await completeLoginCallback()
    const url = new URL(returnUrl, window.location.origin)

    if (url.origin !== window.location.origin) {
      window.location.replace(`${window.location.origin}/`)
    } else {
      window.location.replace(url.toString())
    }

    return
  }

  addRouteMiddleware(
    "auth",
    async () => {
      const ok = await isAuthenticated()
      if (!ok) {
        await login()
        return false
      }
    },
    { global: true },
  )
})
