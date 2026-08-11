<template>
    <div class="flex flex-col gap-4">
        <!-- Mobile: collapse toggle for the filter params (post-generation) -->
        <button
            v-if="generated"
            type="button"
            :aria-expanded="filtersExpanded"
            class="md:hidden h-[2.5rem] flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-surface-300 px-4 text-sm text-surface-800 transition duration-300 hover:border-primary-300"
            @click="filtersExpanded = !filtersExpanded"
        >
            <Icon name="tabler:settings" class="size-5 text-surface-700" />
            {{ $t('reports.idle.params') }} ({{ activeFilterCount }})
            <Icon
                name="tabler:chevron-down"
                class="size-4 text-surface-600 transition-transform"
                :class="filtersExpanded ? 'rotate-180' : ''"
            />
        </button>

        <!-- Filter bar -->
        <SharedCollapseTransition>
            <div
                v-show="filtersVisible"
                class="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-[1.2fr_1fr_1.4fr_1fr_1fr_auto] xl:items-center"
            >
                <ReportsPeriodPicker v-model:value="period" />

                <Select
                    v-model="company"
                    :options="companies"
                    show-clear
                    :placeholder="$t('reports.idle.filters.companyPlaceholder')"
                    fluid
                />

                <UiMultiSelect
                    v-model="selectedVehicles"
                    :options="vehicleOptions"
                    option-label="label"
                    option-value="value"
                    filter
                    :placeholder="$t('reports.idle.filters.vehiclePlaceholder')"
                    fluid
                    show-select-all
                >
                    <template #value="{ value, placeholder }">
                        <span v-if="!value?.length">{{ placeholder }}</span>
                        <span
                            v-else
                            :ref="setVehicleChipsRow"
                            class="relative flex min-w-0 items-center gap-1.5"
                        >
                            <Chip
                                v-for="id in visibleVehicleIds"
                                :key="id"
                                class="min-w-0 [&>.p-chip-label]:min-w-0 md:[&>.p-chip-label]:truncate text-xs"
                                :label="vehicleLabelById(id)"
                                removable
                                @remove="removeVehicle(id)"
                            >
                                <template #removeicon="{ removeCallback }">
                                    <Icon
                                        name="tabler:x"
                                        class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                        @click="removeCallback"
                                    />
                                </template>
                            </Chip>
                            <Chip
                                v-if="hiddenVehicleCount > 0"
                                class="shrink-0 text-xs"
                                :label="`+${hiddenVehicleCount}`"
                            />
                            <!-- Invisible copy with natural chip widths, read by the fit algorithm -->
                            <span
                                ref="vehicleChipsMeasure"
                                aria-hidden="true"
                                class="invisible absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <Chip
                                    v-for="id in value"
                                    :key="id"
                                    class="text-xs"
                                    :label="vehicleLabelById(id)"
                                    removable
                                >
                                    <template #removeicon>
                                        <span class="size-4" />
                                    </template>
                                </Chip>
                                <Chip
                                    class="text-xs"
                                    :label="`+${value.length - 1}`"
                                />
                            </span>
                        </span>
                    </template>
                </UiMultiSelect>

                <Select
                    v-model="geoZone"
                    :options="GEO_ZONES"
                    show-clear
                    :placeholder="$t('reports.idle.filters.geoZonePlaceholder')"
                    fluid
                />

                <Select
                    v-model="driverId"
                    :options="driverOptions"
                    option-label="label"
                    option-value="value"
                    filter
                    show-clear
                    :placeholder="$t('reports.idle.filters.driverPlaceholder')"
                    fluid
                />

                <Button
                    size="small"
                    :label="$t('reports.generate')"
                    :disabled="!isPeriodComplete"
                    class="w-full xl:w-auto"
                    @click="onGenerate"
                />
            </div>
        </SharedCollapseTransition>

        <div v-if="!generated" class="w-full lg:w-[60%]">
            <!-- Info banner before generation -->
            <SharedTableEmpty
                icon="tabler:info-circle"
                :message="$t('reports.idle.banner')"
            />
        </div>

        <!-- Generated report table -->
        <template v-else>
            <SharedResponsiveTable
                :value="records"
                :columns="columns"
                paginator
                :rows="9"
                row-key="id"
            >
                <template #cell-vehicle="{ row }">
                    <div class="flex flex-col gap-[0.125rem] leading-none">
                        <span class="font-semibold text-sm text-surface-950">
                            {{ row.vehicle }}
                        </span>
                        <span class="text-sm text-surface-700">
                            ID: {{ row.vehicleId }}
                        </span>
                    </div>
                </template>
                <template #cell-stopAt="{ row }">
                    <div class="flex flex-col gap-[0.125rem] leading-none">
                        <span class="text-sm text-surface-900">
                            {{ row.stopDate }}
                        </span>
                        <span class="text-sm text-surface-700">
                            {{ row.stopTime }}
                        </span>
                    </div>
                </template>
                <template #cell-address="{ row }">
                    <span class="text-sm text-surface-800">
                        {{ row.address }}
                    </span>
                </template>
                <template #cell-resumeAt="{ row }">
                    <div class="flex flex-col gap-[0.125rem] leading-none">
                        <span class="text-sm text-surface-900">
                            {{ row.resumeDate }}
                        </span>
                        <span class="text-sm text-surface-700">
                            {{ row.resumeTime }}
                        </span>
                    </div>
                </template>
                <template #cell-duration="{ row }">
                    <span class="text-sm text-surface-900">
                        {{ row.duration }}
                    </span>
                </template>
            </SharedResponsiveTable>

            <!-- Export stubs -->
            <div class="flex flex-wrap justify-end gap-2">
                <Button
                    v-for="format in EXPORT_FORMATS"
                    :key="format"
                    severity="secondary"
                    @click="onExport"
                >
                    {{ $t(`reports.idle.export.${format}`) }}
                    <Icon name="tabler:download" class="size-5 shrink-0" />
                </Button>
            </div>
        </template>

        <SharedClientTeleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:file-text', to: ROUTES.REPORTS },
                    { label: $t('reports.items.idle.title') }
                ]"
            />
        </SharedClientTeleport>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { TableColumn } from '~/components/shared/ResponsiveTable';
