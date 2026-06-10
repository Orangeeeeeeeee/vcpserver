import type { SelectDesignTokens } from '@primeuix/themes/types/select';

const select: SelectDesignTokens = {
    root: {
        sm: {
            fontSize: '0.75rem',
            paddingX: '0.45rem',
            paddingY: '0.45rem'
        },
        lg: {
            fontSize: '1.25rem',
            paddingX: '0.9rem',
            paddingY: '0.9rem'
        }
    },
    list: {
        gap: '0',
        padding: '0',
        header: {
            padding: '0.75rem 0.75rem 0.5rem 0.75rem'
        }
    },
    option: {
        padding: '0.75rem',
        color: '{surface.800}',
        focusColor: '{primary.600}',
        selectedColor: '{primary.600}',
        focusBackground: 'transparent',
        selectedBackground: 'transparent',
        selectedFocusBackground: 'transparent'
    },
    overlay: {
        background: '{surface.100}',
        borderColor: '{surface.300}',
        shadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.1)'
    },
    css: `
    .p-select-label {
        font-size: 0.875rem;
    }

    .p-select-option {
        font-size: 0.875rem;
    }
    `
};

export default select;
