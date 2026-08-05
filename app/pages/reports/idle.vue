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
        <div
            class="grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-[1.2fr_1fr_1.4fr_1fr_1fr_auto] xl:items-center"
            :class="generated && !filtersExpanded ? 'hidden md:grid' : 'grid'"
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
            >
                <template #value="{ value, placeholder }">
                    <span v-if="!value?.length">{{ placeholder }}</span>
                    <span v-else class="flex min-w-0 items-center gap-1.5">
                        <span
                            class="inline-flex min-w-0 max-w-36 items-center gap-1 rounded bg-surface-200 text-sm"
                        >
                            <span class="truncate">
                                {{ firstVehicleLabel }}
                            </span>
                            <button
                                type="button"
                                class="inline-flex shrink-0 cursor-pointer"
                                :aria-label="$t('common.delete')"
                                @click.stop="removeFirstVehicle"
                            >
                                <Icon
                                    name="tabler:x"
                                    class="size-4 text-surface-700 transition-colors hover:text-surface-900"
                                />
                            </button>
                        </span>
                        <span
                            v-if="value.length > 1"
                            class="shrink-0 rounded bg-surface-200 px-1.5 py-0.5 text-sm"
                        >
                            +{{ value.length - 1 }}
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
                    <Icon
                        name="tabler:download"
                        class="size-5 shrink-0"
                    />
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

/** Label of the first selected vehicle (shown as a chip in the select) */
const firstVehicleLabel = computed<string>(
    () =>
        vehicleOptions.value.find((o) => o.value === selectedVehicles.value[0])
            ?.label ?? ''
);

/** Removes the first selected vehicle (the chip's × button) */
const removeFirstVehicle = (): void => {
    selectedVehicles.value = selectedVehicles.value.slice(1);
};

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
