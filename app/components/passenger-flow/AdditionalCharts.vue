<template>
    <div class="p-4 mb-4 border border-surface-300 rounded-md">
        <button
            type="button"
            class="flex items-center justify-between w-full cursor-pointer"
            :aria-expanded="open"
            @click="open = !open"
        >
            <UiTypography variant="h5">
                {{ $t('passengerFlow.additionalCharts.caption') }}
            </UiTypography>
            <Icon
                :name="open ? 'tabler:chevron-up' : 'tabler:chevron-down'"
                class="size-5 text-surface-700"
            />
        </button>

        <SharedCollapseTransition>
            <div v-show="open">
                <div class="grid grid-cols-6 gap-4 mt-4">
                    <div
                        v-for="(chart, index) in charts"
                        :key="chart.id"
                        :class="[
                            'p-4 pb-1 border border-surface-300 rounded-md',
                            index === 0 || index === 1
                                ? 'col-span-6 md:col-span-3 xl:col-span-3'
                                : 'col-span-6 md:col-span-3 xl:col-span-2',
                            index === 4
                                ? 'col-span-6 md:col-span-6 xl:col-span-2'
                                : 'col-span-6 md:col-span-3 xl:col-span-2'
                        ]"
                    >
                        <div class="flex justify-between items-basearea mb-4">
                            <UiTypography
                                v-if="chart.title"
                                variant="h6"
                                class="text-surface-800"
                            >
                                {{ chart.title }}
                            </UiTypography>
                        </div>
                        <PassengerFlowChart
                            :data="chart.data"
                            :type="chart.type"
                            :color="chart.color"
                            :title="chart.title"
                            :value-suffix="chart.valueSuffix"
                        />
                    </div>
                </div>
            </div>
        </SharedCollapseTransition>
    </div>
</template>

<script setup lang="ts">
import PassengerFlowChart from '~/components/passenger-flow/PassengerFlowChart.vue';
import type {
    PassengerFlowChartType,
    PassengerFlowDataPoint
} from '~/components/passenger-flow/PassengerFlowChart.vue';

import { ref } from 'vue';

interface ChartConfig {
    id: string;
    type: PassengerFlowChartType;
    color: string;
    title: string;
    /** Unit appended to the tooltip value (e.g. "км", "₴") */
    valueSuffix?: string;
    data: PassengerFlowDataPoint[];
}

useI18n();

const props = defineProps<{
    charts: ChartConfig[];
    openDefault?: boolean;
}>();

const open = ref<boolean>(props.openDefault ?? true);

// charts are provided via props
const charts = props.charts;
</script>
