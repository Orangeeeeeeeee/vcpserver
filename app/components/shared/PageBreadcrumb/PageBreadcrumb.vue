<template>
    <Breadcrumb v-if="items?.length" :model="items" class="min-w-0">
        <template #item="{ item }">
            <NuxtLink
                v-if="item.to"
                :to="item.to"
                class="flex items-center gap-1.5 text-sm text-surface-700 dark:text-surface-400 dark:hover:text-primary-200 hover:text-primary-600 transition-colors min-w-0"
            >
                <Icon
                    v-if="item.icon"
                    :name="item.icon"
                    class="size-[1.125rem] shrink-0"
                />
                <span v-if="item.label" :title="item.label" class="md:truncate">
                    {{ item.label }}
                </span>
            </NuxtLink>
            <span
                v-else
                class="flex items-center gap-1.5 text-sm text-primary-600 min-w-0 dark:text-primary-200"
            >
                <Icon
                    v-if="item.icon"
                    :name="item.icon"
                    class="size-[1.125rem] shrink-0"
                />
                <span v-if="item.label" :title="item.label" class="md:truncate">
                    {{ item.label }}
                </span>
            </span>
        </template>
        <template #separator>
            <span class="dark:text-surface-800">/</span>
        </template>
    </Breadcrumb>
</template>

<script lang="ts">
export interface PageBreadcrumbItem {
    /** Item label text */
    label?: string;
    /** Iconify icon name (e.g. 'tabler:bus') */
    icon?: string;
    /** Target route; omit for the current (non-clickable) item */
    to?: string;
}
</script>

<script setup lang="ts">
interface PageBreadcrumbProps {
    /** Breadcrumb items rendered left-to-right */
    items: PageBreadcrumbItem[];
}

defineProps<PageBreadcrumbProps>();
</script>

<style scoped>
/* Keep the breadcrumb on one line: only the current (last) crumb shrinks and
   truncates with an ellipsis; preceding crumbs and separators stay intact. */
:deep(.p-breadcrumb-item:last-child) {
    min-width: 0;
}

:deep(.p-breadcrumb-item:not(:last-child)),
:deep(.p-breadcrumb-separator) {
    flex-shrink: 0;
}
</style>
