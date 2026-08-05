import type { DatePickerDesignTokens } from '@primeuix/themes/types/datepicker';

const datepicker: DatePickerDesignTokens = {
    panel: {
        background: '{surface.100}',
        borderColor: '{surface.300}',
        borderRadius: '8px',
        shadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.1)',
        padding: '0.625rem'
    },
    header: {
        color: '{surface.950}',
        background: 'transparent',
        borderColor: 'transparent',
        padding: '0'
    },
    title: {
        fontWeight: '500'
    },
    weekDay: {
        padding: '0.25rem 0',
        fontWeight: '500',
        color: '{surface.800}'
    },
    date: {
        padding: '0.2rem',
        color: '{surface.800}',
        hoverBackground: '{primary.300}',
        hoverColor: '{surface.100}',
        selectedColor: '{surface.100}',
        selectedBackground: '{primary.300}',
        rangeSelectedColor: '{surface.800}',
        rangeSelectedBackground: '{surface.200}',
        borderRadius: '6px'
    },
    today: {
        background: '{primary.300}',
        color: '{surface.900}'
    },
    inputIcon: {
        color: '{surface.500}'
    },
    css: `
    .p-datepicker-panel {
        max-width: 320px;
    }

    .p-datepicker-weekday {
        font-size: 0.875rem;
        width: 2rem;
        height: 2rem;
    }
    .p-datepicker-day {
        font-weight: 500;
        font-size: 0.875rem;
    }
    .p-datepicker-input {
        font-size: 0.875rem;
    }

    .p-datepicker-header .p-datepicker-prev-button, .p-datepicker-header .p-datepicker-next-button{
        // padding: 0;
        // width: 1rem;
        // height: 1rem;
        color: var(--p-surface-800);
    }

    .p-datepicker-header .p-datepicker-prev-button svg, .p-datepicker-header .p-datepicker-next-button svg {
        width: 0.8rem;
        height: 0.8rem;
    }
    `
};

export default datepicker;
