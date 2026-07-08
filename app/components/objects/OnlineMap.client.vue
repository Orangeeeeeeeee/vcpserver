<template>
    <div ref="wrapperRef" class="relative size-full bg-surface-100">
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- Search + mobile list toggle (top-left) -->
        <div
            class="absolute left-3 top-3 z-[1000] flex flex-col items-start gap-2"
        >
            <div class="flex items-center gap-2">
                <UiMapAction
                    :icon="searchOpen ? 'tabler:x' : 'tabler:search'"
                    :aria-label="$t('objects.online.map.search')"
                    :aria-expanded="searchOpen"
                    @click="searchOpen = !searchOpen"
                />

                <!-- Mobile: back to the list -->
                <UiMapAction
                    class="lg:hidden"
                    icon="tabler:list"
                    :aria-label="$t('objects.online.listView')"
                    @click="emit('showList')"
                />
            </div>

            <OnlineMapSearch
                v-if="searchOpen"
                :vehicles="visibleVehicles"
                @select="focusVehicle"
            />
        </div>

        <OnlineMapControls
            v-model:layer="mapLayer"
            :overlays="overlays"
            @zoom-in="zoomIn()"
            @zoom-out="zoomOut()"
            @fullscreen="toggleFullscreen(wrapperRef)"
            @toggle-overlay="(key, value) => (overlays[key] = value)"
        />
    </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    onlineMarkerIcon,
    onlineMarkerLabel
} from '~/components/online/markers';
import { useLeafletMap } from '~/composables/useLeafletMap';
import { useOnlineFleetContext } from '~/composables/useOnlineFleet';
import type { OnlineVehicle } from '~/types/online';

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'online-map';

const emit = defineEmits<{
    /** Mobile «back to the list» toggle */
    showList: [];
}>();

const { visibleVehicles, groups, mapLayer, overlays } = useOnlineFleetContext();

/** Shared Leaflet + Mapbox tiles plumbing (creation, layer switch, cleanup) */
const { init, getMap, zoomIn, zoomOut, toggleFullscreen } = useLeafletMap({
    containerId: MAP_CONTAINER_ID,
    mapLayer
});

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');

/** Whether the map search box is open */
const searchOpen = ref<boolean>(false);

/** Zoom level the map flies to when a search result is picked */
const SEARCH_FOCUS_ZOOM = 15;

/** Marker layer; created on mount on top of the shared map */
let markersLayer: L.LayerGroup | null = null;

/** Rendered markers by vehicle id, so search can locate and highlight them */
const markerById = new Map<string, L.Marker>();

/** Group name lookup for the marker labels */
const groupNameById = new Map(groups.map((g) => [g.id, g.name]));

/** Re-renders all markers from the currently visible vehicles */
const renderMarkers = (): void => {
    if (!markersLayer) return;
    markersLayer.clearLayers();
    markerById.clear();
    for (const vehicle of visibleVehicles.value) {
        const marker = L.marker([vehicle.lat, vehicle.lng], {
            icon: onlineMarkerIcon(vehicle)
        });
        marker.bindTooltip(
            onlineMarkerLabel(
                vehicle,
                groupNameById.get(vehicle.groupId) ?? ''
            ),
            {
                permanent: true,
                direction: 'bottom',
                className: 'online-label',
                opacity: 1
            }
        );
        markersLayer.addLayer(marker);
        markerById.set(vehicle.id, marker);
    }
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;

    markersLayer = L.layerGroup().addTo(map);
    renderMarkers();

    // tapping the map dismisses the search box
    map.on('click', () => (searchOpen.value = false));
});

/** Markers follow panel filters and group visibility */
watch(visibleVehicles, renderMarkers);

/**
 * Flies the map to a vehicle, pulses its marker and closes the search box.
 * @param {OnlineVehicle} vehicle Selected search result.
 */
const focusVehicle = (vehicle: OnlineVehicle): void => {
    getMap()?.flyTo([vehicle.lat, vehicle.lng], SEARCH_FOCUS_ZOOM, {
        duration: 0.75
    });
    const element = markerById.get(vehicle.id)?.getElement();
    if (element) {
        element.classList.remove('online-marker-active');
        // force reflow so the pulse animation restarts on repeat picks
        void element.offsetWidth;
        element.classList.add('online-marker-active');
    }
    searchOpen.value = false;
};
</script>
