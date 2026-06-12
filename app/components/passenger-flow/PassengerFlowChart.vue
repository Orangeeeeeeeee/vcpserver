<template>
    <div class="w-full">
        <div ref="chartContainer" class="w-full h-96" />
    </div>
</template>

<script lang="ts">
import Highcharts from 'highcharts';

/**
 * Passenger flow chart data point
 */
export interface PassengerFlowDataPoint {
    date: string;
    count: number;
}

export type PassengerFlowChartType = 'area' | 'column';

/**
 * Passenger flow chart props
 */
export interface PassengerFlowChartProps {
    type?: PassengerFlowChartType;
    color: string;
    data: PassengerFlowDataPoint[];
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<PassengerFlowChartProps>(), {
    type: 'area',
});

const chartContainer = useTemplateRef<HTMLDivElement>('chartContainer');

/**
 * Initialize Highcharts with passenger flow data
 */
const initChart = () => {
    if (!chartContainer.value) return;

    const times = props.data.map(d => d.date);
    const counts = props.data.map(d => d.count);

    const options: Highcharts.Options = {
        chart: {
            type: props.type,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'inherit'
            }
        },
        title: {
            text: '',
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: times,
            labels: {
                style: {
                    color: '#666'
                }
            }
        },
        yAxis: {
            title: {
                text: '',
            },
            labels: {
                style: {
                    color: '#666'
                }
            },
            gridLineColor: '#F3F3F3'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                borderRadius: 6
            },
            series: {
                pointStart: 0
            },
            area: {
                lineColor: props.color,
                lineWidth: 2,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                },
                states: {
                    hover: {
                        lineWidth: 2,
                    }
                },
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, `color-mix(in srgb, ${props.color} 10%, transparent)`],
                        [1, '#fffbfb']
                    ]
                },
            }
        },
        series: props.type === 'area'
            ? [
                { name: '', data: counts },
                { name: '', data: counts },
                { name: '', data: counts }
            ]
            : [
                {
                    name: '',
                    color: `color-mix(in srgb, ${props.color} 20%, transparent)`,
                    data: counts
                }, {
                    name: '',
                    color: `color-mix(in srgb, ${props.color} 50%, transparent)`,
                    data: counts
                }, {
                    name: '',
                    color: props.color,
                    data: counts
                }
            ],
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        }
    };

    Highcharts.chart(chartContainer.value, options);
};

onMounted(() => {
    initChart();
});

watch([
    () => props.data,
    () => props.type
], () => {
    initChart();
});
</script>