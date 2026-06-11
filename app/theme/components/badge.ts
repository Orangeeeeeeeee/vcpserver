import type { BadgeDesignTokens } from '@primeuix/themes/types/badge';

const badge: BadgeDesignTokens = {
    root: {
        borderRadius: '9999px',
        padding: '0 0.375rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        minWidth: '1.25rem',
        height: '1.25rem'
    },
    colorScheme: {
        light: {
            primary: { background: '{primary.600}', color: '{surface.50}' },
            secondary: { background: '{surface.200}', color: '{surface.700}' },
            success: { background: '{green.500}', color: '{surface.50}' },
            info: { background: '{sky.500}', color: '{surface.50}' },
            warn: { background: '{amber.500}', color: '{surface.50}' },
            danger: { background: '{red.500}', color: '{surface.50}' },
            contrast: { background: '{surface.950}', color: '{surface.50}' }
        },
        dark: {
            primary: { background: '{primary.200}', color: '{surface.950}' },
            secondary: { background: '{surface.800}', color: '{surface.300}' },
            success: { background: '{green.400}', color: '{surface.950}' },
            info: { background: '{sky.400}', color: '{surface.950}' },
            warn: { background: '{amber.400}', color: '{surface.950}' },
            danger: { background: '{red.400}', color: '{surface.950}' },
            contrast: { background: '{surface.50}', color: '{surface.950}' }
        }
    }
};

export default badge;
