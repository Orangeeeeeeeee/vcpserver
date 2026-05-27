import type { TabsDesignTokens } from '@primeuix/themes/types/tabs';

const tabs: TabsDesignTokens = {
    tablist: {
        borderWidth: '0',
        background: 'transparent'
    },
    tab: {
        background: 'transparent',
        hoverBackground: 'transparent',
        activeBackground: 'transparent',
        borderWidth: '0 0 4px 0',
        borderColor: 'transparent',
        hoverBorderColor: '{primary.600}',
        activeBorderColor: '{primary.600}',
        color: '{surface.800}',
        hoverColor: '{primary.600}',
        activeColor: '{primary.600}',
        padding: '0.7rem 1rem',
        fontWeight: '400',
        margin: '0 0 -1px 0',
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
        background: 'transparent',
        color: '{surface.500}',
        hoverColor: '{surface.700}',
        width: '2.5rem',
        shadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'
    },
    activeBar: {
        height: '4px',
        bottom: '-1px',
        background: '{primary.600}'
    }
};

export default tabs;
