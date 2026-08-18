<template>
    <div class="flex flex-col gap-2.5 p-4">
        <h3 class="text-base font-medium text-surface-900">
            {{ $t('zones.detail.stats.title') }}
        </h3>

        <div
            class="flex items-center justify-between gap-2 rounded-lg border border-surface-300 p-3.5"
        >
            <span class="text-sm text-surface-900">
                {{ $t('zones.detail.stats.inZoneNow') }}
            </span>
            <span
                class="shrink-0 rounded bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600"
            >
                {{
                    $t('zones.detail.stats.vehiclesCount', {
                        n: stats.currentCount
                    })
                }}
            </span>
        </div>

        <!-- Statistics day picker -->
        <DatePicker
            v-model="selectedDate"
            date-format="dd.mm.yy"
            show-icon
            icon-display="input"
            :max-date="new Date()"
            fluid
            :pt="{
                panel: { class: '!w-[21.5rem] !min-w-0' },
            }"
        />

        <!-- Hourly occupancy chart -->
        <div ref="chartContainer" class="h-[180px] w-full" />

        <!-- Entry / exit event cards -->
        <div
            v-for="section in eventSections"
            :key="section.key"
            class="flex flex-col gap-2"
        >
            <span class="text-base font-medium text-surface-900">
                {{ $t(section.titleKey) }}
            </span>
            <div class="rounded-lg border border-surface-300 p-3">
                <div
                    v-for="(event, index) in section.visibleEvents"
                    :key="`${event.vehicleId}:${event.time}:${index}`"
                    class="flex items-center gap-2 border-b border-surface-200 last:border-b-0 py-2 first:pt-0 last:pb-0"
                >
                    <Icon
                        :name="vehicleMeta(event.vehicleId).icon"
                        class="size-4 shrink-0 text-surface-600"
                    />
                    <span
                        class="min-w-0 flex-1 md:truncate text-sm text-surface-900"
                        :title="vehicleMeta(event.vehicleId).label"
                    >
                        {{ vehicleMeta(event.vehicleId).label }}
                    </span>
                    <div class="flex shrink-0 flex-col items-end leading-none">
                        <span class="text-sm font-medium text-surface-900">
                            {{ event.time }}
                        </span>
                        <span class="text-xs text-surface-800">
                            {{ event.date }}
                        </span>
                    </div>
                </div>

                <SharedAnimatedHeight v-if="section.hiddenEvents.length">
                    <div
                        v-for="(event, index) in section.hiddenEvents"
                        :key="`${event.vehicleId}:${event.time}:${index}`"
                        class="flex items-center gap-2 border-b border-surface-200 last:border-b-0 py-2 last:pb-0"
                    >
                        <Icon
                            :name="vehicleMeta(event.vehicleId).icon"
                            class="size-4 shrink-0 text-surface-600"
                        />
                        <span
                            class="min-w-0 flex-1 md:truncate text-sm text-surface-900"
                            :title="vehicleMeta(event.vehicleId).label"
                        >
                            {{ vehicleMeta(event.vehicleId).label }}
                        </span>
                        <div
                            class="flex shrink-0 flex-col items-end leading-none"
                        >
                            <span
                                class="text-sm font-medium text-surface-900"
                            >
                                {{ event.time }}
                            </span>
                            <span class="text-xs text-surface-800">
                                {{ event.date }}
                            </span>
                        </div>
                    </div>

                    <template #title="{ expanded, toggle }">
                        <button
                            type="button"
                            class="flex w-full cursor-pointer items-center justify-center gap-1 pt-2.5 pb-0.5 text-sm text-surface-800 transition-colors hover:text-surface-950"
                            :aria-expanded="expanded"
                            @click="toggle"
                        >
                            {{
                                expanded
                                    ? $t('zones.list.collapse')
                                    : $t('zones.list.expand')
                            }}
                            <Icon
                                :name="
                                    expanded
                                        ? 'tabler:chevron-up'
                                        : 'tabler:chevron-down'
                                "
                                class="size-4"
                            />
                        </button>
                    </template>
                </SharedAnimatedHeight>
            </div>
        </div>

        <!-- Total / average time tiles -->
        <div class="grid grid-cols-2 gap-3">
            <div
                v-for="tile in timeTiles"
                :key="tile.labelKey"
                class="flex flex-col gap-0.5 rounded-lg border border-surface-300 px-4 py-3"
            >
                <span class="flex items-center gap-1.5 text-surface-950">
                    <Icon
                        name="tabler:clock"
                        class="size-5 shrink-0 text-surface-700"
                    />
                    <span class="text-surface-900 text-base">
                        {{ tile.duration }}
                    </span>
                </span>
                <span class="text-xs text-surface-700">
                    {{ $t(tile.labelKey) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Highcharts from 'highcharts';
import type { ZoneVisitEvent } from '~/types/zone-stats';
import { VEHICLE_TYPE_ICONS } from '~/constants/vehicles';
import { surface, primary} from '~/theme/colors';

/** Section key of an entry/exit event card */
type ZoneEventSectionKey = 'entries' | 'exits';

/** Render model of one entry/exit event card */
interface ZoneEventSection {
    key: ZoneEventSectionKey;
    /** i18n key of the card title */
    titleKey: string;
    /** Events always visible in the card (first N) */
    visibleEvents: ZoneVisitEvent[];
    /** Events collapsed behind the «Розгорнути / Згорнути» toggle */
    hiddenEvents: ZoneVisitEvent[];
}

/** Render model of a total/average time tile */
interface ZoneTimeTile {
    /** i18n key of the tile caption */
    labelKey: string;
    /** Display-ready duration, e.g. "18 год 40 хв" */
    duration: string;
}

/** Icon + label of a vehicle referenced by an event */
interface ZoneEventVehicleMeta {
    /** Tabler icon of the vehicle type */
    icon: string;
    /** Vehicle label, e.g. "MAN TGX 18.480 (ID: TRK-112)" */
    label: string;
}

/** Events shown per card before collapsing the rest behind «Розгорнути» */
const MAX_VISIBLE_EVENTS = 3;
</script>

<script setup lang="ts">
const { t } = useI18n();
const { selectedDate, stats } = useZoneDetailContext();
const { vehicles } = useVehicles();

const chartContainer = useTemplateRef<HTMLDivElement>('chartContainer');

/**
 * Renders the hourly occupancy line chart into the container.
 */
const initChart = (): void => {
    if (!chartContainer.value) return;

    const options: Highcharts.Options = {
        chart: {
            type: 'area',
            height: 180,
            backgroundColor: 'transparent',
            spacing: [10, 0, 8, 0],
            style: {
                fontFamily: 'inherit'
            }
        },
        title: { text: '' },
        credits: { enabled: false },
        xAxis: {
            min: 0,
            max: 23,
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            tickInterval: 6,
            labels: {
                formatter() {
                    return `${String(this.value).padStart(2, '0')}:00`;
                },
                style: { color: surface[700] }
            },
            lineColor: '#ECEDED',
            tickLength: 0
        },
        yAxis: {
            title: { text: '' },
            min: 0,
            max: 100,
            tickInterval: 20,
            labels: {
                style: { color: surface[700] }
            },
            gridLineColor: '#ECEDED'
        },
        plotOptions: {
            area: {
                lineColor: primary[600],
                lineWidth: 1.5,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 5,
                            fillColor: primary[600],
                            lineColor: surface[100],
                            lineWidth: 1
                        }
                    }
                },
                states: {
                    hover: {
                        halo: { size: 0 }
                    }
                }
            }
        },
        series: [
            {
                type: 'area',
                name: '',
                data: stats.value.occupancyByHour,
                color: surface[900],
                fillColor:  `color-mix(in srgb, ${primary[600]} 4%, transparent)`
            }
        ],
        tooltip: { enabled: false },
        legend: { enabled: false }
    };

    Highcharts.chart(chartContainer.value, options);
};

