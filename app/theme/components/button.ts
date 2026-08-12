import type { ButtonDesignTokens } from '@primeuix/themes/types/button';

const button: ButtonDesignTokens = {
    root: {
        borderRadius: '6px',
        paddingX: '1rem',
        paddingY: '0.813rem',
        label: {
            fontWeight: '500'
        },
        sm: {
            fontSize: '0.875rem',
            paddingX: '1rem',
            paddingY: '0.75rem'
        },
        lg: {
            fontSize: '1.25rem',
            paddingX: '1.25rem',
            paddingY: '0.832rem'
        }
    },
    colorScheme: {
        light: {
            text: {
                secondary: {
                    hoverBackground: '{surface.100}',
                    activeBackground: '{surface.100}',
                    color: '{surface.900}'
                }
            },
            root: {
                primary: {
                    borderColor: '{primary.900}',
                    background: '{primary.900}',
                    color: '{surface.50}',
                    hoverBackground: '{surface.100}',
                    hoverBorderColor: '{surface.300}',
                    activeBackground: '{surface.100}',
                    activeBorderColor: '{surface.300}',
                    hoverColor: '{surface.800}',
                    activeColor: '{surface.800}'
                },
                secondary: {
                    borderColor: '{surface.300}',
                    background: '{surface.100}',
                    color: '{surface.800}',
                    hoverBackground: '{primary.900}',
                    hoverBorderColor: '{primary.900}',
                    activeBackground: '{primary.900}',
                    activeBorderColor: '{primary.900}',
                    hoverColor: '{surface.50}',
                    activeColor: '{surface.50}'
                },
                danger: {
                    borderColor: '{red.600}',
                    background: '{red.600}',
                    color: '{surface.50}',
                    hoverBackground: '{red.700}',
                    hoverBorderColor: '{red.700}',
                    activeBackground: '{red.700}',
                    activeBorderColor: '{red.700}',
                    hoverColor: '{surface.50}',
                    activeColor: '{surface.50}'
                }
            }
        }
    },
    css: `
          .p-button {
              box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
              line-height: 1;
              max-height: 2.75rem;
          }

          .p-button-sm {
              max-height: 2.5rem;
          }

          .p-button-lg {
              max-height: 3rem;
          }

          .p-button-text {
              box-shadow: none;
          }

          .p-button svg {
              width: 1.25rem;
              height: 1.25rem;
          }

          .p-button-sm svg {
              width: 0.875rem;
              height: 0.875rem;
          }

          .p-button-lg svg {
              width: 1.5rem;
              height: 1.5rem;
          }
      `
};

export default button;
