import type { ToastDesignTokens } from '@primeuix/themes/types/toast';

const toast: ToastDesignTokens = {
    content: {
        padding: '1rem',
        gap: '0.75rem'
    },
    css: `
        .p-toast {
            max-width: calc(100vw - 2.5rem);
        }
    `
};

export default toast;
