<template>
    <div class="rounded-[10px] border border-surface-300 p-3">
        <!-- Parameter tabs + scroll/close controls -->
        <div class="mb-3 flex items-center gap-2 border-b border-surface-200">
            <div ref="tabsRef" class="-mb-px min-w-0 flex-1">
                <UiTabNav
                    v-model:value="selectedParamKey"
                    :items="paramTabs"
                    size="sm"
                    scrollable
                    :border="false"
                />
            </div>
            <div class="flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    class="flex size-7 cursor-pointer items-center justify-center rounded text-surface-800 transition-colors hover:text-surface-950"
                    :aria-label="
                        $t('objects.vehicles.detail.history.moreParams')
                    "
                    @click="scrollTabs"
                >
                    <Icon name="tabler:arrow-right" class="size-5" />
                </button>
                <button
                    type="button"
                    class="flex size-7 cursor-pointer items-center justify-center rounded text-surface-800 transition-colors hover:text-surface-950"
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

        <!-- Padded to the chart plot area so the cursor circle stays
             exactly under the chart cursor line -->
        <VehicleHistoryTimeline
            :style="{ paddingLeft: `${chartPlotLeft}px` }"
            class="-mt-10"
        />

        <!-- Playback row -->
        <div
            class="grid grid-cols-[minmax(124px,1fr)_1fr_1fr] grid-rows-2 gap-y-4 md:grid-cols-[minmax(134px,1fr)_1fr_minmax(auto,250px)_1fr] lg:grid-cols-[minmax(auto,134px)_minmax(auto,132px)_auto_minmax(auto,130px)] md:grid-rows-1"
        >
            <div>
                <div class="flex flex-col items-center gap-2 pr-3">
                    <Button
                        :aria-label="
                            playing
                                ? $t('objects.vehicles.detail.history.pause')
                                : $t('objects.vehicles.detail.history.play')
                        "
                        severity="secondary"
                        raised
                        @click="playing = !playing"
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

                    <div class="flex items-center gap-3 text-sm">
                        <button
                            v-for="speed in PLAYBACK_SPEEDS"
                            :key="speed"
                            type="button"
                            class="cursor-pointer transition-colors"
                            :class="
                                playSpeed === speed
                                    ? 'text-primary-300'
                                    : 'text-surface-500 hover:text-surface-800'
                            "
                            @click="playSpeed = speed"
                        >
                            {{ speed }}x
                        </button>
                    </div>
                </div>
            </div>
            <div class="border-l border-r border-surface-300">
                <div class="px-4 pt-2 flex flex-col gap-1.5">
                    <span class="text-xs text-surface-500">
                        {{ $t('objects.vehicles.detail.history.dateTime') }}
                    </span>
                    <span class="text-sm font-medium text-surface-800">
                        {{ cursorInfo.dateLabel }}
                        <span class="font-normal text-surface-700">
                            {{ cursorInfo.timeLabel }}
                        </span>
                    </span>
                </div>
            </div>
            <div>
                <div class="px-4 pt-2 ml-auto flex flex-col gap-0.5">
                    <span class="text-xs text-surface-500">
                        {{ $t('objects.vehicles.detail.history.speed') }}
                    </span>
                    <span class="text-sm text-surface-700">
                        {{ cursorInfo.speed }}
                        {{ $t('objects.online.card.speedUnit') }}
                    </span>
                </div>
            </div>
            <div
                class="md:pt-2 col-span-3 row-start-2 min-w-0 md:col-span-1 md:col-start-3 md:row-start-1 md:border-r md:border-surface-300"
            >
                <div class="px-3 flex min-w-0 flex-col gap-0.5 md:flex-1">
                    <span class="text-xs text-surface-500">
                        {{ $t('objects.vehicles.detail.history.location') }}
                    </span>
                    <span class="md:truncate text-sm text-surface-800" :title="cursorInfo.address">
                        {{ cursorInfo.address }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Highcharts from 'highcharts';
import type { TabItem } from '~/components/ui/TabNav/TabNav.vue';
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

/** Device parameters as tab items for the tab nav */
const paramTabs = computed<TabItem[]>(() =>
    history.value.params.map((param) => ({
        label: param.label,
        value: param.key
    }))
);

/** Scrolls the tab strip to reveal the parameters behind the arrow */
const scrollTabs = (): void => {
    tabsRef.value
        ?.querySelector('.p-tablist-content')
        ?.scrollBy({ left: 160, behavior: 'smooth' });
};

/** Currently charted parameter */
const selectedParam = computed(
    () =>
        history.value.params.find((p) => p.key === selectedParamKey.value) ??
        history.value.params[0]
);

let chart: Highcharts.Chart | null = null;

/**
 * Left offset of the chart plot area (y-axis labels width); the timeline
 * below is padded by it so both share the same horizontal scale
 */
const chartPlotLeft = ref<number>(0);

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
            // 8px bottom spacing so the lowest y-axis label ("0") is not
            // clipped by the container edge
            spacing: [10, 0, 8, 0]
        },
        title: { text: '' },
        credits: { enabled: false },
        // axis stays visible (hidden axes drop their plot lines); only the
        // labels/ticks are turned off
        xAxis: {
            labels: { enabled: false },
            lineWidth: 0,
            tickWidth: 0,
            // no edge padding: the series spans the full plot width, so the
            // cursor plot line lands exactly over the timeline circle below
            minPadding: 0,
            maxPadding: 0,
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
    chartPlotLeft.value = chart.plotLeft;
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
