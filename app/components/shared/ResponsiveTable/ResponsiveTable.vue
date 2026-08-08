<template>
    <div
        class="border border-surface-300 rounded-lg md:rounded-xl overflow-hidden"
        :class="{ 'hover-table': hoverable }"
    >
        <DataTable
            :value="value"
            :paginator="showPaginator"
            :rows="rows"
            :rows-per-page-options="rowsPerPageOptions"
            :data-key="rowKey"
            :loading="loading"
            removable-sort
            class="responsive-table"
            :pt="{ footerRow: { class: 'bg-primary-100' } }"
            @row-click="onRowClick"
        >
            <Column
                v-for="col in columns"
                :key="col.field"
                :field="col.field"
                :sortable="col.sortable"
                :style="col.width ? { width: col.width } : undefined"
                :body-style="col.align ? { textAlign: col.align } : undefined"
                :header-style="col.align ? { textAlign: col.align } : undefined"
                :pt="{
                    sort: { class: 'leading-none' },
                    bodyCell: ({ parent }) => ({
                        'data-label': col.header,
                        class: [!col.header ? 'label-empty' : ''],
                        onMouseenter: () =>
                            onCellMouseEnter(parent.props.rowIndex, col.field),
                        onMouseleave: onCellMouseLeave
                    }),
                    footerCell: {
                        'data-label': col.header,
                        class: [
                            'bg-primary-100 text-sm',
                            isFooterCellEmpty(col.field)
                                ? 'empty-footer-cell'
                                : ''
                        ]
                    }
                }"
            >
                <template #header>
                    <slot :name="`header-${col.field}`">
                        <span class="leading-none">
                            {{ col.header }}
                        </span>
                    </slot>
                </template>
                <template #body="{ data, index }">
                    <slot
                        :name="`cell-${col.field}`"
                        :row="data"
                        :value="data[col.field]"
                        :hovered="isCellHovered(index, col.field)"
                        :row-hovered="hoveredCell?.rowIndex === index"
                        :hovered-cell="hoveredCell"
                    >
                        {{ data[col.field] }}
                    </slot>
                </template>
                <template v-if="footerRow" #footer>
                    <slot
                        :name="`footer-${col.field}`"
                        :row="footerRow"
                        :value="footerRow[col.field]"
                    >
                        {{ footerRow[col.field] }}
                    </slot>
                </template>
            </Column>

            <template
                #paginatorcontainer="{ page, pageCount, changePageCallback }"
            >
                <UiPagination
                    :page="page"
                    :page-count="pageCount"
                    @update:page="changePageCallback"
                />
            </template>
        </DataTable>
    </div>
</template>

<script lang="ts">
export interface HoveredCell {
    /** Row index within the currently displayed (sorted/paginated) data */
    rowIndex: number;
    /** Column field of the hovered cell */
    field: string;
}

export interface TableColumn {
    /** Data property key */
    field: string;
    /** Column header label */
    header: string;
    /** Enables sort on this column */
    sortable?: boolean;
    /** Optional fixed column width (desktop) */
    width?: string;
    /** Cell text alignment */
    align?: 'left' | 'right' | 'center';
}
</script>

<script setup lang="ts">
type TableRow = Record<string, unknown>;

interface ResponsiveTableProps {
    /** Row data */
    value: TableRow[];
    /** Column configuration */
    columns: TableColumn[];
    /** Enable pagination */
    paginator?: boolean;
    /** Rows per page (default 10) */
    rows?: number;
    /** Options for the rows-per-page dropdown */
    rowsPerPageOptions?: number[];
    /** Field used as Vue key for each row */
    rowKey?: string;
    /** Loading state */
    loading?: boolean;
    /** Optional aggregated row rendered as a highlighted tfoot row */
    footerRow?: TableRow;
    /** Highlights rows on hover and shows a pointer cursor (for clickable rows) */
    hoverable?: boolean;
}

const { footerRow, paginator, value, rows } = withDefaults(
    defineProps<ResponsiveTableProps>(),
    {
        paginator: false,
        rows: 10,
        rowsPerPageOptions: undefined,
        rowKey: undefined,
        loading: false,
        footerRow: undefined,
        hoverable: false
    }
);

/** Paginator is rendered only when the data spans more than one page. */
const showPaginator = computed<boolean>(() => paginator && value.length > rows);

const emit = defineEmits<{
    /** Emitted when a row is clicked */
    'row-click': [row: TableRow];
}>();

/**
 * Checks whether the footer row has no value for the given column field,
 * so the cell can be hidden in the mobile stacked layout.
 * @param field - Column field key
 * @returns {boolean} True when the footer cell is empty
 */
