<template>
    <div ref="wrapperRef" class="relative size-full bg-surface-100">
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- Search stub (top-left) -->
        <button
            type="button"
            class="online-map-btn absolute left-3 top-3"
            :aria-label="$t('objects.online.map.search')"
            @click="onSearchStub"
        >
            <Icon name="tabler:search" class="size-5" />
        </button>

        <!-- Control stack (top-right) -->
        <div class="absolute right-3 top-3 flex flex-col items-end gap-2">
            <button
                type="button"
                class="online-map-btn"
                :aria-expanded="layersOpen"
                :aria-label="$t('objects.online.map.layers')"
                @click="toggleLayers"
            >
                <Icon name="tabler:copy" class="size-5" />
            </button>

            <div class="flex flex-col overflow-hidden rounded-lg border border-surface-300 bg-surface-50 shadow-sm">
                <button
                    type="button"
                    class="flex size-9 cursor-pointer items-center justify-center text-surface-800 transition-colors hover:bg-surface-200"
                    :aria-label="$t('objects.online.map.zoomIn')"
                    @click="map?.zoomIn()"
                >
                    <Icon name="tabler:plus" class="size-5" />
                </button>
                <button
                    type="button"
                    class="flex size-9 cursor-pointer items-center justify-center border-t border-surface-300 text-surface-800 transition-colors hover:bg-surface-200"
                    :aria-label="$t('objects.online.map.zoomOut')"
                    @click="map?.zoomOut()"
                >
                    <Icon name="tabler:minus" class="size-5" />
                </button>
            </div>

            <button
                type="button"
                class="online-map-btn"
                :aria-expanded="legendOpen"
                :aria-label="$t('objects.online.map.legend')"
                @click="toggleLegend"
            >
                <Icon name="tabler:info-circle" class="size-5" />
            </button>

            <button
                type="button"
                class="online-map-btn"
                :aria-label="$t('objects.online.map.fullscreen')"
                @click="toggleFullscreen"
            >
                <Icon name="tabler:maximize" class="size-5" />
            </button>
        </div>

        <!-- Layers popover -->
        <Popover ref="layersRef" @show="layersOpen = true" @hide="layersOpen = false">
            <div class="flex w-72 flex-col gap-3">
                <div class="flex flex-col gap-2">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.online.map.layerType') }}
                    </span>
                    <div class="flex items-center gap-4">
                        <label
                            class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                        >
                            <RadioButton
                                v-model="mapLayer"
                                value="streets"
                                size="small"
                            />
                            {{ $t('objects.online.map.street') }}
                        </label>
                        <label
                            class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                        >
                            <RadioButton
                                v-model="mapLayer"
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
                    <ToggleSwitch v-model="overlays[overlay]" />
                </div>
            </div>
        </Popover>

        <!-- Legend popover -->
        <Popover ref="legendRef" @show="legendOpen = true" @hide="legendOpen = false">
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
    </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Popover from 'primevue/popover';
import { useToast } from 'primevue/usetoast';
import { ONLINE_MARKER_SVG, ONLINE_STATUS_META } from '~/constants/online';
import { useOnlineFleetContext } from '~/composables/useOnlineFleet';
import type { OnlineMapOverlays } from '~/composables/useOnlineFleet';
import type { OnlineVehicle } from '~/types/online';

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'online-map';

/** Overlay toggle keys in the layers popover display order */
const OVERLAY_KEYS: (keyof OnlineMapOverlays)[] = [
    'traffic',
    'geoZones',
    'precipitation',
    'temperature',
    'wind'
];

const { t } = useI18n();
const toast = useToast();
const { mapboxToken } = useRuntimeConfig().public;
const { visibleVehicles, groups, mapLayer, overlays } =
    useOnlineFleetContext();

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');
const layersRef = ref<InstanceType<typeof Popover> | null>(null);
const legendRef = ref<InstanceType<typeof Popover> | null>(null);
const layersOpen = ref<boolean>(false);
const legendOpen = ref<boolean>(false);

/** Leaflet instance; created on mount, destroyed on unmount */
let map: L.Map | null = null;
let tileLayer: L.TileLayer | null = null;
let markersLayer: L.LayerGroup | null = null;

/** Mapbox Static Tiles URL for the given style id */
const tilesUrl = (styleId: string): string =>
    `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/512/{z}/{x}/{y}@2x?access_token=${mapboxToken}`;

/** Group name lookup for the marker labels */
const groupNameById = new Map(groups.map((g) => [g.id, g.name]));

