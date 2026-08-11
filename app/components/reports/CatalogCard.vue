<template>
    <div
        class="report-card grid items-center gap-x-4 gap-y-1.5 border border-surface-300 rounded-md bg-surface-100 p-3 md:col-span-5 md:gap-x-8 hover:bg-surface-200 lg:transition lg:duration-300"
    >
        <span
            class="[grid-area:tile] inline-flex size-8 md:size-10 lg:h-[2.875rem] lg:w-[2.875rem] shrink-0 items-center justify-center rounded-lg"
            :style="{ backgroundColor: meta.bg, color: meta.iconColor }"
        >
            <Icon :name="report.icon" class="size-5" />
        </span>

        <h3
            class="[grid-area:title] font-medium text-sm text-surface-950 min-w-0 mb-1 md:mb-0 lg:text-base"
        >
            {{ $t(`reports.items.${report.id}.title`) }}
        </h3>

        <p
            class="[grid-area:desc] text-xs lg:text-sm text-surface-800 mb-2 md:mb-0 min-w-0 md:line-clamp-2 lg:line-clamp-none"
        >
            {{ $t(`reports.items.${report.id}.description`) }}
        </p>

        <div class="[grid-area:pill]">
            <div class="flex">
                <span
                    class="ml-auto md:ml-0 md:mr-auto inline-flex w-fit items-center rounded px-2 py-0.5 text-xs font-medium"
                    :style="{ backgroundColor: meta.bg, color: meta.textColor }"
                >
                    {{ $t(`reports.categories.${report.category}`) }}
                </span>
            </div>
        </div>

        <div class="[grid-area:btn]">
            <Button
                size="small"
                severity="secondary"
                class=" w-full md:ml-auto md:w-[2.25rem] md:h-[2.25rem] lg:w-auto lg:h-auto"
                :aria-label="$t('reports.generate')"
                @click="emit('generate')"
            >
                <span class="md:hidden lg:block">{{ $t('reports.generate') }}</span>
                <Icon name="tabler:arrow-right" class="size-5 shrink-0" />
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ReportDefinition } from '~/types/report';
import { CATEGORY_META, type ReportCategoryMeta } from '~/constants/reports';

interface CatalogCardProps {
    report: ReportDefinition;
}

const props = defineProps<CatalogCardProps>();

const emit = defineEmits<{
    generate: [];
}>();

/** Category colors for the tile and pill */
const meta = computed<ReportCategoryMeta>(
    () => CATEGORY_META[props.report.category]
);
</script>

<style scoped>
/* Mobile: stacked card; md+: single row on the parent list's subgrid,
   so the pill/button columns share one content-sized width across cards. */
.report-card {
    grid-template-areas:
        'tile pill'
        'title title'
        'desc desc'
        'btn btn';
    grid-template-columns: auto 1fr;
}

@media (min-width: 768px) {
    .report-card {
        grid-template-areas: 'tile title desc pill btn';
        grid-template-columns: subgrid;
    }
}
</style>