onMounted(() => {
    initChart();
});

watch(stats, () => {
    initChart();
});

/** Vehicle lookup for the event rows */
const vehicleById = computed(
    () => new Map(vehicles.value.map((vehicle) => [vehicle.id, vehicle]))
);

/**
 * Resolves the type icon and display label of an event vehicle.
 * @param {string} vehicleId Vehicle id of the event.
 * @returns {ZoneEventVehicleMeta} Icon and label; falls back to the raw id.
 */
const vehicleMeta = (vehicleId: string): ZoneEventVehicleMeta => {
    const vehicle = vehicleById.value.get(vehicleId);
    if (!vehicle) return { icon: 'tabler:truck', label: vehicleId };
    return {
        icon: VEHICLE_TYPE_ICONS[vehicle.type],
        label: `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`
    };
};

/** Entry and exit event cards in display order */
const eventSections = computed<ZoneEventSection[]>(() =>
    (
        [
            {
                key: 'entries',
                titleKey: 'zones.detail.stats.entries',
                events: stats.value.entries
            },
            {
                key: 'exits',
                titleKey: 'zones.detail.stats.exits',
                events: stats.value.exits
            }
        ] as const
    ).map(({ key, titleKey, events }) => ({
        key,
        titleKey,
        visibleEvents: events.slice(0, MAX_VISIBLE_EVENTS),
        hiddenEvents: events.slice(MAX_VISIBLE_EVENTS)
    }))
);

/**
 * Formats minutes as a localized «{h} год {m} хв» duration.
 * @param {number} minutes Duration in minutes.
 * @returns {string} Display-ready duration.
 */
const formatDuration = (minutes: number): string =>
    t('zones.detail.stats.duration', {
        h: Math.floor(minutes / 60),
        m: minutes % 60
    });

/** Total and average time tiles at the bottom of the section */
const timeTiles = computed<ZoneTimeTile[]>(() => [
    {
        labelKey: 'zones.detail.stats.totalTime',
        duration: formatDuration(stats.value.totalMinutes)
    },
    {
        labelKey: 'zones.detail.stats.averageTime',
        duration: formatDuration(stats.value.averageMinutes)
    }
]);
</script>
