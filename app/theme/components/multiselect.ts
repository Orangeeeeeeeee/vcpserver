import type { MultiSelectDesignTokens } from '@primeuix/themes/types/multiselect';

const multiselect: MultiSelectDesignTokens = {
    root: {
        transitionDuration: '{form.field.transition.duration}',
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
    chip: {
        borderRadius: '4px'
    },
    overlay: {
        background: '{surface.100}',
        borderColor: '{surface.300}',
        shadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.1)'
    },
    css: `.p-multiselect-label { font-size: 0.875rem; flex-wrap: wrap; }`
};

export default multiselect;
