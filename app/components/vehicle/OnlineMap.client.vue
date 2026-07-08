<template>
    <div :id="VEHICLE_MAP_WRAPPER_ID" class="relative size-full bg-surface-100">
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- Panel toggle + search + follow (top-left) -->
        <div
            class="absolute left-3 top-3 z-[1000] flex flex-col items-start gap-2"
        >
            <div class="flex items-center gap-2">
                <!-- Below lg: back to the info panel -->
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

                <Button
                    severity="contrast"
                    size="small"
                    :aria-pressed="following"
                    :label="$t('objects.vehicles.detail.follow')"
                    @click="toggleFollow"
                >
                    <template v-if="following" #icon>
                        <Icon name="tabler:check" class="size-4" />
                    </template>
                </Button>
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
                v-if="detail.cameras.length && !videoOpen"
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
import {
    useVehicleOnlineContext,
    VEHICLE_MAP_WRAPPER_ID
} from '~/composables/useVehicleOnline';
import type { OnlineVehicle } from '~/types/online';
import { ROUTES } from '~/constants/routes';

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'vehicle-online-map';

/** Initial zoom around the viewed vehicle (regional overview, per the mockup) */
const INITIAL_ZOOM = 7;

const emit = defineEmits<{
    /** Below lg: open the info panel overlay */
    showPanel: [];
}>();

const {
    vehicle,
    fleet,
    groupName,
    detail,
    videoOpen,
    activeCameras,
    following,
    mapLayer,
    overlays
} = useVehicleOnlineContext();

/** Shared Leaflet + Mapbox tiles plumbing (creation, layer switch, cleanup) */
const { init, getMap, zoomIn, zoomOut, toggleFullscreen } = useLeafletMap({
    containerId: MAP_CONTAINER_ID,
    mapLayer,
    center: [vehicle.value.lat, vehicle.value.lng],
    zoom: INITIAL_ZOOM
});

/** Fullscreen target (the wrapper with the video previews) */
const wrapperEl = (): HTMLElement | null =>
    document.getElementById(VEHICLE_MAP_WRAPPER_ID);

/** Whether the map search box is open */
const searchOpen = ref<boolean>(false);

/** The single vehicle marker; created on mount */
let marker: L.Marker | null = null;

/** (Re)places the vehicle marker with its permanent label */
const renderMarker = (): void => {
    const map = getMap();
    if (!map) return;
    marker?.remove();
    marker = L.marker([vehicle.value.lat, vehicle.value.lng], {
        icon: onlineMarkerIcon(vehicle.value)
    });
    marker.bindTooltip(onlineMarkerLabel(vehicle.value, groupName.value), {
        permanent: true,
        direction: 'bottom',
        className: 'online-label',
        opacity: 1
    });
    marker.addTo(map);
};

/** Centers the map on the vehicle, keeping the current zoom */
const centerOnVehicle = (): void => {
    getMap()?.flyTo([vehicle.value.lat, vehicle.value.lng], undefined, {
        duration: 0.75
    });
};

/** «Слідкувати» toggle: recenters on the vehicle when turned on */
const toggleFollow = (): void => {
    following.value = !following.value;
    if (following.value) centerOnVehicle();
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;

    renderMarker();

    // tapping the map dismisses the search box
    map.on('click', () => (searchOpen.value = false));
});

/** Marker and view follow vehicle switches (search picks another vehicle) */
watch(vehicle, () => {
    renderMarker();
    centerOnVehicle();
});

/**
 * Search pick: navigates to the chosen vehicle's detail page.
 * @param {OnlineVehicle} picked Selected search result.
 */
const onSearchSelect = (picked: OnlineVehicle): void => {
    searchOpen.value = false;
    void navigateTo(ROUTES.VEHICLE_DETAIL(picked.id));
};
</script>
