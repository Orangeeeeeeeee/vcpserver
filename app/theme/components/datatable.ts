import type { DataTableDesignTokens } from '@primeuix/themes/types/datatable';

const datatable: DataTableDesignTokens = {
    root: {
        transitionDuration: '{transition.duration}'
    },
    header: {
        background: '{surface.300}',
        borderColor: '{datatable.border.color}',
        color: '{content.color}',
        borderWidth: '0 0 1px 0',
        padding: '0.75rem 1rem',
        sm: { padding: '0.375rem 0.5rem' },
        lg: { padding: '1rem 1.25rem' }
    },
    headerCell: {
        background: '{surface.200}',
        hoverBackground: '{surface.200}',
        selectedBackground: '{surface.200}',
        borderColor: '{surface.300}',
        color: '{surface.700}',
        hoverColor: '{surface.700}',
        selectedColor: '{surface.700}',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        sm: { padding: '0.75rem' },
        lg: { padding: '1.25rem' }
    },
    columnTitle: {
        fontWeight: '500'
    },
    row: {
        background: '{surface-100}',
        hoverBackground: '{content.hover.background}',
        selectedBackground: '{highlight.background}',
        color: '{surface.800}',
        hoverColor: '{content.hover.color}',
        selectedColor: '{highlight.color}'
    },
    bodyCell: {
        borderColor: '{surface.200}',
        padding: '1.375rem 1rem',
        sm: { padding: '1rem' },
        lg: { padding: '1.25rem' }
    },
    footerCell: {
        background: '{surface.200}',
        borderColor: '{surface.300}',
        color: '{surface.700}',
        padding: '1.375rem 1rem',
        sm: { padding: '1rem' },
        lg: { padding: '1.25rem' }
    },
    columnFooter: {
        fontWeight: '500'
    },
    footer: {
        background: '{content.background}',
        borderColor: '{datatable.border.color}',
        color: '{content.color}',
        borderWidth: '0 0 1px 0',
        padding: '0.75rem 1rem',
        sm: { padding: '0.375rem 0.5rem' },
        lg: { padding: '1rem 1.25rem' }
    },
    dropPoint: {
        color: '{primary.color}'
    },
    columnResizer: {
        width: '0.5rem'
    },
    resizeIndicator: {
        width: '1px',
        color: '{primary.color}'
    },
    sortIcon: {
        color: '{text.muted.color}',
        hoverColor: '{text.hover.muted.color}',
        size: '0.875rem'
    },
    loadingIcon: {
        size: '2rem'
    },
    rowToggleButton: {
        hoverBackground: '{content.hover.background}',
        selectedHoverBackground: '{content.background}',
        color: '{text.muted.color}',
        hoverColor: '{text.color}',
        selectedHoverColor: '{primary.color}',
        size: '1.75rem',
        borderRadius: '50%',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '{focus.ring.offset}',
            shadow: '{focus.ring.shadow}'
        }
    },
    filter: {
        inlineGap: '0.5rem',
        overlaySelect: {
            background: '{overlay.select.background}',
            borderColor: '{overlay.select.border.color}',
            borderRadius: '{overlay.select.border.radius}',
            color: '{overlay.select.color}',
            shadow: '{overlay.select.shadow}'
        },
        overlayPopover: {
            background: '{overlay.popover.background}',
            borderColor: '{overlay.popover.border.color}',
            borderRadius: '{overlay.popover.border.radius}',
            color: '{overlay.popover.color}',
            shadow: '{overlay.popover.shadow}',
            padding: '{overlay.popover.padding}',
            gap: '0.5rem'
        },
        rule: {
            borderColor: '{content.border.color}'
        },
        constraintList: {
            padding: '{list.padding}',
            gap: '{list.gap}'
        },
        constraint: {
            focusBackground: '{list.option.focus.background}',
            selectedBackground: '{list.option.selected.background}',
            selectedFocusBackground: '{list.option.selected.focus.background}',
            color: '{list.option.color}',
            focusColor: '{list.option.focus.color}',
            selectedColor: '{list.option.selected.color}',
            selectedFocusColor: '{list.option.selected.focus.color}',
            separator: {
                borderColor: '{content.border.color}'
            },
            padding: '{list.option.padding}',
            borderRadius: '{list.option.border.radius}'
        }
    },
    paginatorTop: {
        borderColor: '{surface.300}',
        borderWidth: '0 0 1px 0'
    },
    paginatorBottom: {
        borderColor: '{surface.300}',
        borderWidth: '0 1px 1px 1px'
    },
    colorScheme: {
        light: {
            root: { borderColor: '{content.border.color}' },
            row: { stripedBackground: '{surface.50}' },
            bodyCell: { selectedBorderColor: '{primary.100}' }
        },
        dark: {
            root: { borderColor: '{surface.800}' },
            row: { stripedBackground: '{surface.950}' },
            bodyCell: { selectedBorderColor: '{primary.900}' }
        }
    },
    css: `
        .p-datatable-table-container {
            border-radius: 4px;
            border-style: solid;
            border-color: var(--p-surface-300);
            border-width: 1px;
        }

        .p-datatable-tbody > tr > td {
            font-size: 0.875rem;
        }

        .p-datatable-paginator-bottom {
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            overflow: hidden;
        }
    `
};

export default datatable;