import type { IdleRecord } from '~/types/report';
import { GEO_ZONES, generateIdleRecords } from '~/mocks/reports';
import { ROUTES } from '~/constants/routes';

/** Export button formats (all stubbed until a real API arrives) */
const EXPORT_FORMATS = ['csv', 'xls', 'pdf'] as const;

const { t } = useI18n();
const toast = useToast();
const { vehicles, companies } = useVehicles();
const { drivers } = useDrivers();

const period = ref<Date[] | null>(null);
const company = ref<string | null>(null);
const selectedVehicles = ref<string[]>([]);
const geoZone = ref<string | null>(null);
const driverId = ref<string | null>(null);
const generated = ref<boolean>(false);
const records = ref<IdleRecord[]>([]);
const filtersExpanded = ref<boolean>(true);

const isTablet = useMediaQuery('(min-width: 768px)');

/** Filter bar visibility: always shown on md+, toggleable on mobile once a report is generated */
const filtersVisible = computed<boolean>(
    () => !generated.value || filtersExpanded.value || isTablet.value
);

/** True when both range ends are selected (enables the generate button) */
const isPeriodComplete = computed<boolean>(() =>
    Boolean(period.value?.[0] && period.value?.[1])
);

/** Number of active filters (for the mobile params toggle) */
const activeFilterCount = computed<number>(
    () =>
        [
            isPeriodComplete.value,
            Boolean(company.value),
            selectedVehicles.value.length > 0,
            Boolean(geoZone.value),
            Boolean(driverId.value)
        ].filter(Boolean).length
);

/** Vehicle select options: "MAN TGX 18.480 (ID: TRK-112)" keyed by vehicle id */
const vehicleOptions = computed(() =>
    vehicles.value.map((v) => ({
        value: v.id,
        label: `${v.brand} ${v.model} (ID: ${v.name})`
    }))
);

/** Driver select options sourced from the drivers domain */
const driverOptions = computed(() =>
    drivers.value.map((d) => ({ value: d.id, label: d.name }))
);

/** Gap between chips in the select value row (Tailwind gap-1.5) */
const CHIP_GAP_PX = 6;

const vehicleChipsRow = ref<HTMLElement | null>(null);
const vehicleChipsMeasure = ref<HTMLElement | null>(null);

