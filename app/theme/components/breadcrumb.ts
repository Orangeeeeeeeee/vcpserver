import type { BreadcrumbDesignTokens } from '@primeuix/themes/types/breadcrumb';

const breadcrumb: BreadcrumbDesignTokens = {
    root: {
        padding: '0',
        background: 'transparent',
        gap: '0.5rem',
        transitionDuration: '{transition.duration}'
    },
    item: {
        color: '{text.muted.color}',
        hoverColor: '{text.color}',
        borderRadius: '{content.border.radius}',
        gap: '{navigation.item.gap}',
        icon: {
            color: '{surface.800}',
            hoverColor: '{navigation.item.icon.focus.color}'
        },
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '{focus.ring.offset}',
            shadow: '{focus.ring.shadow}'
        }
    },
    separator: {
        color: '{surface.400}'
    }
};

export default breadcrumb;
