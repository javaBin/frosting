// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',

    future: {
        compatibilityVersion: 4,
    },
    ssr: false,
    devtools: {enabled: true},
    modules: ['vuetify-nuxt-module'],
    vuetify: {
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark'
            }
        }
    }
})