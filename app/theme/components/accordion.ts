import type { AccordionDesignTokens } from '@primeuix/themes/types/accordion';

const accordion: AccordionDesignTokens = {
    panel: {
        borderWidth: '0 0 1px 0',
        borderColor: '{surface.200}'
    },
    header: {
        background: 'transparent',
        hoverBackground: 'transparent',
        activeBackground: 'transparent',
        activeHoverBackground: 'transparent',
        borderWidth: '0',
        padding: '1rem 0',
        color: '{surface.900}',
        hoverColor: '{surface.900}',
        activeColor: '{surface.900}',
        activeHoverColor: '{surface.900}',
        toggleIcon: {
            color: '{surface.700}',
            hoverColor: '{surface.900}',
            activeColor: '{surface.700}',
            activeHoverColor: '{surface.900}'
        }
    },
    content: {
        background: 'transparent',
        borderWidth: '0',
        color: '{text.color}',
        padding: '0 0 1.25rem 0'
    }
};

export default accordion;
