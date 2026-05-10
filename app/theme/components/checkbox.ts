import type { CheckboxDesignTokens } from '@primeuix/themes/types/checkbox';

const checkbox: CheckboxDesignTokens = {
    root: {
        borderRadius: '{border.radius.sm}',
        width: '1rem',
        height: '1rem',
        background: '{surface.100}',
        checkedBackground: '{surface.100}',
        checkedHoverBackground: '{surface.100}',
        disabledBackground: '{form.field.disabled.background}',
        filledBackground: '{form.field.filled.background}',
        borderColor: '{form.field.border.color}',
        hoverBorderColor: '{primary.600}',
        focusBorderColor: '{primary.600}',
        checkedBorderColor: '{primary.600}',
        checkedHoverBorderColor: '{primary.600}',
        checkedFocusBorderColor: '{primary.600}',
        checkedDisabledBorderColor: '{surface.200}',
        invalidBorderColor: '{form.field.invalid.border.color}',
        shadow: 'none',
        sm: {
            width: '0.8rem',
            height: '0.8rem'
        },
        lg: {
            width: '1.2rem',
            height: '1.2rem'
        }
    },
    icon: {
        size: '0.875rem',
        color: '{primary.600}',
        checkedColor: '{primary.600}',
        checkedHoverColor: '{primary.600}',
        disabledColor: '{surface.200}',
        sm: {
            size: '0.75rem'
        },
        lg: {
            size: '1rem'
        }
    }
};

export default checkbox;
