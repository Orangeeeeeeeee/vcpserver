import type { ChipDesignTokens } from '@primeuix/themes/types/chip';

const chip: ChipDesignTokens = {
    root: {
        borderRadius: '4px',
        paddingX: '0.5rem',
        paddingY: '0.25rem',
        gap: '0.375rem'
    },
    image: {
        width: '2rem',
        height: '2rem'
    },
    icon: {
        size: '1rem'
    },
    removeIcon: {
        size: '1rem'
    },
    colorScheme: {
        light: {
            root: { background: '{surface.200}', color: '{surface.700}' },
            icon: { color: '{surface.700}' },
            removeIcon: { color: '{surface.700}' }
        },
        dark: {
            root: { background: '{surface.800}', color: '{surface.100}' },
            icon: { color: '{surface.100}' },
            removeIcon: { color: '{surface.100}' }
        }
    },
    css: `
        .p-chip-label {
            font-size: 0.75rem;
        }
    `
};

export default chip;
