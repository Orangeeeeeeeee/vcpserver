<template>
    <div class="p-4 space-y-10">
        <section v-for="group in colorGroups" :key="group.title">
            <h2 class="text-xl font-semibold mb-4 text-surface-900">
                {{ group.title }}
            </h2>
            <div
                class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3"
            >
                <div
                    v-for="swatch in group.swatches"
                    :key="swatch.label"
                    class="flex flex-col"
                >
                    <div
                        class="aspect-square rounded-lg border border-surface-300"
                        :style="{
                            backgroundColor: swatch.cssVar
                                ? `var(${swatch.cssVar})`
                                : swatch.hex
                        }"
                    />
                    <span class="text-sm font-medium mt-2 text-surface-700">
                        {{ swatch.label }}
                    </span>
                    <span class="text-xs text-surface-500 font-mono">
                        {{ swatch.hex }}
                    </span>
                    <span
                        v-if="swatch.cssVar"
                        class="text-xs text-surface-400 font-mono"
                    >
                        {{ swatch.cssVar }}
                    </span>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { primary, surface, primitiveColors } from '~/theme/colors';

interface Swatch {
    label: string;
    hex: string;
    cssVar?: string;
}

interface ColorGroup {
    title: string;
    swatches: Swatch[];
}

function paletteToSwatches(
    palette: Record<string, string>,
    prefix: string
): Swatch[] {
    return Object.entries(palette).map(([stop, hex]) => ({
        label: stop,
        hex,
        cssVar: `--p-${prefix}-${stop}`
    }));
}

const colorGroups: ColorGroup[] = [
    {
        title: 'Primary',
        swatches: paletteToSwatches(primary, 'primary')
    },
    {
        title: 'Surface',
        swatches: paletteToSwatches(surface, 'surface')
    },
    ...Object.entries(primitiveColors).map(([name, palette]) => ({
        title: name.charAt(0).toUpperCase() + name.slice(1),
        swatches: paletteToSwatches(palette, name)
    }))
];
</script>
