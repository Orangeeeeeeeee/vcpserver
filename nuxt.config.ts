import tailwindcss from '@tailwindcss/vite';
import VcpPreset from './app/theme/preset';
import { UK_LOCALE } from './app/theme/primevue-locale';
import { ROUTES } from './app/constants/routes';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        plugins: [tailwindcss()]
    },
    vue: {
        compilerOptions: {
            // Vidstack player ships <media-*> web components
            isCustomElement: (tag) => tag.startsWith('media-')
        }
    },
    compatibilityDate: '2025-07-15',
    routeRules: {
        '/': { redirect: ROUTES.OBJECTS_ONLINE },
        [ROUTES.OBJECTS]: { redirect: ROUTES.OBJECTS_ONLINE },
        [ROUTES.ACCOUNT]: { redirect: ROUTES.ACCOUNT_INFO }
    },
    devtools: { enabled: false },
    runtimeConfig: {
        public: {
            /** Mapbox access token; override via NUXT_PUBLIC_MAPBOX_TOKEN */
            mapboxToken: ''
        }
    },
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
    fonts: {
        defaults: {
            // Variable-font range: one woff2 per subset covers weights 400-700.
            // Without this @nuxt/fonts falls back to the fontless default [400],
            // so medium/semibold/bold render as faux-bold synthesized from 400.
            weights: ['400 700']
        }
    },
    i18n: {
        locales: [{ code: 'ua', language: 'uk-UA', file: 'ua.json' }],
        defaultLocale: 'ua',
        langDir: '../i18n/locales'
    },
    primevue: {
        options: {
            // Deep-merged over the built-in English locale by PrimeVue
            locale: UK_LOCALE,
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
