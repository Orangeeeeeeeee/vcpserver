import type { PaginatorDesignTokens } from '@primeuix/themes/types/paginator';

const paginator: PaginatorDesignTokens = {
    root: {
        padding: '1rem',
        gap: '0.25rem',
        borderRadius: '0',
        background: '{surface-100}',
        color: '{content.color}',
        transitionDuration: '{transition.duration}'
    },
    navButton: {
        background: 'transparent',
        hoverBackground: '{surface.200}',
        selectedBackground: '{surface.200}',
        color: '{surface.700}',
        hoverColor: '{primary.950}',
        selectedColor: '{primary.950}',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '8px'
    },
    currentPageReport: {
        color: '{text.muted.color}'
    },
    jumpToPageInput: {
        maxWidth: '2.5rem'
    }
};

export default paginator;
