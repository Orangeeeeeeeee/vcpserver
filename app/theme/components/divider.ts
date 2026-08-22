import type { DividerDesignTokens } from '@primeuix/themes/types/divider';

const divider: DividerDesignTokens = {
    horizontal: {
        margin: '0',
        padding: '0',
    },
    vertical: {
        margin: '0',
        padding: '0',
    },
    colorScheme: {
        light: {
            root: { borderColor: '{surface.200}' },
            content: { background: '{surface.100}', color: '{surface.700}' }
        },
        dark: {
            root: { borderColor: '{surface.700}' },
            content: { background: '{surface.900}', color: '{surface.400}' }
        }
    }
};

export default divider;
