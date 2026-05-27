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
    css: `.p-multiselect-label { font-size: 0.875rem; flex-wrap: wrap; }`
};

export default multiselect;
