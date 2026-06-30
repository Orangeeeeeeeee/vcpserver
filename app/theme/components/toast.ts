import type { ToastDesignTokens } from '@primeuix/themes/types/toast';

const toast: ToastDesignTokens = {
    content: {
        padding: '1rem',
        gap: '0.75rem'
    },
    css: `
        .p-toast-top-right .p-toast-message {
            margin-left: 1.25rem;
        }
    `
};

export default toast;
