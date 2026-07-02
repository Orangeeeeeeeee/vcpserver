<template>
    <div class="flex flex-col gap-4 p-4">
        <h3 class="text-lg font-semibold text-surface-900">
            {{ $t('zones.detail.stats.title') }}
        </h3>

        <!-- «У зоні зараз» plaque -->
        <div
            class="flex items-center justify-between gap-2 rounded-lg bg-surface-100 p-3"
        >
            <span class="text-sm text-surface-900">
                {{ $t('zones.detail.stats.inZoneNow') }}
            </span>
            <span
                class="shrink-0 rounded bg-primary-100 px-2 py-0.5 text-sm font-medium text-primary-600"
            >
                {{
                    $t('zones.detail.stats.vehiclesCount', {
                        n: stats.currentCount
                    })
                }}
            </span>
        </div>

        <!-- Statistics day picker -->
        <div>
            <button
                type="button"
                :aria-expanded="isDateOpen"
                aria-haspopup="dialog"
                class="flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-surface-300 px-3 text-sm transition duration-300 hover:border-primary-300 aria-expanded:border-primary-300"
                @click="toggleDatePopover"
            >
                <Icon
                    name="tabler:calendar"
                    class="size-5 shrink-0 text-surface-600"
                />
                <span
                    class="min-w-0 flex-1 truncate text-left text-surface-950"
                >
                    {{ dateLabel }}
                </span>
                <Icon
                    name="tabler:chevron-down"
                    class="size-5 shrink-0 text-surface-600"
                />
            </button>
            <Popover
                ref="datePopoverRef"
                @show="isDateOpen = true"
                @hide="isDateOpen = false"
            >
                <DatePicker
                    v-model="selectedDate"
                    inline
                    date-format="dd.mm.yy"
                    @date-select="datePopoverRef?.hide()"
                />
            </Popover>
        </div>

        <!-- Hourly occupancy chart -->
        <div ref="chartContainer" class="h-[180px] w-full" />

        <!-- Entry / exit event cards -->
        <div
            v-for="section in eventSections"
            :key="section.key"
            class="flex flex-col gap-2"
        >
            <span class="text-sm font-medium text-surface-900">
                {{ $t(section.titleKey) }}
            </span>
            <div class="rounded-lg border border-surface-200">
                <div
                    v-for="(event, index) in section.visibleEvents"
                    :key="`${event.vehicleId}:${event.time}:${index}`"
                    class="flex items-center gap-2 border-b border-surface-200 p-3 last:border-b-0"
                >
                    <Icon
                        :name="vehicleMeta(event.vehicleId).icon"
                        class="size-5 shrink-0 text-surface-700"
                    />
                    <span
                        class="min-w-0 flex-1 truncate text-sm text-surface-950"
                    >
                        {{ vehicleMeta(event.vehicleId).label }}
                    </span>
                    <div class="flex shrink-0 flex-col items-end">
                        <span class="text-sm font-medium text-surface-950">
                            {{ event.time }}
                        </span>
                        <span class="text-xs text-surface-700">
                            {{ event.date }}
                        </span>
                    </div>
                </div>
                <button
                    v-if="section.hasHiddenEvents"
                    type="button"
                    class="flex w-full cursor-pointer items-center justify-center gap-1 p-3 text-sm text-surface-800 transition-colors hover:text-surface-950"
                    @click="
                        expandedSections[section.key] =
                            !expandedSections[section.key]
                    "
                >
                    {{
                        expandedSections[section.key]
                            ? $t('zones.list.collapse')
                            : $t('zones.list.expand')
                    }}
                    <Icon
                        :name="
                            expandedSections[section.key]
                                ? 'tabler:chevron-up'
                                : 'tabler:chevron-down'
                        "
                        class="size-4"
                    />
                </button>
            </div>
        </div>

        <!-- Total / average time tiles -->
        <div class="grid grid-cols-2 gap-3">
            <div
                v-for="tile in timeTiles"
                :key="tile.labelKey"
                class="flex flex-col gap-1 rounded-lg border border-surface-200 p-3"
            >
                <span
                    class="flex items-center gap-1.5 font-semibold text-surface-950"
                >
                    <Icon
                        name="tabler:clock"
                        class="size-5 shrink-0 text-surface-800"
                    />
                    {{ tile.duration }}
                </span>
                <span class="text-sm text-surface-700">
                    {{ $t(tile.labelKey) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Highcharts from 'highcharts';
import Popover from 'primevue/popover';
import type { ZoneVisitEvent } from '~/types/zone-stats';
import { VEHICLE_TYPE_ICONS } from '~/constants/vehicles';
import { surface } from '~/theme/colors';

/** Section key of an entry/exit event card */
type ZoneEventSectionKey = 'entries' | 'exits';

/** Render model of one entry/exit event card */
interface ZoneEventSection {
    key: ZoneEventSectionKey;
    /** i18n key of the card title */
    titleKey: string;
    /** Events visible in the card (first N unless expanded) */
    visibleEvents: ZoneVisitEvent[];
    /** True when the «Розгорнути / Згорнути» toggle has something to reveal */
    hasHiddenEvents: boolean;
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

const datePopoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the date popover is currently open (drives the trigger border) */
const isDateOpen = ref<boolean>(false);

/** Toggles the statistics day popover */
const toggleDatePopover = (event: MouseEvent): void => {
    datePopoverRef.value?.toggle(event);
};

/** Trigger label — «Сьогодні, dd.mm.yyyy» when the selected day is today */
const dateLabel = computed<string>(() => {
    const formatted = formatUaDate(selectedDate.value);
    return formatted === formatUaDate(new Date())
        ? t('zones.detail.stats.today', { date: formatted })
        : formatted;
});

const chartContainer = useTemplateRef<HTMLDivElement>('chartContainer');

/**
 * Renders the hourly occupancy line chart into the container.
 */
const initChart = (): void => {
    if (!chartContainer.value) return;

    const options: Highcharts.Options = {
        chart: {
            type: 'line',
            height: 180,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'inherit'
            }
        },
        title: { text: '' },
        credits: { enabled: false },
        xAxis: {
            categories: Array.from(
                { length: 24 },
                (_, hour) => `${String(hour).padStart(2, '0')}:00`
            ),
            tickInterval: 6,
            labels: {
                style: { color: surface[700] }
            },
            lineColor: surface[300],
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
            gridLineColor: surface[200]
        },
        plotOptions: {
            line: {
                lineWidth: 1.5,
                marker: { enabled: false }
            }
        },
        series: [
            {
                type: 'line',
                name: '',
                data: stats.value.occupancyByHour,
                color: surface[900]
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

/** Expanded state of the entry/exit event cards */
const expandedSections = reactive<Record<ZoneEventSectionKey, boolean>>({
    entries: false,
    exits: false
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
        visibleEvents: expandedSections[key]
            ? events
            : events.slice(0, MAX_VISIBLE_EVENTS),
        hasHiddenEvents: events.length > MAX_VISIBLE_EVENTS
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
