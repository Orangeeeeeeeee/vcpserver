<template>
    <div :id="HISTORY_MAP_WRAPPER_ID" class="relative size-full bg-surface-100">
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- Panel toggle + search (top-left) -->
        <div
            class="absolute left-3 top-3 z-[1000] flex flex-col items-start gap-2"
        >
            <div class="flex items-center gap-2">
                <!-- Below lg: back to the history panel -->
                <UiMapAction
                    class="lg:hidden"
                    icon="tabler:list-details"
                    :aria-label="$t('objects.online.listView')"
                    @click="emit('showPanel')"
                />

                <UiMapAction
                    :icon="searchOpen ? 'tabler:x' : 'tabler:search'"
                    :aria-label="$t('objects.online.map.search')"
                    :aria-expanded="searchOpen"
                    @click="searchOpen = !searchOpen"
                />
            </div>

            <OnlineMapSearch
                v-if="searchOpen"
                :vehicles="fleet"
                @select="onSearchSelect"
            />
        </div>

        <OnlineMapControls
            v-model:layer="mapLayer"
            :overlays="overlays"
            @zoom-in="zoomIn()"
            @zoom-out="zoomOut()"
            @fullscreen="toggleFullscreen(wrapperEl())"
            @toggle-overlay="(key, value) => (overlays[key] = value)"
        />

        <!-- Video: open button, or the active-camera previews (md+) -->
        <div class="absolute bottom-4 left-3 z-[1000] max-w-[70%]">
            <Button
                v-if="cameras.length && !videoOpen"
                severity="contrast"
                :label="$t('objects.vehicles.detail.video')"
                @click="videoOpen = true"
            >
                <template #icon>
                    <Icon name="tabler:player-play" class="size-4" />
                </template>
            </Button>

            <VehicleCameraPreviews
                v-else-if="videoOpen"
                :cameras="activeCameras"
            />
        </div>

        <!-- Telemetry panel toggle (bottom-right) -->
        <Button
            v-if="!telemetryOpen"
            class="absolute bottom-4 right-3 z-[1000]"
            severity="contrast"
            :label="$t('objects.vehicles.detail.sections.telemetry')"
            @click="telemetryOpen = true"
        >
            <template #icon>
                <Icon name="tabler:graph" class="size-4" />
            </template>
        </Button>
    </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { primitiveColors } from '~/theme/colors';
import { useLeafletMap } from '~/composables/useLeafletMap';
import {
    useVehicleHistoryContext,
    HISTORY_MAP_WRAPPER_ID
} from '~/composables/useVehicleHistory';
import type { OnlineVehicle } from '~/types/online';
import { ROUTES } from '~/constants/routes';

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'vehicle-history-map';

/** Route line color (the blue polyline from the mockup) */
const ROUTE_COLOR = primitiveColors.sky['600'];

const emit = defineEmits<{
    /** Below lg: open the history panel overlay */
    showPanel: [];
}>();

const {
    fleet,
    history,
    cameras,
    videoOpen,
    activeCameras,
    telemetryOpen,
    mapLayer,
    overlays
} = useVehicleHistoryContext();

/** Shared Leaflet + Mapbox tiles plumbing (creation, layer switch, cleanup) */
const { init, getMap, zoomIn, zoomOut, toggleFullscreen } = useLeafletMap({
    containerId: MAP_CONTAINER_ID,
    mapLayer
});

/** Fullscreen target (the wrapper with the video previews) */
const wrapperEl = (): HTMLElement | null =>
    document.getElementById(HISTORY_MAP_WRAPPER_ID);

/** Whether the map search box is open */
const searchOpen = ref<boolean>(false);

/** Route layer (polyline + A/B endpoint markers) */
let routeLayer: L.LayerGroup | null = null;

/** Builds the round A/B endpoint divIcon */
const endpointIcon = (letter: string): L.DivIcon =>
    L.divIcon({
        className: 'history-endpoint-wrap',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `<div class="history-endpoint">${letter}</div>`
    });

/** Re-draws the route polyline with its endpoints and fits the view */
const renderRoute = (): void => {
    const map = getMap();
    if (!map) return;
    routeLayer?.remove();

    const route = history.value.route;
    const polyline = L.polyline(route, {
        color: ROUTE_COLOR,
        weight: 4,
        opacity: 0.9
    });
    routeLayer = L.layerGroup([polyline]);

    const start = route[0];
    const end = route[route.length - 1];
    if (start && end) {
        routeLayer.addLayer(L.marker(start, { icon: endpointIcon('A') }));
        routeLayer.addLayer(L.marker(end, { icon: endpointIcon('B') }));
    }

    routeLayer.addTo(map);
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;

    renderRoute();

    // tapping the map dismisses the search box
    map.on('click', () => (searchOpen.value = false));
});

/** Route follows period switches */
watch(history, renderRoute);

/**
 * Search pick: opens the chosen vehicle's history page.
 * @param {OnlineVehicle} picked Selected search result.
 */
const onSearchSelect = (picked: OnlineVehicle): void => {
    searchOpen.value = false;
    void navigateTo(ROUTES.VEHICLE_HISTORY(picked.id));
};
</script>

<style>
/* Unscoped: Leaflet injects the endpoint HTML outside Vue's scope attrs. */
.history-endpoint-wrap {
    background: transparent;
    border: none;
}

.history-endpoint {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    background: #ef4444;
    border: 2px solid #fff;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 2px 6px rgb(0 0 0 / 0.3);
}
</style>
