<template>
    <div class="rounded-[10px] border border-surface-300 p-4">
        <!-- Parameter tabs + scroll/close controls -->
        <div class="mb-3 flex items-center gap-2 border-b border-surface-200">
            <div
                ref="tabsRef"
                class="scrollbar-none -mb-px flex min-w-0 flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap"
            >
                <button
                    v-for="param in history.params"
                    :key="param.key"
                    type="button"
                    class="cursor-pointer border-b-2 pb-2.5 text-sm transition-colors"
                    :class="
                        selectedParamKey === param.key
                            ? 'border-primary-600 font-medium text-primary-800'
                            : 'border-transparent text-surface-700 hover:text-surface-950'
                    "
                    @click="selectedParamKey = param.key"
                >
                    {{ param.label }}
                </button>
            </div>
            <div class="flex shrink-0 items-center gap-1 pb-2">
                <button
                    type="button"
                    class="flex size-7 cursor-pointer items-center justify-center rounded text-surface-600 transition-colors hover:text-surface-950"
                    :aria-label="
                        $t('objects.vehicles.detail.history.moreParams')
                    "
                    @click="scrollTabs"
                >
                    <Icon name="tabler:arrow-right" class="size-5" />
                </button>
                <button
                    type="button"
                    class="flex size-7 cursor-pointer items-center justify-center rounded text-surface-600 transition-colors hover:text-surface-950"
                    :aria-label="
                        $t('objects.vehicles.detail.history.closeTelemetry')
                    "
                    @click="telemetryOpen = false"
                >
                    <Icon name="tabler:x" class="size-5" />
                </button>
            </div>
        </div>

        <!-- Chart of the selected parameter -->
        <div :id="CHART_CONTAINER_ID" class="h-36 w-full md:h-40" />

        <VehicleHistoryTimeline class="mt-2" />

        <!-- Playback row -->
        <div class="grid grid-cols-3 grid-rows-2 gap-y-3 -px-3">
            <div>
                <div class="flex flex-col items-center gap-3 px-3">
                    <Button
                        :aria-label="
                            playing
                                ? $t('objects.vehicles.detail.history.pause')
                                : $t('objects.vehicles.detail.history.play')
                        "
                        @click="playing = !playing"
                        severity="secondary"
                        raised
                    >
                        <template #icon>
                            <Icon
                                :name="
                                    playing
                                        ? 'tabler:player-pause'
                                        : 'tabler:player-play'
                                "
                            />
                        </template>
                    </Button>

                    <div class="flex items-center gap-2 text-sm">
                        <button
                            v-for="speed in PLAYBACK_SPEEDS"
                            :key="speed"
                            type="button"
                            class="cursor-pointer transition-colors"
                            :class="
                                playSpeed === speed
                                    ? 'font-semibold text-primary-700'
                                    : 'text-surface-500 hover:text-surface-800'
                            "
                            @click="playSpeed = speed"
                        >
                            {{ speed }}x
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div
                    class="px-3 flex flex-col gap-0.5 border-l border-r border-surface-300 md:border-l md:border-surface-200 md:pl-6"
                >
                    <span class="text-xs text-surface-500">
                        {{ $t('objects.vehicles.detail.history.dateTime') }}
                    </span>
                    <span class="text-sm font-semibold text-surface-950">
                        {{ cursorInfo.dateLabel }}
                        <span class="font-normal text-surface-800">
                            {{ cursorInfo.timeLabel }}
                        </span>
                    </span>
                </div>
            </div>
            <div>
                <div
                    class="px-3 ml-auto flex flex-col gap-0.5 md:border-l md:border-surface-200 md:pl-6"
                >
                    <span class="text-xs text-surface-500">
                        {{ $t('objects.vehicles.detail.history.speed') }}
                    </span>
                    <span class="text-sm text-surface-900">
                        {{ cursorInfo.speed }}
                        {{ $t('objects.online.card.speedUnit') }}
                    </span>
                </div>
            </div>
            <div class="col-span-3 row-start-2">
                <div
                    class="px-3 flex min-w-0 flex-col gap-0.5 md:flex-1 md:border-l md:border-surface-200 md:pl-6"
                >
                    <span class="text-xs text-surface-500">
                        {{ $t('objects.vehicles.detail.history.location') }}
                    </span>
                    <span class="truncate text-sm text-surface-900">
                        {{ cursorInfo.address }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Highcharts from 'highcharts';
import { primitiveColors } from '~/theme/colors';
import {
    useVehicleHistoryContext,
    PLAYBACK_SPEEDS
} from '~/composables/useVehicleHistory';

/**
 * Telemetry panel of the history tab: device parameter tabs, the area chart
 * of the selected parameter with a cursor line, the playback timeline and
 * the playback controls with the current readout.
 */

/** Chart mounts by id: the panel can sit inside client-only map columns */
const CHART_CONTAINER_ID = 'vehicle-history-chart';

/** Chart line color (the blue series from the mockup) */
const LINE_COLOR = primitiveColors.sky['600'];

const {
    history,
    selectedParamKey,
    telemetryOpen,
    cursor,
    cursorInfo,
    playing,
    playSpeed
} = useVehicleHistoryContext();

const tabsRef = useTemplateRef<HTMLDivElement>('tabsRef');

/** Scrolls the tab strip to reveal the parameters behind the arrow */
const scrollTabs = (): void => {
    tabsRef.value?.scrollBy({ left: 160, behavior: 'smooth' });
};

/** Currently charted parameter */
const selectedParam = computed(
    () =>
        history.value.params.find((p) => p.key === selectedParamKey.value) ??
        history.value.params[0]
);

let chart: Highcharts.Chart | null = null;

/** (Re)creates the chart for the selected parameter */
const renderChart = (): void => {
    const container = document.getElementById(CHART_CONTAINER_ID);
    const param = selectedParam.value;
    if (!container || !param) return;
    chart?.destroy();
    chart = Highcharts.chart(container, {
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
            style: { fontFamily: 'inherit' },
            spacing: [10, 0, 0, 0]
        },
        title: { text: '' },
        credits: { enabled: false },
        // axis stays visible (hidden axes drop their plot lines); only the
        // labels/ticks are turned off
        xAxis: {
            labels: { enabled: false },
            lineWidth: 0,
            tickWidth: 0,
            plotLines: [cursorPlotLine()]
        },
        yAxis: {
            title: { text: '' },
            tickAmount: 4,
            labels: { style: { color: '#666' } },
            gridLineColor: '#F3F3F3'
        },
        plotOptions: {
            area: {
                lineColor: LINE_COLOR,
                lineWidth: 2,
                marker: {
                    enabled: false,
                    states: { hover: { enabled: false } }
                },
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [
                            0,
                            `color-mix(in srgb, ${LINE_COLOR} 14%, transparent)`
                        ],
                        [1, 'transparent']
                    ]
                }
            }
        },
        series: [{ type: 'area', name: param.label, data: param.values }],
        tooltip: { enabled: false },
        legend: { enabled: false }
    });
};

/** Cursor vertical line options at the current timeline position */
const cursorPlotLine = (): Highcharts.XAxisPlotLinesOptions => ({
    id: 'cursor',
    value: cursor.value * ((selectedParam.value?.values.length ?? 1) - 1),
    color: LINE_COLOR,
    width: 1.5,
    zIndex: 5
});

onMounted(renderChart);
onUnmounted(() => {
    chart?.destroy();
    chart = null;
});

/** New parameter or period → rebuild the chart */
watch([selectedParam, history], () => renderChart());

/** Cursor moves → shift the chart plot line */
watch(cursor, () => {
    const axis = chart?.xAxis[0];
    if (!axis) return;
    axis.removePlotLine('cursor');
    axis.addPlotLine(cursorPlotLine());
});
</script>

<style scoped>
/* Hide the tab strip scrollbar; the arrow button drives the overflow */
.scrollbar-none {
    scrollbar-width: none;
}

.scrollbar-none::-webkit-scrollbar {
    display: none;
}
</style>
