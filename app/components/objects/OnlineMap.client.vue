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
                    @click="toggleSearch"
                />

                <!-- Mobile: back to the list -->
                <UiMapAction
                    class="lg:hidden"
                    icon="tabler:list"
                    :aria-label="$t('objects.online.listView')"
                    @click="emit('showList')"
                />
            </div>

            <AutoComplete
                v-if="searchOpen"
                v-model="searchModel"
                :suggestions="suggestions"
                option-label="name"
                :placeholder="$t('objects.online.map.searchPlaceholder')"
                :empty-search-message="$t('objects.online.map.searchEmpty')"
                complete-on-focus
                autofocus
                fluid
                class="w-52 sm:w-72"
                @complete="onSearchComplete"
                @option-select="onOptionSelect"
            >
                <template #option="{ option }">
                    <div class="flex min-w-0 items-center gap-2.5">
                        <span
                            class="size-2.5 shrink-0 rounded-full"
                            :style="{
                                background:
                                    ONLINE_STATUS_META[option.status].markerBg
                            }"
                        />
                        <div class="flex min-w-0 flex-col">
                            <span class="truncate text-sm text-surface-900">
                                {{ option.name }}
                            </span>
                            <span class="truncate text-xs text-surface-500">
                                ID: {{ option.vehicleId }} · {{ option.driver }}
                            </span>
                        </div>
                    </div>
                </template>
            </AutoComplete>
        </div>

        <!-- Control stack (top-right) -->
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
                    @click="zoomIn()"
                />
                <UiMapAction
                    icon="tabler:minus"
                    :aria-label="$t('objects.online.map.zoomOut')"
                    @click="zoomOut()"
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
                @click="toggleFullscreen(wrapperRef)"
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
                                v-model="mapLayer"
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
                                v-model="mapLayer"
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
                    <ToggleSwitch v-model="overlays[overlay]" />
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
    </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Popover from 'primevue/popover';
import { ONLINE_MARKER_SVG, ONLINE_STATUS_META } from '~/constants/online';
import { useLeafletMap } from '~/composables/useLeafletMap';
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
const layersRef = ref<InstanceType<typeof Popover> | null>(null);
const legendRef = ref<InstanceType<typeof Popover> | null>(null);
const layersOpen = ref<boolean>(false);
const legendOpen = ref<boolean>(false);

/** Map search box state; model holds the typed string or the picked vehicle */
const searchOpen = ref<boolean>(false);
const searchModel = ref<string | OnlineVehicle>('');
const suggestions = ref<OnlineVehicle[]>([]);

/** Max results shown in the map search dropdown */
const SEARCH_LIMIT = 8;

/** Zoom level the map flies to when a search result is picked */
const SEARCH_FOCUS_ZOOM = 15;

/** Marker layer; created on mount on top of the shared map */
let markersLayer: L.LayerGroup | null = null;

/** Rendered markers by vehicle id, so search can locate and highlight them */
const markerById = new Map<string, L.Marker>();

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
    if (!markersLayer) return;
    markersLayer.clearLayers();
    markerById.clear();
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
        markerById.set(vehicle.id, marker);
    }
};

/**
 * AutoComplete `complete` handler: fills suggestions from the visible fleet,
 * matching name, vehicle id or driver. An empty query lists the first vehicles.
 * @param {{ query: string }} event AutoComplete query event.
 */
const onSearchComplete = (event: { query: string }): void => {
    const q = event.query.trim().toLowerCase();
    const source = q
        ? visibleVehicles.value.filter(
              (v) =>
                  v.name.toLowerCase().includes(q) ||
                  v.vehicleId.toLowerCase().includes(q) ||
                  v.driver.toLowerCase().includes(q)
          )
        : visibleVehicles.value;
    suggestions.value = source.slice(0, SEARCH_LIMIT);
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;

    markersLayer = L.layerGroup().addTo(map);
    renderMarkers();

    // tapping the map dismisses the search box
    map.on('click', closeSearch);
});

/** Markers follow panel filters and group visibility */
watch(visibleVehicles, renderMarkers);

const toggleLayers = (event: MouseEvent): void => {
    layersRef.value?.toggle(event);
};

const toggleLegend = (event: MouseEvent): void => {
    legendRef.value?.toggle(event);
};

/** Closes the search box and clears its model and suggestions */
const closeSearch = (): void => {
    searchOpen.value = false;
    searchModel.value = '';
    suggestions.value = [];
};

/** Toggles the search box open/closed */
const toggleSearch = (): void => {
    if (searchOpen.value) closeSearch();
    else searchOpen.value = true;
};

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
    closeSearch();
};

/**
 * AutoComplete `option-select` handler: focuses the chosen vehicle on the map.
 * @param {{ value: OnlineVehicle }} event AutoComplete selection event.
 */
const onOptionSelect = (event: { value: OnlineVehicle }): void => {
    focusVehicle(event.value);
};
</script>

<style>
/* Unscoped: Leaflet injects marker/tooltip HTML outside Vue's scope attrs. */
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

/* Pulse ring when a search result focuses the marker */
.online-marker-active .online-marker {
    animation: online-marker-pulse 1.2s ease-out;
}

@keyframes online-marker-pulse {
    0% {
        box-shadow:
            0 0 0 0 rgb(59 130 246 / 0.5),
            0 2px 6px rgb(0 0 0 / 0.25);
    }
    70% {
        box-shadow:
            0 0 0 16px rgb(59 130 246 / 0),
            0 2px 6px rgb(0 0 0 / 0.25);
    }
    100% {
        box-shadow:
            0 0 0 0 rgb(59 130 246 / 0),
            0 2px 6px rgb(0 0 0 / 0.25);
    }
}

.online-label {
    background: var(--p-surface-100);
    border: none;
    border-radius: 0.375rem;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
    padding: 0.375rem;
    color: var(--p-surface-900);
    font-size: 0.75rem;
    line-height: 1.4;
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
    background: var(--p-surface-300);
    flex-shrink: 0;
}

.online-label-dim {
    color: var(--p-surface-800);
}
</style>
