<template>
    <!-- `!` utilities: the primevue CSS layer is declared after Tailwind's
         utilities layer in this app, so plain background/radius/padding
         utilities would lose to the Chip theme styles. -->
    <Chip
        :label="label"
        class="max-w-full rounded-md! px-2! font-medium"
        :class="COLOR_CLASSES[color]"
        :pt="{ label: { class: 'truncate text-xs' } }"
    />
</template>

<script setup lang="ts">
import type { PrimitiveColorName } from '~/theme/colors';

interface ColorChipProps {
    /** Chip text */
    label: string;
    /** Palette accent of the chip background/text */
    color?: PrimitiveColorName;
}

defineProps<ColorChipProps>();

/** Maps palette accent to chip background/text utility classes */
const COLOR_CLASSES: Record<PrimitiveColorName, string> = {
    green: 'bg-green-100! text-green-700!',
    red: 'bg-red-100! text-red-700!',
    yellow: 'bg-yellow-100! text-yellow-700!',
    indigo: 'bg-indigo-100! text-indigo-700!',
    teal: 'bg-teal-100! text-teal-700!',
    violet: 'bg-violet-100! text-violet-700!',
    sky: 'bg-sky-100! text-sky-700!',
    rose: 'bg-rose-100! text-rose-700!',
    amber: 'bg-amber-100! text-amber-700!'
};
</script>