/** Number of selected-vehicle chips currently fitting the select width */
const visibleVehicleCount = ref<number>(1);

/** Ids of the selected vehicles rendered as chips */
const visibleVehicleIds = computed<string[]>(() =>
    selectedVehicles.value.slice(0, visibleVehicleCount.value)
);

/** Number of selected vehicles collapsed into the «+N» badge */
const hiddenVehicleCount = computed<number>(() =>
    Math.max(0, selectedVehicles.value.length - visibleVehicleCount.value)
);

/**
 * Resolves the chip label of a selected vehicle.
 *
 * @param id - Vehicle id from the selection
 * @returns The option label, or an empty string for an unknown id
 */
const vehicleLabelById = (id: string): string =>
    vehicleOptions.value.find((o) => o.value === id)?.label ?? '';

/**
 * Removes a vehicle from the selection (the chip's × button).
 *
 * @param id - Vehicle id to deselect
 */
const removeVehicle = (id: string): void => {
    selectedVehicles.value = selectedVehicles.value.filter((v) => v !== id);
};

/**
 * Recomputes how many vehicle chips fit into the select value row. Walks the
 * invisible measuring copy left to right, reserving space for the «+N» badge
 * while at least one chip stays hidden; the first chip is always kept (it
 * truncates when even a single chip does not fit).
 */
const recomputeVisibleVehicleCount = (): void => {
    const row = vehicleChipsRow.value;
    const measure = vehicleChipsMeasure.value;
    if (!row || !measure) return;
    const items = Array.from(measure.children) as HTMLElement[];
    const badge = items.pop();
    if (!badge || items.length === 0) return;
    const available = row.clientWidth;
    let used = 0;
    let count = 0;
    for (const [index, chip] of items.entries()) {
        const chipWidth = chip.offsetWidth + (index > 0 ? CHIP_GAP_PX : 0);
        const hasHiddenAfter = index < items.length - 1;
        const badgeWidth = hasHiddenAfter ? CHIP_GAP_PX + badge.offsetWidth : 0;
        if (used + chipWidth + badgeWidth > available) break;
        used += chipWidth;
        count = index + 1;
    }
    visibleVehicleCount.value = Math.max(1, count);
};

/** Observer keeping the chip fit in sync with the select width */
let chipsRowObserver: ResizeObserver | null = null;

/**
 * Function template ref of the chips row: (re)binds the resize observer when
 * the row mounts and releases it when the row unmounts (empty selection).
 * A function ref is used deliberately — watching a template ref does not
 * fire for elements inside a child component's scoped slot.
 *
 * @param el - The mounted row element, or null on unmount
 */
/** Row element currently watched by the resize observer */
let observedChipsRow: HTMLElement | null = null;

const setVehicleChipsRow = (el: unknown): void => {
    const row = el instanceof HTMLElement ? el : null;
    vehicleChipsRow.value = row;
    // Function refs run on every re-render; re-observing the same element
    // would keep dropping the observer's pending size records, so bail out.
    if (row === observedChipsRow) return;
    chipsRowObserver?.disconnect();
    observedChipsRow = row;
    if (!row) return;
    chipsRowObserver ??= new ResizeObserver(recomputeVisibleVehicleCount);
    chipsRowObserver.observe(row);
};

watch(selectedVehicles, recomputeVisibleVehicleCount, { flush: 'post' });

onBeforeUnmount(() => {
    chipsRowObserver?.disconnect();
});

const columns = computed<TableColumn[]>(() => [
    {
        field: 'vehicle',
        header: t('reports.idle.columns.vehicle'),
        sortable: true
    },
    { field: 'stopAt', header: t('reports.idle.columns.stopAt') },
    { field: 'address', header: t('reports.idle.columns.address') },
    { field: 'resumeAt', header: t('reports.idle.columns.resumeAt') },
    { field: 'duration', header: t('reports.idle.columns.duration') }
]);

/** Builds the report snapshot (filters are generate-on-click, not live) */
const onGenerate = (): void => {
    records.value = generateIdleRecords();
    generated.value = true;
    if (!isTablet.value) {
        filtersExpanded.value = false;
    }
};

/** Export buttons are stubs until a real API arrives */
const onExport = (): void => {
    toast.add({
        severity: 'info',
        summary: t('common.inDevelopment'),
        life: 2000
    });
};
</script>
