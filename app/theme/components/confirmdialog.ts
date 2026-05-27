import type { ConfirmDialogDesignTokens } from '@primeuix/themes/types/confirmdialog';

const confirmdialog: ConfirmDialogDesignTokens = {
    icon: {
        size: '1.5rem',
        color: '{red.600}'
    },
    content: {
        gap: '1rem'
    },
    css: `
        .p-confirmdialog .p-dialog-footer {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
            width: 100%;
        }

        .p-confirmdialog .p-dialog-footer .p-button {
            width: 100%;
        }
    `
};

export default confirmdialog;
