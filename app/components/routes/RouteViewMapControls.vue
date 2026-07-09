<template>
    <div
        class="absolute right-3.5 top-3.5 z-[1000] flex flex-col items-end gap-2"
    >
        <UiMapAction
            icon="tabler:copy"
            :aria-expanded="layersOpen"
            :aria-label="$t('objects.online.map.layers')"
            @click="toggleLayers"
        />

        <UiMapActionGroup>
            <UiMapAction
                icon="tabler:plus"
                :aria-label="$t('objects.online.map.zoomIn')"
                @click="emit('zoomIn')"
            />
            <UiMapAction
                icon="tabler:minus"
                :aria-label="$t('objects.online.map.zoomOut')"
                @click="emit('zoomOut')"
            />
        </UiMapActionGroup>

        <UiMapAction
            icon="tabler:info-circle"
            :aria-expanded="legendOpen"
            :aria-label="$t('objects.online.map.legend')"
            @click="toggleLegend"
        />

        <UiMapAction
            icon="tabler:maximize"
            :aria-label="$t('objects.online.map.fullscreen')"
            @click="emit('fullscreen')"
        />
    </div>

    <!-- Layers popover -->
    <Popover
        ref="layersRef"
        @show="layersOpen = true"
        @hide="layersOpen = false"
    >
        <div class="flex w-72 flex-col gap-2">
            <span class="text-sm font-medium text-surface-900">
                {{ $t('objects.online.map.layerType') }}
            </span>
            <div class="flex items-center gap-4">
                <label
                    for="routeMapLayerStreets"
                    class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                >
                    <RadioButton
                        v-model="layer"
                        input-id="routeMapLayerStreets"
                        value="streets"
                        size="small"
                    />
                    {{ $t('objects.online.map.street') }}
                </label>
                <label
                    for="routeMapLayerSatellite"
                    class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                >
                    <RadioButton
                        v-model="layer"
                        input-id="routeMapLayerSatellite"
                        value="satellite"
                        size="small"
                    />
                    {{ $t('objects.online.map.satellite') }}
                </label>
            </div>
        </div>
    </Popover>

    <!-- Legend popover: point kinds/types of the route timeline -->
    <Popover
        ref="legendRef"
        @show="legendOpen = true"
        @hide="legendOpen = false"
    >
        <div class="flex w-80 flex-col gap-2.5">
            <span class="font-semibold text-surface-950">
                {{ $t('routes.detail.legendTitle') }}
            </span>
            <div
                v-for="meta in ROUTE_VIEW_LEGEND"
                :key="meta.labelKey"
                class="flex items-center gap-2 text-sm text-surface-800"
            >
                <Icon
                    :name="meta.icon"
                    :class="meta.textClass"
                    class="size-5 shrink-0"
                />
                {{ $t(meta.labelKey) }}
            </div>
        </div>
    </Popover>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import { ROUTE_VIEW_LEGEND } from '~/constants/route-view';
import type { LeafletMapLayer } from '~/composables/useLeafletMap';

/**
 * Right-hand control stack of the route detail map: layers popover
 * (street/satellite), zoom in/out, the point-types legend and fullscreen.
 */

const emit = defineEmits<{
    zoomIn: [];
    zoomOut: [];
    fullscreen: [];
}>();

/** Map base layer (street/satellite), two-way bound */
const layer = defineModel<LeafletMapLayer>('layer', { required: true });

const layersRef = ref<InstanceType<typeof Popover> | null>(null);
const legendRef = ref<InstanceType<typeof Popover> | null>(null);
const layersOpen = ref<boolean>(false);
const legendOpen = ref<boolean>(false);

const toggleLayers = (event: MouseEvent): void => {
    layersRef.value?.toggle(event);
};

const toggleLegend = (event: MouseEvent): void => {
    legendRef.value?.toggle(event);
};
</script>
