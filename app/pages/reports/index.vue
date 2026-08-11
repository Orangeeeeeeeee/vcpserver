<template>
    <div class="flex flex-col gap-4">
        <UiTabNav v-model:value="activeTab" :items="tabItems" size="sm" />

        <div
            class="flex flex-col gap-3 md:grid md:grid-cols-[auto_28%_minmax(0,1fr)_auto_auto] md:gap-y-2 md:gap-x-8 lg:grid-cols-[auto_29%_minmax(0,1fr)_auto_auto]"
        >
            <ReportsCatalogCard
                v-for="report in pageItems"
                :key="report.id"
                :report="report"
                @generate="onGenerate(report)"
            />
        </div>

        <UiPagination
            v-if="pageCount > 1"
            v-model:page="page"
            :page-count="pageCount"
        />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { ReportCatalogTab, ReportDefinition } from '~/types/report';
import type { TabItem } from '~/components/ui/TabNav/TabNav.vue';
import { REPORT_DEFINITIONS } from '~/constants/reports';

const PAGE_SIZE = 9;

const { t } = useI18n();
const toast = useToast();

const activeTab = ref<ReportCatalogTab>('all');
const page = ref<number>(0);

/** Catalog category tabs (local filter, not routes) */
const tabItems = computed<TabItem[]>(() => [
    { value: 'all', label: t('reports.tabs.all') },
    { value: 'activity', label: t('reports.tabs.activity') },
    { value: 'routes', label: t('reports.tabs.routes') },
    { value: 'drivers', label: t('reports.tabs.drivers') },
    { value: 'fuel', label: t('reports.tabs.fuel') }
]);

/** Reports narrowed by the active category tab */
const filtered = computed<ReportDefinition[]>(() =>
    activeTab.value === 'all'
        ? REPORT_DEFINITIONS
        : REPORT_DEFINITIONS.filter((r) => r.category === activeTab.value)
);

/** Total number of pages for the current tab */
const pageCount = computed<number>(() =>
    Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE))
);

/** Slice of filtered reports for the current page */
const pageItems = computed<ReportDefinition[]>(() =>
    filtered.value.slice(page.value * PAGE_SIZE, (page.value + 1) * PAGE_SIZE)
);

/** Reset pagination whenever the category tab changes */
watch(activeTab, () => {
    page.value = 0;
});

/** Navigates to the report page when implemented, toasts otherwise */
const onGenerate = async (report: ReportDefinition): Promise<void> => {
    if (report.to) {
        await navigateTo(report.to);
        return;
    }
    toast.add({
        severity: 'info',
        summary: t('common.inDevelopment'),
        life: 2000
    });
};
</script>
