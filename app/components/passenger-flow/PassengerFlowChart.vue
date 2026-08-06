<template>
    <div class="w-full">
        <div ref="chartContainer" class="w-full h-96" />
    </div>
</template>

<script lang="ts">
import Highcharts from 'highcharts';
import { surface } from '~/theme/colors';

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
    /** Metric name used as the value label inside the tooltip */
    title?: string;
    /** Unit appended to the tooltip value (e.g. "км", "₴") */
    valueSuffix?: string;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<PassengerFlowChartProps>(), {
    type: 'area',
    title: undefined,
    valueSuffix: undefined
});

const chartContainer = useTemplateRef<HTMLDivElement>('chartContainer');

/**
 * Initialize Highcharts with passenger flow data
 */
const initChart = () => {
    if (!chartContainer.value) return;

    const times = props.data.map((d) => d.date);
    const counts = props.data.map((d) => d.count);

    const options: Highcharts.Options = {
        chart: {
            type: props.type,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'inherit'
            }
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: times,
            // Area points are placed 'on' ticks (edge-to-edge), so ticks must sit on categories too
            tickmarkPlacement: props.type === 'area' ? 'on' : 'between',
            lineColor: '##F3F3F3',
            labels: {
                style: {
                    color: '#666'
                }
            }
        },
        yAxis: {
            title: {
                text: ''
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
                // Start/end the area exactly at the plot edges instead of half a category slot in
                pointPlacement: 'on',
                lineColor: props.color,
                lineWidth: 2,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 4,
                            fillColor: props.color,
                            lineWidth: 0
                        }
                    }
                },
                states: {
                    hover: {
                        lineWidth: 2
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
                        [
                            0,
                            `color-mix(in srgb, ${props.color} 5%, transparent)`
                        ],
                        [1, 'rgba(255, 255, 255, 0)']
                    ]
                }
            }
        },
        series:
            props.type === 'area'
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
                      },
                      {
                          name: '',
                          color: `color-mix(in srgb, ${props.color} 50%, transparent)`,
                          data: counts
                      },
                      {
                          name: '',
                          color: props.color,
                          data: counts
                      }
                  ],
        tooltip: {
            backgroundColor: surface[100],
            borderColor: surface[300],
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            shadow: false,
            style: {
                color: surface[900],
                fontSize: '13px'
            },
            /** Date header + "<metric>: <value> <unit>" for the hovered/tapped point */
            formatter(this: Highcharts.Point): string {
                const value = (this.y ?? 0).toLocaleString('uk-UA');
                const suffix = props.valueSuffix ? ` ${props.valueSuffix}` : '';
                const label = props.title ? `${props.title}: ` : '';

                return (
                    `<span style="font-size: 11px; color: ${surface[700]}">${this.category}</span><br/>` +
                    `${label}<b>${value}${suffix}</b>`
                );
            }
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

watch([() => props.data, () => props.type], () => {
    initChart();
});
</script>
