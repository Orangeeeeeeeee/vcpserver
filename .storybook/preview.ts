import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import PrimeVue from 'primevue/config';
import VcpPreset from '../app/theme/preset';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import '@fontsource-variable/inter';
import '@fontsource-variable/manrope';
import '../app/assets/css/main.css';
import './storybook.css';

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
