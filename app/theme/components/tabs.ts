import type { TabsDesignTokens } from '@primeuix/themes/types/tabs';

const tabs: TabsDesignTokens = {
    tablist: {
        borderWidth: '0 0 0 0',
        background: 'transparent',
        borderColor: 'transparent'
    },
    tab: {
        background: 'transparent',
        hoverBackground: 'transparent',
        activeBackground: 'transparent',
        borderWidth: '0 0 2px 0',
        borderColor: 'transparent',
        hoverBorderColor: '{primary.600}',
        activeBorderColor: '{primary.600}',
        color: '{surface.800}',
        hoverColor: '{primary.600}',
        activeColor: '{primary.600}',
        padding: '0.6rem 0.5rem',
        fontWeight: '400',
        margin: '0',
        gap: '5rem',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '{focus.ring.offset}',
            shadow: '{focus.ring.shadow}'
        }
    },
    tabpanel: {
        background: 'transparent',
        color: '{text.color}',
        padding: '10rem 0',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '{focus.ring.offset}',
            shadow: '{focus.ring.shadow}'
        }
    },
    navButton: {
        background: '{surface.100}',
        color: '{surface.500}',
        hoverColor: '{surface.700}',
        width: '2.5rem',
        shadow: 'none'
    },
    activeBar: {
        height: '2px',
        bottom: '0',
        background: '{primary.600}'
    },
    css: `
        .p-tablist {
            border-bottom: 1px solid var(--p-surface-300);
        }

        .p-tablist-nav-button {
            width: 1px;
            overflow: hidden;
            color: transparent;
            box-shadow: 0px 0px 10px 23px color-mix(in srgb, var(--p-surface-100) 80%, transparent);
        }

        .p-tablist-tab-list {
            gap: 1rem;
        }

        .p-tablist-tab-list .p-tab {
            position: relative;
            line-height: 1;
        }

        .p-tablist-tab-list .p-tab:before {
            position: absolute;
            content: '';
            width: 1px;
            height: 19px;
            background: var(--p-surface-300);
            top: 0.7rem;
            left: -0.5rem;
        }

        .p-tablist-tab-list .p-tab:first-child:before {
            display: none;
        }

        .p-tab-active {
            font-weight: 500;
        }
    `
};

export default tabs;
