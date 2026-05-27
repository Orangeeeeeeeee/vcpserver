import type { DialogDesignTokens } from '@primeuix/themes/types/dialog';

const dialog: DialogDesignTokens = {
    root: {
        background: '{surface.100}',
        borderColor: '{surface.300}',
        color: '{surface.800}',
        borderRadius: '10px',
        shadow: 'none'
    },
    header: {
        padding: '2rem 2rem 1.25rem 2rem',
        gap: '0.5rem'
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '600'
    },
    content: {
        padding: '0 2rem 1.75rem 2rem'
    },
    footer: {
        padding: '0 2rem 2rem 2rem',
        gap: '0.5rem'
    },
    css: `
         .p-dialog-mask {
             backdrop-filter: blur(4px);
             -webkit-backdrop-filter: blur(4px);
         }

         .p-dialog {
            margin: 0 1rem;
            position: relative;
         }

         .p-dialog-header-actions {
            position: absolute;
            top: 1.125rem;
            right: 1.125rem;
         }

         .p-dialog-header-actions .p-button {
            color: var(--p-surface-800);
            padding: 0.375rem;
         }

         .p-dialog-header-actions .p-button {
            background: transparent !important;
            border: none !important;
         }

         .p-dialog-header-actions .p-button:focus-visible {
            outline: none !important;
         }

         .p-dialog-header-actions .p-button:hover {
            background: transparent !important;
            color: var(--p-surface-800) !important;
         }

         .p-dialog-header {
            display: block;
         }
     `
};

export default dialog;
