<template>
    <div class="relative flex h-full grow gap-6">
        <!--
            Panel: overlay over the map below lg, a static column on lg+.
            z-10 must stay low: a higher value (even on a static flex item)
            creates a stacking context above PrimeVue body-appended overlays
            (~z-1001), hiding select/popover dropdowns behind the panel.
        -->
        <div
            class="absolute inset-0 z-10 overflow-hidden bg-surface-100 shadow-xl md:right-auto md:w-[23.375rem] lg:static lg:inset-auto lg:m-0 lg:w-[26.125rem] lg:shrink-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none"
            :class="[
                view === 'panel' ? 'block' : 'hidden lg:block',
                panelClass
            ]"
        >
            <slot name="panel"></slot>
        </div>

        <!--
            Map: always rendered; the panel simply overlays it below lg.
            `isolate` traps the map's internal z-indexes (Leaflet panes,
            z-1000 action buttons) so the z-10 panel can cover them all.
        -->
        <div
            class="relative isolate min-w-0 flex-1 overflow-hidden"
            :class="mapClass"
        >
            <slot name="map"></slot>
        </div>
    </div>
</template>

<script lang="ts">
/** Which pane is visible below the lg breakpoint */
export type PanelMapLayoutView = 'panel' | 'map';
</script>

<script setup lang="ts">
interface PanelMapLayoutProps {
    /** Extra classes for the panel container (e.g. page-specific negative margins) */
    panelClass?: string;
    /** Extra classes for the map container (e.g. page-specific negative margins) */
    mapClass?: string;
}

defineProps<PanelMapLayoutProps>();

/**
 * Panel visibility switch below lg; the map shows by default and the panel
 * opens as an overlay over it. On lg+ the panel and the map are shown side by
 * side as columns and this switch has no effect.
 */
const view = defineModel<PanelMapLayoutView>('view', { default: 'map' });
</script>
