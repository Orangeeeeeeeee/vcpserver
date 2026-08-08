<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        :style="{ maxWidth: '64rem', width: '100%' }"
    >
        <template #header>
            <div class="flex w-full lg:items-center justify-center gap-2">
                <Icon
                    name="tabler:route"
                    class="size-7 lg:size-6 shrink-0 text-surface-800 mt-1"
                />
                <UiTypography variant="h3">{{ routePath }}</UiTypography>
            </div>
        </template>

        <SharedResponsiveTable
            :value="rows"
            :columns="columns"
            paginator
            :rows="6"
            row-key="id"
            hoverable
        >
            <template #cell-resources="{ row }">
                <div class="flex flex-col gap-1 text-surface-900">
                    <span class="flex gap-1.5 max-w-11/12">
                        <Icon
                            name="tabler:truck"
                            class="size-5 shrink-0 text-surface-600"
                        />
                        <span class="text-surface-800 truncate">{{ row.vehicleLabel }}</span>
                    </span>
                    <span class="flex gap-1.5">
                        <Icon
                            name="tabler:user"
                            class="size-5 shrink-0 text-surface-600"
                        />
                        <span class="text-surface-700 max-w-11/12 truncate">{{ row.driverLabel }}</span>
                    </span>
                </div>
            </template>

            <template #cell-status="{ row }">
                <div><UiColorChip :label="row.statusLabel" :color="row.statusColor" /></div>
            </template>

            <template #cell-start="{ row }">
                <div class="flex flex-col gap-[0.125rem] leading-snug text-sm">
                    <span class="text-surface-800 font-medium whitespace-nowrap">{{ row.startDateLabel }}</span>
                    <span class="text-surface-700 whitespace-nowrap">{{ row.startTimeLabel }}</span>
                </div>
            </template>

            <template #cell-progress="{ row }">
                <div class="flex flex-col gap-2">
                    <span class="font-medium text-surface-950">
                        {{
                            $t('routes.trips.resources.progressValue', {
                                actual: row.progressKm,
                                planned: row.plannedKm
                            })
                        }}
                    </span>
                    <div class="flex items-center gap-2">
                        <div
                            class="h-2 w-20 overflow-hidden rounded-full bg-surface-300"
                        >
                            <div
                                class="h-full rounded-full"
                                :class="
                                    row.progressExceeded
                                        ? 'bg-red-500'
                                        : 'bg-primary-500'
                                "
                                :style="{ width: `${row.barPercent}%` }"
                            />
                        </div>
                        <span class="text-sm text-surface-800">
                            {{ row.progressPercent }}%
                        </span>
                    </div>
                </div>
            </template>

            <template #cell-time="{ row }">
                <div class="flex flex-col gap-[0.125rem] leading-snug">
                    <span
                        class="font-medium text-surface-800 whitespace-nowrap"
                        :class="
                            row.timeExceeded
                                ? 'text-red-600'
                                : 'text-surface-950'
                        "
                    >
                        {{ row.elapsedLabel }}
                    </span>
                    <span class="text-surface-700 whitespace-nowrap">
                        {{ row.plannedTimeLabel }}
                    </span>
                </div>
            </template>
            <template #cell-lastAddress="{ row }">
                <p class="truncate max-w-11/12">
                    {{row.lastAddress}}
                </p>
            </template>
        </SharedResponsiveTable>
    </Dialog>
</template>

<script setup lang="ts">
import type { TableColumn } from '~/components/shared/ResponsiveTable';
import type { Trip } from '~/types/trip';
import type { PrimitiveColorName } from '~/theme/colors';
import { TRIP_RESOURCE_STATUS_META } from '~/constants/trip-list';

/** One display row of the trip resources table */
interface TripResourceRow extends Record<string, unknown> {
    id: string;
    vehicleLabel: string;
    driverLabel: string;
    statusLabel: string;
    statusColor: PrimitiveColorName;
    startDateLabel: string;
    startTimeLabel: string;
    progressKm: number;
    plannedKm: number;
    progressPercent: number;
    /** Bar fill width, capped at 100 */
    barPercent: number;
    progressExceeded: boolean;
    elapsedLabel: string;
    plannedTimeLabel: string;
    timeExceeded: boolean;
    lastAddress: string;
}

interface ResourcesDialogProps {
    /** Trip whose resources are shown; the dialog is opened with a trip */
    trip: Trip | null;
}

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<ResourcesDialogProps>();

const { t } = useI18n();
const { routes } = useRoutes();
const { drivers } = useDrivers();
const { vehicles } = useVehicles();

/** «Старт → Фініш» dialog title built from the trip's route points */
const routePath = computed<string>(() => {
    const route = routes.value.find((r) => r.id === props.trip?.routeId);
    if (!route) return '';
    const start = route.points[0]?.address ?? '';
    const finish = route.points[route.points.length - 1]?.address ?? '';
    return `${start} → ${finish}`;
});

const columns = computed<TableColumn[]>(() => [
    {
        field: 'resources',
        header: t('routes.trips.resources.columns.resources'),
    },
    { field: 'status', header: t('routes.trips.resources.columns.status') },
    {
        field: 'start',
        header: t('routes.trips.resources.columns.start'),
        width: '110px'
    },
    {
        field: 'progress',
        header: t('routes.trips.resources.columns.progress'),
        width: '160px'
    },
    { field: 'time', header: t('routes.trips.resources.columns.time') },
    {
        field: 'lastAddress',
        header: t('routes.trips.resources.columns.lastAddress')
    }
]);

/** Minutes as a long «X год Y хв» label */
const longDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    const parts: string[] = [];
    if (hours) parts.push(t('routes.list.durationHours', { n: hours }));
    if (rest || !hours)
        parts.push(t('routes.list.durationMinutes', { n: rest }));
    return parts.join(' ');
};

/** Display rows of the trip's resources */
const rows = computed<TripResourceRow[]>(() => {
    const trip = props.trip;
    if (!trip) return [];
    return trip.resources.map((resource, index): TripResourceRow => {
        const vehicle = vehicles.value.find((v) => v.id === resource.vehicleId);
        const started = new Date(resource.startedAt);
        const progressPercent = Math.round(
            (resource.progressKm / trip.plannedDistanceKm) * 100
        );
        const meta = TRIP_RESOURCE_STATUS_META[resource.status];
        return {
            id: `${resource.vehicleId}-${index}`,
            vehicleLabel: vehicle
                ? `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`
                : '',
            driverLabel:
                drivers.value.find((d) => d.id === resource.driverId)?.name ??
                '',
            statusLabel: t(meta.labelKey),
            statusColor: meta.badgeColor,
            startDateLabel: formatUaDate(started),
            startTimeLabel: `${started.getHours()}:${String(started.getMinutes()).padStart(2, '0')}`,
            progressKm: resource.progressKm,
            plannedKm: trip.plannedDistanceKm,
            progressPercent,
            barPercent: Math.min(progressPercent, 100),
            progressExceeded: progressPercent > 100,
            elapsedLabel: longDuration(resource.elapsedMinutes),
            plannedTimeLabel: longDuration(trip.plannedMinutes),
            timeExceeded: resource.elapsedMinutes > trip.plannedMinutes,
            lastAddress: resource.lastAddress
        };
    });
});
</script>
