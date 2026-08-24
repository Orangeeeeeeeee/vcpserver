import type { BreadcrumbDesignTokens } from '@primeuix/themes/types/breadcrumb';

const breadcrumb: BreadcrumbDesignTokens = {
    root: {
        padding: '0',
        background: 'transparent',
        gap: '0.5rem',
        transitionDuration: '{transition.duration}'
    },
    item: {
        gap: '{navigation.item.gap}',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '{focus.ring.offset}',
            shadow: '{focus.ring.shadow}'
        }
    },
    colorScheme: {
        light: {
            item: {
                color: '{text.muted.color}',
                hoverColor: '{text.color}',
                borderRadius: '{content.border.radius}',
                icon: {
                    color: '{surface.800}',
                    hoverColor: '{navigation.item.icon.focus.color}'
                },
            },
            separator: {
                color: '{surface.400}'
            },
        },
        dark: {
            item: {
                color: '{primary.200}',
                hoverColor: '{primary.100}',
                icon: {
                    color: '{surface.400}',
                    hoverColor: '{primary.100}'
                }
            },
            separator: {
                color: '{surface.800}'
            }
        }
    }
};

export default breadcrumb;