/** Escapes user-facing text inserted into Leaflet HTML strings */
const esc = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Builds the colored square divIcon for a vehicle */
const markerIcon = (vehicle: OnlineVehicle): L.DivIcon => {
    const meta = ONLINE_STATUS_META[vehicle.status];
    return L.divIcon({
        className: 'online-marker-wrap',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        tooltipAnchor: [0, 22],
        html: `<div class="online-marker" style="background:${meta.markerBg}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">${ONLINE_MARKER_SVG[vehicle.status]}</svg></div>`
    });
};

/** Builds the permanent white label shown under a marker */
const markerLabel = (vehicle: OnlineVehicle): string => {
    const group = esc(groupNameById.get(vehicle.groupId) ?? '');
    return `<div class="online-label-row"><span>${group}</span><span class="online-label-dim">· ID: ${esc(vehicle.vehicleId)}</span></div><div class="online-label-row">${esc(vehicle.name)}</div><div class="online-label-row">${esc(vehicle.driver)}</div>`;
};

/** Re-renders all markers from the currently visible vehicles */
const renderMarkers = (): void => {
    if (!map || !markersLayer) return;
    markersLayer.clearLayers();
    for (const vehicle of visibleVehicles.value) {
        const marker = L.marker([vehicle.lat, vehicle.lng], {
            icon: markerIcon(vehicle)
        });
        marker.bindTooltip(markerLabel(vehicle), {
            permanent: true,
            direction: 'bottom',
            className: 'online-label',
            opacity: 1
        });
        markersLayer.addLayer(marker);
    }
};

onMounted(async (): Promise<void> => {
    await nextTick();
    const container = document.getElementById(MAP_CONTAINER_ID);
    if (!container || !mapboxToken) {
        console.warn('OnlineMap: missing map container or Mapbox token');
        return;
    }

    // lat, lng — Ukraine fits the viewport at this zoom (per the mockup)
    map = L.map(container, { zoomControl: false }).setView([49.3, 31.5], 6);

    // Mapbox Static Tiles API (512px tiles need zoomOffset -1 in Leaflet)
    tileLayer = L.tileLayer(
        tilesUrl(mapLayer.value === 'satellite' ? 'satellite-v9' : 'streets-v12'),
        {
            tileSize: 512,
            zoomOffset: -1,
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
    renderMarkers();

    // re-measure once the container has its final layout size
    requestAnimationFrame(() => map?.invalidateSize());
});

/** Markers follow panel filters and group visibility */
watch(visibleVehicles, renderMarkers);

/** Street ↔ satellite switch swaps the Static Tiles style */
watch(mapLayer, (layer): void => {
    tileLayer?.setUrl(
        tilesUrl(layer === 'satellite' ? 'satellite-v9' : 'streets-v12')
    );
});

onUnmounted((): void => {
    map?.remove();
    map = null;
});

const toggleLayers = (event: MouseEvent): void => {
    layersRef.value?.toggle(event);
};

const toggleLegend = (event: MouseEvent): void => {
    legendRef.value?.toggle(event);
};

/** Browser Fullscreen API on the map wrapper */
const toggleFullscreen = (): void => {
    if (document.fullscreenElement) {
        void document.exitFullscreen();
        return;
    }
    void wrapperRef.value?.requestFullscreen();
};

/** Map search is not designed yet */
const onSearchStub = (): void => {
    toast.add({
        severity: 'info',
        summary: t('common.inDevelopment'),
        life: 2000
    });
};
</script>

<style>
/* Unscoped: Leaflet injects marker/tooltip HTML outside Vue's scope attrs. */
.online-map-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    border: 1px solid var(--p-surface-300);
    background: var(--p-surface-50);
    color: var(--p-surface-800);
    cursor: pointer;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
    transition: background-color 0.2s;
    z-index: 1000;
}

.online-map-btn:hover {
    background: var(--p-surface-200);
}

.online-marker-wrap {
    background: transparent;
    border: none;
}

.online-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 0.625rem;
    color: #fff;
    box-shadow: 0 2px 6px rgb(0 0 0 / 0.25);
}

.online-label {
    background: #fff;
    border: none;
    border-radius: 0.375rem;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
    padding: 0.375rem 0.625rem;
    color: var(--p-surface-900);
    font-size: 0.75rem;
    line-height: 1.35;
    white-space: nowrap;
}

.online-label::before {
    display: none;
}

.online-label-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.online-label-row::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 9999px;
    background: var(--p-surface-400);
    flex-shrink: 0;
}

.online-label-dim {
    color: var(--p-surface-600);
}
</style>
