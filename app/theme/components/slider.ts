import type { SliderDesignTokens } from '@primeuix/themes/types/slider';

const slider: SliderDesignTokens = {
    track: {
        background: '{surface.300}',
        borderRadius: '9999px',
        size: '0.5rem'
    },
    range: {
        background: '{primary.300}'
    },
    handle: {
        background: '{primary.300}',
        hoverBackground: '{surface.100}',
        borderRadius: '9999px',
        width: '1.5rem',
        height: '1.5rem',
        content: {
            background: '{primary.100}',
            hoverBackground: '{primary.300}',
            borderRadius: '9999px',
            width: '1.375rem',
            height: '1.375rem',
        },
        focusRing: {
            width: '2px',
            style: 'solid',
            color: '{primary.500}',
            offset: '2px',
            shadow: 'none'
        }
    }
};

export default slider;