const isFooterCellEmpty = (field: string): boolean => {
    const value = footerRow?.[field];
    return value === undefined || value === null || value === '';
};

/** Currently hovered body cell, or null when no cell is hovered */
const hoveredCell = ref<HoveredCell | null>(null);

/**
 * Stores the hovered cell so every `cell-*` slot can react to it.
 * @param rowIndex - Row index of the hovered cell
 * @param field - Column field of the hovered cell
 */
const onCellMouseEnter = (rowIndex: number, field: string): void => {
    hoveredCell.value = { rowIndex, field };
};

/** Clears the hovered cell state */
const onCellMouseLeave = (): void => {
    hoveredCell.value = null;
};

/**
 * Checks whether the given cell is the currently hovered one.
 * @param rowIndex - Row index of the cell
 * @param field - Column field of the cell
 * @returns {boolean} True when this exact cell is hovered
 */
const isCellHovered = (rowIndex: number, field: string): boolean =>
    hoveredCell.value?.rowIndex === rowIndex &&
    hoveredCell.value?.field === field;

/**
 * Handle row click event and emit custom event
 */
const onRowClick = (event: { data: TableRow }): void => {
    emit('row-click', event.data);
};
</script>

<style scoped>
/* Below md: transform the DataTable DOM into stacked label/value cards.
   No second DOM tree — single <DataTable> serves both layouts. */
@media (max-width: 768px) {
    .responsive-table :deep(.p-datatable-thead) {
        display: none;
    }
    .responsive-table :deep(.p-datatable-table),
    .responsive-table :deep(.p-datatable-tbody),
    .responsive-table :deep(.p-datatable-tfoot) {
        display: block;
        width: 100%;
    }
    /* Row = 2-column grid: shared max-content label track + value track,
       so every data-label is as wide as the longest one. */
    .responsive-table :deep(.p-datatable-tfoot > tr),
    .responsive-table :deep(.p-datatable-tbody > tr) {
        display: grid;
        grid-template-columns: max-content minmax(0, 1fr);
        width: 100%;
        border-bottom: 1px solid var(--p-surface-300);
        padding: 0.75rem 0.875rem;
    }
    .responsive-table :deep(.p-datatable-tfoot > tr) {
        padding: 0 0.875rem;
    }
    .responsive-table :deep(.p-datatable-tfoot > tr:last-child),
    .responsive-table :deep(.p-datatable-tbody > tr:last-child),
    .responsive-table :deep(.p-datatable-tfoot > tr > td:last-child) {
        border-bottom: none;
    }
    /* Cells inherit the row tracks via subgrid: ::before lands in the
       label column, the cell content in the value column. */
    .responsive-table :deep(.p-datatable-tbody > tr > td),
    .responsive-table :deep(.p-datatable-tfoot > tr > td) {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: span 2;
        align-items: center;
        column-gap: 2rem;
        padding: 0.75rem 0;
        border: none;
        text-align: left !important;
        border-bottom: 1px solid var(--p-surface-200);
    }

    .hover-table :deep(.p-datatable-tbody > tr:hover > td) {
        border-bottom: 1px solid var(--p-surface-300);
    }

    .responsive-table :deep(.p-datatable-tbody > tr > td).label-empty {
        display: block;
    }

    .responsive-table :deep(.p-datatable-tfoot > tr > td) {
        border-bottom: 1px solid #469bc31a;
    }

    .responsive-table :deep(.p-datatable-tfoot > tr > td:last-child) {
        border-color: var(--p-surface-400);
    }

    .responsive-table :deep(.p-datatable-tbody > tr > td:last-child) {
        padding: 1rem 0 0 0;
        border: none;
    }

    .responsive-table :deep(.p-datatable-tbody > tr > td:first-child) {
        padding: 0 0 1rem 0;
    }

    .responsive-table :deep(.p-datatable-tfoot > tr > td)::before,
    .responsive-table :deep(.p-datatable-tbody > tr > td)::before {
        content: attr(data-label);
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--p-surface-700);
    }

    .responsive-table :deep(.p-datatable-tfoot > tr > td.empty-footer-cell) {
        display: none;
    }
}

/* Hover effect for table rows (desktop & mobile stacked view) */
.hover-table :deep(.p-datatable-tbody > tr:hover) {
    background-color: var(--p-surface-200);
}

.hover-table :deep(.p-datatable-tbody > tr) {
    transition: background-color 0.12s ease-in-out;
}

.hover-table :deep(.p-datatable-tbody > tr > td) {
    transition: border-color 0.12s ease-in-out;
}
</style>
