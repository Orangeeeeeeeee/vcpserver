<template>
    <div class="flex items-center gap-3 border border-surface-300 rounded-md w-full px-3 pt-4 pb-3">
        <div class="flex items-center justify-center bg-primary-100 rounded-md size-12" 
             :style="{ background: `color-mix(in srgb, ${data.color} 15%, transparent)` }">
            <Icon :name="data.icon" class="size-5" :style="{ color: data.color }" />
        </div>

        <div class="flex flex-col flex-1">
            <span class="flex items-baseline text-surface-900 text-sm">
                <span class="font-medium text-2xl text-surface-900">
                    {{ data.total }}
                </span>
                <div
                    :class="[
                        'flex gap-1 items-center text-sm px-2 py-1 rounded',
                        data.change >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                    ]"
                >
                    <Icon
                        :name="
                            data.change >= 0
                                ? 'tabler:arrow-up'
                                : 'tabler:arrow-down'
                        "
                        class="inline size-4"
                    />
                    {{ Math.abs(data.change) }}%
                </div>
            </span>
            <span class="text-sm text-surface-700">
                {{ data.title }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
export interface PassengerFlowTotal {
    id: string;
    icon: string;
    title: string;
    color: string;
    total: number | string;
    change: number;
}
</script>

<script setup lang="ts">
interface TotalCardProps {
    data: PassengerFlowTotal;
}

defineProps<TotalCardProps>();
</script>