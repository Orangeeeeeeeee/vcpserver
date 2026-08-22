import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import { defineComponent, h } from 'vue';
import { createRouter, createMemoryHistory, RouterLink } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { Icon as IconifyIcon } from '@iconify/vue';
import PrimeVue from 'primevue/config';
import ua from '../i18n/locales/ua.json';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import Breadcrumb from 'primevue/breadcrumb';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Avatar from 'primevue/avatar';
import PrimeVueButton from 'primevue/button';
import VcpPreset from '../app/theme/preset';
import { UK_LOCALE } from '../app/theme/primevue-locale';
import { Typography as UiTypography } from '../app/components/ui/Typography';
import { Pagination as UiPagination } from '../app/components/ui/Pagination';
import { TabNav as UiTabNav } from '../app/components/ui/TabNav';
import AnimatedList from '../app/components/ui/AnimatedList/AnimatedList.vue';

import '@fontsource-variable/inter';
import '@fontsource-variable/manrope';
import '../app/assets/css/main.css';
import './storybook.css';

/** Memory router so Nuxt-coupled features (useRoute, router-link, NuxtLink) work in Storybook */
const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
});
router.push('/account/info').catch(() => {});

/**
 * Idempotency guard for setup(): prevents re-installing vue-router (and other
 * plugins) on the same Vue app instance during HMR. Without this, editing
 * preview.ts or any module it re-evaluates creates a fresh router plugin
 * object; when Storybook re-applies setup() to the existing app, vue-router's
 * install() tries to Object.defineProperty('$route', …) a second time on
 * globalProperties and throws "Cannot redefine property: $route".
 *
 * Symbol.for(...) is required so the key survives HMR re-evaluations of this
 * file (a local Symbol() would be a new key each time and defeat the guard).
 */
const INSTALLED = Symbol.for('vcp.storybook.installed');

/**
 * Stub for the Nuxt `<Icon>` component, backed by @iconify/vue.
 * Accepts both `name` (@nuxt/icon API, used in app code) and `icon`
 * (@iconify/vue API, used in stories) so either renders in Storybook.
 */
const NuxtIcon = defineComponent({
    name: 'Icon',
    props: {
        name: { type: String, default: '' },
        icon: { type: String, default: '' }
    },
    setup(props, { attrs }) {
        return () =>
            h(IconifyIcon, { icon: props.name || props.icon, ...attrs });
    }
});

setup((app) => {
    if ((app as unknown as Record<symbol, boolean>)[INSTALLED]) return;
    (app as unknown as Record<symbol, boolean>)[INSTALLED] = true;

    app.use(PrimeVue, {
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
    });
    app.use(ToastService);
    app.use(ConfirmationService);
    app.use(router);
    app.use(createI18n({ legacy: false, locale: 'ua', messages: { ua } }));

    // Nuxt component equivalents used inside app components
    app.component('NuxtLink', RouterLink);
    app.component('UiTypography', UiTypography);
    app.component('UiPagination', UiPagination);
    app.component('UiTabNav', UiTabNav);
    app.component('UiAnimatedList', AnimatedList);
    app.component('Icon', NuxtIcon);

    // PrimeVue components are auto-imported in Nuxt; register the used ones here
    app.component('Tabs', Tabs);
    app.component('TabList', TabList);
    app.component('Tab', Tab);
    app.component('Breadcrumb', Breadcrumb);
    app.component('DataTable', DataTable);
    app.component('Column', Column);
    app.component('Tag', Tag);
    app.component('Avatar', Avatar);
    app.component('Button', PrimeVueButton);
});

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    }
};

export default preview;
