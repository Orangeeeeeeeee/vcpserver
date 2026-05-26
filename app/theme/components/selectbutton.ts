import type { SelectButtonDesignTokens } from '@primeuix/themes/types/selectbutton';

const selectbutton: SelectButtonDesignTokens = {
    root: {
        borderRadius: '4px'
    },
    colorScheme: {
        light: {
            root: { invalidBorderColor: '{form.field.invalid.border.color}' }
        },
        dark: {
            root: { invalidBorderColor: '{form.field.invalid.border.color}' }
        }
    },
    css: `
        .p-selectbutton {
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .p-selectbutton .p-togglebutton {
            border-radius: var(--p-selectbutton-border-radius) !important;
            border-inline-start-width: 1px;
        }
    `
};

export default selectbutton;
