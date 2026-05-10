import tailwindcss from '@tailwindcss/vite';
import VcpPreset from './app/theme/preset';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        plugins: [tailwindcss()]
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
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
