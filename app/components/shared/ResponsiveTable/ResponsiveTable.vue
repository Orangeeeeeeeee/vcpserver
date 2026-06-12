<template>
    <div
        class="border border-surface-300 rounded-lg md:rounded-xl overflow-hidden"
    >
        <DataTable
            :value="value"
            :paginator="paginator"
            :rows="rows"
            :rows-per-page-options="rowsPerPageOptions"
            :data-key="rowKey"
            :loading="loading"
            removable-sort
            class="responsive-table"
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
                :pt="{ bodyCell: { 'data-label': col.header } }"
            >
                <template #header>
                    <slot :name="`header-${col.field}`">
                        {{ col.header }}
                    </slot>
                </template>
                <template #body="{ data }">
                    <slot
                        :name="`cell-${col.field}`"
                        :row="data"
                        :value="data[col.field]"
                    >
                        {{ data[col.field] }}
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
}

withDefaults(defineProps<ResponsiveTableProps>(), {
    paginator: false,
    rows: 10,
    rowsPerPageOptions: undefined,
    rowKey: undefined,
    loading: false
});

const emit = defineEmits<{
    /** Emitted when a row is clicked */
    'row-click': [row: TableRow]
}>();

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
@media (max-width: 767px) {
    .responsive-table :deep(.p-datatable-thead) {
        display: none;
    }
    .responsive-table :deep(.p-datatable-table),
    .responsive-table :deep(.p-datatable-tbody) {
        display: block;
        width: 100%;
    }
    /* Row = 2-column grid: shared max-content label track + value track,
       so every data-label is as wide as the longest one. */
    .responsive-table :deep(.p-datatable-tbody > tr) {
        display: grid;
        grid-template-columns: max-content 1fr;
        width: 100%;
        border-bottom: 1px solid var(--p-surface-300);
        padding: 0.75rem 0.875rem;
    }
    .responsive-table :deep(.p-datatable-tbody > tr:last-child) {
        border-bottom: none;
    }
    /* Cells inherit the row tracks via subgrid: ::before lands in the
       label column, the cell content in the value column. */
    .responsive-table :deep(.p-datatable-tbody > tr > td) {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: span 2;
        align-items: center;
        column-gap: 0.75rem;
        padding: 0.75rem 0;
        border: none;
        text-align: left !important;
        border-bottom: 1px solid var(--p-surface-200);
    }

    .responsive-table :deep(.p-datatable-tbody > tr > td:last-child) {
        padding: 1rem 0 0 0;
        border: none;
    }

    .responsive-table :deep(.p-datatable-tbody > tr > td:first-child) {
        padding: 0 0 1rem 0;
    }

    .responsive-table :deep(.p-datatable-tbody > tr > td)::before {
        content: attr(data-label);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--p-surface-700);
    }
}

/* Hover effect for table rows (desktop & mobile stacked view) */
.hover-table :deep(.p-datatable-tbody > tr:hover) {
    background-color: var(--p-surface-200);
    cursor: pointer;
}

.hover-table :deep(.p-datatable-tbody > tr) {
    transition: background-color 0.12s ease-in-out;
}
</style>
