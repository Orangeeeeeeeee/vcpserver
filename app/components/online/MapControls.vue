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
        <div class="flex w-72 flex-col gap-3">
            <div class="flex flex-col gap-2">
                <span class="text-sm font-medium text-surface-900">
                    {{ $t('objects.online.map.layerType') }}
                </span>
                <div class="flex items-center gap-4">
                    <label
                        for="mapLayerStreets"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="layer"
                            input-id="mapLayerStreets"
                            value="streets"
                            size="small"
                        />
                        {{ $t('objects.online.map.street') }}
                    </label>
                    <label
                        for="mapLayerSatellite"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="layer"
                            input-id="mapLayerSatellite"
                            value="satellite"
                            size="small"
                        />
                        {{ $t('objects.online.map.satellite') }}
                    </label>
                </div>
            </div>
            <div
                v-for="overlay in OVERLAY_KEYS"
                :key="overlay"
                class="flex items-center justify-between gap-2 border-t border-surface-200 pt-3"
            >
                <span class="text-sm text-surface-900">
                    {{ $t(`objects.online.map.overlays.${overlay}`) }}
                </span>
                <ToggleSwitch
                    :model-value="overlays[overlay]"
                    @update:model-value="emit('toggleOverlay', overlay, $event)"
                />
            </div>
        </div>
    </Popover>

    <!-- Legend popover -->
    <Popover
        ref="legendRef"
        @show="legendOpen = true"
        @hide="legendOpen = false"
    >
        <div class="flex w-80 flex-col gap-2.5">
            <span class="font-semibold text-surface-950">
                {{ $t('objects.online.map.legendTitle') }}
            </span>
            <div
                v-for="(meta, status) in ONLINE_STATUS_META"
                :key="status"
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
import { ONLINE_STATUS_META } from '~/constants/online';
import type {
    OnlineMapLayer,
    OnlineMapOverlays
} from '~/composables/useOnlineFleet';

/**
 * Shared right-hand control stack of the online maps (fleet + vehicle detail):
 * layers popover, zoom in/out, statuses legend and fullscreen.
 */

/** Overlay toggle keys in the layers popover display order */
const OVERLAY_KEYS: (keyof OnlineMapOverlays)[] = [
    'traffic',
    'geoZones',
    'precipitation',
    'temperature',
    'wind'
];

interface MapControlsProps {
    /** Mock overlay toggles shown in the layers popover */
    overlays: OnlineMapOverlays;
}

defineProps<MapControlsProps>();

const emit = defineEmits<{
    zoomIn: [];
    zoomOut: [];
    fullscreen: [];
    /** Overlay switch flip; the owner mutates its overlays state */
    toggleOverlay: [key: keyof OnlineMapOverlays, value: boolean];
}>();

/** Map base layer (street/satellite), two-way bound */
const layer = defineModel<OnlineMapLayer>('layer', { required: true });

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
