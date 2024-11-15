const routeRulesProxy = () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            '/api/**': {
                proxy: {
                    to: 'http://127.0.0.1:8080/api/**'
                }
            },
            '/login': {
                proxy: {
                    to: 'http://127.0.0.1:8080/login',
                    fetchOptions: { redirect: 'manual' }
                }
            },
            '/slackCallback': {
                proxy: {
                    to: 'http://127.0.0.1:8080/slackCallback',
                    fetchOptions: { redirect: 'manual' }
                }
            }
        }
    } else {
        return {}
    }
}


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    future: {
        compatibilityVersion: 4,
    },
    ssr: false,
    devtools: {enabled: true},
    modules: ['vuetify-nuxt-module'],
    routeRules: routeRulesProxy(),
    vuetify: {
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark'
            }
        }
    }
})