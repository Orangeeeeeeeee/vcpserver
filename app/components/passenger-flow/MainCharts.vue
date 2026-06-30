<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div
            v-for="chart in charts"
            :key="chart.id"
            class="p-4 pb-1 border border-surface-300 rounded-md"
        >
            <div class="flex justify-between items-basearea mb-4">
                <h2 v-if="chart.title" class="text-lg text-surface-900">
                    {{ chart.title }}
                </h2>
                <div v-if="chart.total" class="text-base text-surface-900 rounded-2xl py-1 px-3" :style="{ background: `color-mix(in srgb, ${chart.color} 20%, transparent)` }">
                    {{ chart.total }}
                </div>
            </div>
            <PassengerFlowChart
                :data="chart.data"
                :type="chart.type"
                :color="chart.color"
                :title="chart.title"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PassengerFlowChart from '~/components/passenger-flow/PassengerFlowChart.vue';
import type {
    PassengerFlowChartType,
    PassengerFlowDataPoint
} from '~/components/passenger-flow/PassengerFlowChart.vue';

export interface MainChartConfig {
    id: string;
    type: PassengerFlowChartType;
    color: string;
    title: string;
    total?: number | string;
    data: PassengerFlowDataPoint[];
}

defineProps<{
    charts: MainChartConfig[];
}>();
</script>
