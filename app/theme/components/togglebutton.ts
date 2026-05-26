import type { ToggleButtonDesignTokens } from '@primeuix/themes/types/togglebutton';

const togglebutton: ToggleButtonDesignTokens = {
    root: {
        padding: '0',
        borderRadius: '4px',
        gap: '0.5rem',
        fontWeight: '500',
        disabledBackground: '{form.field.disabled.background}',
        disabledBorderColor: '{form.field.disabled.background}',
        disabledColor: '{form.field.disabled.color}',
        invalidBorderColor: '{form.field.invalid.border.color}',
        transitionDuration: '{form.field.transition.duration}',
        sm: {
            padding: '0'
        },
        lg: {
            padding: '0'
        }
    },
    content: {
        padding: '0.25rem 1.25rem',
        borderRadius: '4px',
        checkedShadow: 'none',
        sm: { padding: '0.25rem 0.75rem' },
        lg: { padding: '0.25rem 1.5rem' }
    },
    colorScheme: {
        light: {
            root: {
                background: '{surface.200}',
                checkedBackground: 'none',
                hoverBackground: '{primary.100}',
                borderColor: 'transparent',
                color: '{surface.700}',
                hoverColor: '{primary.600}',
                checkedColor: '{primary.600}',
                checkedBorderColor: 'transparent'
            },
            content: { checkedBackground: '{primary.100}' },
            icon: {
                color: '{surface.700}',
                hoverColor: '{primary.600}',
                checkedColor: '{primary.600}'
            }
        },
        dark: {
            root: {
                background: '{surface.950}',
                checkedBackground: '{surface.950}',
                hoverBackground: '{surface.950}',
                borderColor: '{surface.950}',
                color: '{surface.400}',
                hoverColor: '{surface.300}',
                checkedColor: '{surface.0}',
                checkedBorderColor: '{surface.950}'
            },
            content: { checkedBackground: '{surface.800}' },
            icon: {
                color: '{surface.400}',
                hoverColor: '{surface.300}',
                checkedColor: '{surface.0}'
            }
        }
    },
    css: `
        .p-togglebutton {
            border: none;
        }
    `
};

export default togglebutton;
