<template>
    <span
        class="inline-flex max-w-full items-center truncate rounded-md px-2 py-0.5 text-sm font-medium"
        :style="{
            background: primitiveColors[color]['100'],
            color: primitiveColors[color]['700']
        }"
    >
        {{ label }}
    </span>
</template>

<script setup lang="ts">
import { primitiveColors } from '~/theme/colors';
import type { RoutePointColor } from '~/constants/route-form';

interface RoutePointChipProps {
    /** Chip text, e.g. «Старт» or the tariff point name */
    label: string;
    /** Palette accent of the chip background/text */
    color: RoutePointColor;
}

defineProps<RoutePointChipProps>();
</script>
