import type { PopoverDesignTokens } from '@primeuix/themes/types/popover';

const popover: PopoverDesignTokens = {
    root: {
        background: '{surface.100}',
        borderColor: '{surface.100}',
        borderRadius: '10px',
        shadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.30), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)'
    },
    content: {
        padding: '1.25rem'
    },
    // The arrow is drawn with border-trick pseudo-elements and has no design token to disable it.
    // Must be a plain string (not a function): the Nuxt module serializes the preset into runtime config
    css: `
        .p-popover::before,
        .p-popover::after {
            display: none;
        }
    `
};

export default popover;
