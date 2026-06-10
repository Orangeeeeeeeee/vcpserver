import type { MenuDesignTokens } from '@primeuix/themes/types/menu';

const menu: MenuDesignTokens = {
    root: {
        background: '{surface.100}',
        borderColor: '{surface.200}',
        borderRadius: '10px',
        shadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        color: '{surface.800}'
    },
    list: {
        padding: '0.375rem',
        gap: '0'
    },
    item: {
        padding: '0.625rem',
        color: '{surface.900}',
        focusColor: '{primary.600}',
        focusBackground: 'transparent',
        borderRadius: '6px'
    },
    css: `
    .p-menu-item-label {
        font-size: 0.875rem;
    }
    `
};

export default menu;
