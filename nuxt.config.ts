import tailwindcss from '@tailwindcss/vite';
import VcpPreset from './app/theme/preset';
import { ROUTES } from './app/constants/routes';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        plugins: [tailwindcss()]
    },
    compatibilityDate: '2025-07-15',
    routeRules: {
        '/': { redirect: ROUTES.OBJECTS_ONLINE },
        [ROUTES.OBJECTS]: { redirect: ROUTES.OBJECTS_ONLINE },
        [ROUTES.ACCOUNT]: { redirect: ROUTES.ACCOUNT_INFO }
    },
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    components: [
        {
            path: '~/components',
            pathPrefix: true,
            ignore: ['**/index.ts']
        }
    ],
    modules: [
        '@nuxt/icon',
        '@primevue/nuxt-module',
        '@nuxt/eslint',
        '@nuxtjs/i18n',
        '@nuxt/fonts'
    ],
    icon: {
        mode: 'svg',
        customCollections: [{ prefix: 'custom', dir: './app/assets/icons' }]
    },
    i18n: {
        locales: [{ code: 'ua', language: 'uk-UA', file: 'ua.json' }],
        defaultLocale: 'ua',
        langDir: '../i18n/locales'
    },
    primevue: {
        options: {
            theme: {
                preset: VcpPreset,
                options: {
                    darkModeSelector: '[data-theme="dark"]',
                    cssLayer: {
                        name: 'primevue',
                        order: 'theme, base, primevue'
                    }
                }
            }
        }
    }
});
