import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import { defineComponent, h } from 'vue';
import { createRouter, createMemoryHistory, RouterLink } from 'vue-router';
import { Icon as IconifyIcon } from '@iconify/vue';
import PrimeVue from 'primevue/config';
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
import { Typography as UiTypography } from '../app/components/ui/Typography';

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
    app.use(PrimeVue, {
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

    // Nuxt component equivalents used inside app components
    app.component('NuxtLink', RouterLink);
    app.component('UiTypography', UiTypography);
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
