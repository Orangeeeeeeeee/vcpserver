import type { TagDesignTokens } from '@primeuix/themes/types/tag';

const tag: TagDesignTokens = {
    root: {
        fontSize: '0.75rem',
        fontWeight: '400',
        padding: '0.13rem 0.5rem',
        gap: '0.375rem',
        borderRadius: '4px'
    },
    icon: {
        size: '0.875rem'
    },
    colorScheme: {
        light: {
            primary: { background: '{sky.100}', color: '{sky.500}' },
            secondary: { background: '{surface.100}', color: '{surface.700}' },
            success: { background: '{green.100}', color: '{green.500}' },
            info: { background: '{sky.50}', color: '{sky.700}' },
            warn: { background: '{amber.100}', color: '{amber.500}' },
            danger: { background: '{red.100}', color: '{red.500}' },
            contrast: { background: '{surface.950}', color: '{surface.0}' }
        },
        dark: {
            primary: {
                background: 'color-mix(in srgb, {sky.500}, transparent 84%)',
                color: '{sky.300}'
            },
            secondary: {
                background: '{surface.800}',
                color: '{surface.300}'
            },
            success: {
                background: 'color-mix(in srgb, {green.500}, transparent 84%)',
                color: '{green.300}'
            },
            info: {
                background: 'color-mix(in srgb, {sky.500}, transparent 84%)',
                color: '{sky.300}'
            },
            warn: {
                background: 'color-mix(in srgb, {amber.500}, transparent 84%)',
                color: '{amber.300}'
            },
            danger: {
                background: 'color-mix(in srgb, {red.500}, transparent 84%)',
                color: '{red.300}'
            },
            contrast: { background: '{surface.0}', color: '{surface.950}' }
        }
    }
};

export default tag;
