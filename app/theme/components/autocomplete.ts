import type { AutoCompleteDesignTokens } from '@primeuix/themes/types/autocomplete';

const autocomplete: AutoCompleteDesignTokens = {
    list: {
        gap: '0',
        padding: '0'
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
    dropdown: {
        background: 'transparent',
        hoverBackground: 'transparent',
        activeBackground: 'transparent',
        borderColor: 'transparent',
        hoverBorderColor: 'transparent',
        activeBorderColor: 'transparent'
    },
    css: `
    .p-autocomplete {
        min-height: 2.5rem;
        height: 100%;
    }

    .p-autocomplete-input {
        font-size: 0.875rem;
        border: none;
        background: transparent;
        box-shadow: none;
        padding: 0;
        min-height: unset;
        width: 100%;
    }

    .p-autocomplete-input:focus {
        box-shadow: none;
        outline: none;
    }

    .p-autocomplete-dropdown {
        color: var(--p-select-dropdown-color, var(--p-surface-400));
        transition: color 0.3s, transform 0.3s;
    }

    .p-autocomplete.p-autocomplete-open .p-autocomplete-dropdown {
        color: var(--p-primary-600);
        transform: scale(-1, -1);
    }

    .p-autocomplete-option {
        font-size: 0.875rem;
    }

    .p-autocomplete-empty-message {
        font-size: 0.875rem;
        padding: 0.75rem;
    }
    `
};

export default autocomplete;
