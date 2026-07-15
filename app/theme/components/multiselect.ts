import type { MultiSelectDesignTokens } from '@primeuix/themes/types/multiselect';

const multiselect: MultiSelectDesignTokens = {
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
        gap: '0.5rem'
    },
    optionGroup: {
        fontWeight: '400',
        padding: '0.75rem 0.75rem 0.5rem'
    },
    chip: {
        borderRadius: '4px'
    },
    overlay: {
        background: '{surface.100}',
        borderColor: '{surface.300}',
        shadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.1)'
    },
    css: `
        .p-multiselect {
            min-height: 2.5rem;
            height: 100%;
        }

        .p-multiselect-lg {
            min-height: 3.75rem;
        }

        .p-multiselect-sm {
            min-height: 2rem;
        }

        .p-multiselect.p-multiselect-open .p-multiselect-dropdown .p-multiselect-dropdown-icon {
            transition: transform .3s, color .3s;
            transform: scale(-1, -1);
            color: var(--p-primary-600);
        }

        .p-multiselect-label {
            font-size: 0.875rem;
            flex-wrap: wrap;
        }

        .p-multiselect-option {
            font-size: 0.875rem;
        }

        .p-multiselect-empty-message {
            font-size: 0.875rem;
        }
        
        .p-multiselect-label:has(.p-chip) {
            padding: calc(var(--p-multiselect-padding-y) / 2) var(--p-multiselect-padding-x);
        }
    `
};

export default multiselect;
