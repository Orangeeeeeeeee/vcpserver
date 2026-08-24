import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { primary, surface, primitiveColors } from './colors';
import components from './components';

const VcpPreset = definePreset(Aura, {
    primitive: primitiveColors,
    semantic: {
        formField: {
            paddingX: '0.65rem',
            paddingY: '0.54rem',
            sm: {
                fontSize: '0.75rem',
                paddingX: '0.45rem',
                paddingY: '0.45rem'
            },
            lg: {
                fontSize: '1.25rem',
                paddingX: '0.9rem',
                paddingY: '0.9rem'
            },
            borderRadius: '6px',
        },
        text: {
            color: '{surface.600}',
            mutedColor: '{surface.400}'
        },
        primary,
        colorScheme: {
            light: {
                surface,
                primary: {
                    color: primary[300],
                    contrastColor: surface[50],
                    hoverColor: primary[400],
                    activeColor: primary[500]
                },
                formField: {
                    background: '{surface.100}',
                    disabledBackground: '{surface.100}',
                    borderColor: '{surface.300}',
                    hoverBorderColor: '{primary.300}',
                    focusBorderColor: '{primary.300}',
                    invalidBorderColor: '{red.200}',
                    color: '{surface.900}',
                    disabledColor: '{surface.400}',
                    placeholderColor: '{surface.500}',
                    invalidPlaceholderColor: '{surface.900}',
                    floatLabelColor: '{surface.900}',
                    floatLabelFocusColor: '{surface.900}',
                    floatLabelActiveColor: '{surface.900}',
                    floatLabelInvalidColor: '{surface.900}',
                    iconColor: '{surface.500}',
                    shadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)'
                }
            },
            dark: {
                surface,
                primary: {
                    color: surface[200],
                    contrastColor: primary[900],
                    hoverColor: primary[100],
                    activeColor: primary[50]
                },
                formField: {
                    background: '{surface.950}',
                    disabledBackground: '{surface.950}',
                    borderColor: '{surface.800}',
                    hoverBorderColor: '{primary.700}',
                    focusBorderColor: '{primary.700}',
                    invalidBorderColor: '{red.200}',
                    color: '{surface.200}',
                    disabledColor: '{surface.800}',
                    placeholderColor: '{surface.600}',
                    invalidPlaceholderColor: '{surface.700}',
                    floatLabelColor: '{surface.200}',
                    floatLabelFocusColor: '{surface.200}',
                    floatLabelActiveColor: '{surface.200}',
                    floatLabelInvalidColor: '{red.200}',
                    iconColor: '{surface.600}',
                    shadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)'
                }
            }
        }
    },
    components
});

export default VcpPreset;
