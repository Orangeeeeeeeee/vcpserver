<template>
    <div ref="wrapperRef" class="relative size-full bg-surface-100">
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- List toggle + search (top-left) -->
        <div
            class="absolute left-3 top-3 z-[1000] flex flex-col items-start gap-2"
        >
            <div class="flex items-center gap-2">
                <!-- Mobile: back to the zone detail panel -->
                <UiMapAction
                    class="lg:hidden"
                    icon="tabler:list"
                    :aria-label="$t('zones.list.listView')"
                    @click="emit('showPanel')"
                />

                <UiMapAction
                    :icon="searchOpen ? 'tabler:x' : 'tabler:search'"
                    :aria-label="$t('zones.detail.map.search')"
                    :aria-expanded="searchOpen"
                    @click="toggleSearch"
                />
            </div>

            <AutoComplete
                v-if="searchOpen"
                v-model="searchModel"
                :suggestions="suggestions"
                option-label="name"
                :placeholder="$t('zones.detail.map.searchPlaceholder')"
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
                                background: statusColor(option.status)
                            }"
                        />
                        <div class="flex min-w-0 flex-col">
                            <span class="md:truncate text-sm text-surface-900" :title="`${option.name} · ${option.label}`">
                                {{ option.name }} · {{ option.label }}
                            </span>
                            <span
                                class="md:truncate text-xs text-surface-500"
                                :title="$t(`zones.detail.map.statuses.${option.status}`) + (option.driver ? ' · ' + option.driver : '')"
                            >
                                {{
                                    $t(
                                        `zones.detail.map.statuses.${option.status}`
                                    )
                                }}
                                <template v-if="option.driver">
                                    · {{ option.driver }}
                                </template>
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
            <div class="flex w-72 flex-col gap-2">
                <span class="text-sm font-medium text-surface-900">
                    {{ $t('objects.online.map.layerType') }}
                </span>
                <div class="flex items-center gap-4">
                    <label
                        for="zoneDetailMapLayerStreets"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="mapLayer"
                            input-id="zoneDetailMapLayerStreets"
                            value="streets"
                            size="small"
                        />
                        {{ $t('objects.online.map.street') }}
                    </label>
                    <label
                        for="zoneDetailMapLayerSatellite"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="mapLayer"
                            input-id="zoneDetailMapLayerSatellite"
                            value="satellite"
                            size="small"
                        />
                        {{ $t('objects.online.map.satellite') }}
                    </label>
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Popover from 'primevue/popover';
import {
    useLeafletMap,
    type LeafletMapLayer
} from '~/composables/useLeafletMap';
import { useZoneDetailContext } from '~/composables/useZoneStats';
import { primitiveColors, surface } from '~/theme/colors';
import type { ZoneVehicleStatus } from '~/types/zone-stats';

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'zone-detail-map';

/** Max results shown in the map search dropdown */
const SEARCH_LIMIT = 8;

/** Zoom level the map flies to when a search result is picked */
const SEARCH_FOCUS_ZOOM = 12;

/** Solid marker background per in-zone vehicle status */
const STATUS_MARKER_BG: Record<ZoneVehicleStatus, string> = {
    moving: primitiveColors.green['600'],
    paused: surface['700'],
    alert: primitiveColors.red['500']
};

/**
 * Inline SVG bodies for the Leaflet divIcon markers, wrapped at runtime into
 * a 24×24 viewBox <svg>. Fills/strokes use currentColor (white via the
 * marker wrapper): moving — play triangle, paused — two vertical bars,
 * alert — crossed-out engine.
 */
const ZONE_VEHICLE_MARKER_SVG: Record<ZoneVehicleStatus, string> = {
    moving: '<path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16l13 -8z"/>',
    paused: '<path fill="currentColor" d="M9 4H7a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm8 0h-2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>',
    alert: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10v6m9-11v3m-2-3h4m-9 8H3m13 3h-1v2a1 1 0 0 1-1 1h-3.465a1 1 0 0 1-.832-.445L8 16H6v-6h2l.99-.99M12 8h1.382a1 1 0 0 1 .894.553l1.448 2.894a1 1 0 0 0 .894.553H18v-2h2a1 1 0 0 1 1 1v6M3 3l18 18"/>'
};

/** An in-zone vehicle joined with its catalog data for markers and search */
interface ZoneVehicleEntry {
    /** Vehicle id (marker/search identity) */
    vehicleId: string;
    /** Vehicle name / identifier, e.g. "TRK-112" */
    name: string;
    /** Display label, e.g. "MAN TGX 18.480" */
    label: string;
    /** Owning company, e.g. "Logistics UA" */
    company: string;
    /** Assigned driver name; empty when the vehicle has no driver */
    driver: string;
    status: ZoneVehicleStatus;
    /** Marker position, `[lat, lng]` */
    position: [number, number];
}

const emit = defineEmits<{
    /** Mobile «back to the zone detail panel» toggle */
    showPanel: [];
}>();

/** Shared page state: the viewed zone and its (mock) statistics */
const { zone, stats } = useZoneDetailContext();

const { vehicles } = useVehicles();
const { drivers } = useDrivers();

/** Map base layer, local to the detail map */
const mapLayer = ref<LeafletMapLayer>('streets');

/** Shared Leaflet + Mapbox tiles plumbing (creation, layer switch, cleanup) */
const { init, getMap, zoomIn, zoomOut, toggleFullscreen } = useLeafletMap({
    containerId: MAP_CONTAINER_ID,
    mapLayer
});

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');
const layersRef = ref<InstanceType<typeof Popover> | null>(null);
const layersOpen = ref<boolean>(false);

/** Map search box state; model holds the typed string or the picked entry */
const searchOpen = ref<boolean>(false);
const searchModel = ref<string | ZoneVehicleEntry>('');
const suggestions = ref<ZoneVehicleEntry[]>([]);

/** Vehicle markers layer; created on mount on top of the shared map */
let markersLayer: L.LayerGroup | null = null;

/** Rendered markers by vehicle id, so search can locate and highlight them */
const markerById = new Map<string, L.Marker>();

/**
 * Marker background color of an in-zone vehicle status (typed template
 * accessor for the search option dot).
 * @param {ZoneVehicleStatus} status In-zone vehicle status.
 * @returns {string} Hex color of the marker background.
 */
const statusColor = (status: ZoneVehicleStatus): string =>
    STATUS_MARKER_BG[status];

/** Escapes user-facing text inserted into Leaflet HTML strings */
const esc = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * In-zone vehicles joined with the vehicle catalog and driver names.
 * Vehicles missing from the catalog are skipped.
 */
const zoneVehicles = computed<ZoneVehicleEntry[]>(() =>
    stats.value.vehiclesInZone.flatMap((inZone) => {
        const vehicle = vehicles.value.find((v) => v.id === inZone.vehicleId);
        if (!vehicle) return [];
        const driver = vehicle.driverId
            ? drivers.value.find((d) => d.id === vehicle.driverId)
            : undefined;
        return [
            {
                vehicleId: inZone.vehicleId,
                name: vehicle.name,
                label: `${vehicle.brand} ${vehicle.model}`,
                company: vehicle.company,
                driver: driver?.name ?? '',
                status: inZone.status,
                position: inZone.position
            }
        ];
    })
);

/**
 * Builds the colored square divIcon of an in-zone vehicle.
 * @param {ZoneVehicleEntry} entry Vehicle to render.
 * @returns {L.DivIcon} Leaflet div icon.
 */
const markerIcon = (entry: ZoneVehicleEntry): L.DivIcon =>
    L.divIcon({
        className: 'zone-vehicle-marker-wrap',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        tooltipAnchor: [0, 18],
        html: `<div class="zone-vehicle-marker" style="background:${STATUS_MARKER_BG[entry.status]}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">${ZONE_VEHICLE_MARKER_SVG[entry.status]}</svg></div>`
    });

/**
 * Builds the permanent white label shown under a marker: company · id,
 * brand + model and the driver name (skipped when unassigned).
 * @param {ZoneVehicleEntry} entry Vehicle to label.
 * @returns {string} Escaped tooltip HTML string.
 */
const markerLabel = (entry: ZoneVehicleEntry): string => {
    const rows = [
        `<span>${esc(entry.company)}</span><span class="zone-vehicle-label-dim">· ID: ${esc(entry.name)}</span>`,
        esc(entry.label)
    ];
    if (entry.driver) rows.push(esc(entry.driver));
    return rows
        .map((row) => `<div class="zone-vehicle-label-row">${row}</div>`)
        .join('');
};

/** Re-renders all markers from the vehicles currently inside the zone */
const renderMarkers = (): void => {
    if (!markersLayer) return;
    markersLayer.clearLayers();
    markerById.clear();
    for (const entry of zoneVehicles.value) {
        const marker = L.marker(entry.position, { icon: markerIcon(entry) });
        marker.bindTooltip(markerLabel(entry), {
            permanent: true,
            direction: 'bottom',
            className: 'zone-vehicle-label',
            opacity: 1
        });
        markersLayer.addLayer(marker);
        markerById.set(entry.vehicleId, marker);
    }
};

/**
 * Zone shape styling in the zone's accent color.
 * @returns {L.PathOptions} Leaflet path options.
 */
const zoneStyle = (): L.PathOptions => {
    const color = primitiveColors[zone.color]['500'];
    return { color, weight: 2, fillColor: color, fillOpacity: 0.2 };
};

/**
 * Creates the Leaflet layer for the zone geometry (read-only, no editing).
 * @returns {L.Polygon | L.Circle} Polygon (also rectangles) or circle layer.
 */
const createZoneLayer = (): L.Polygon | L.Circle =>
    zone.geometry.kind === 'circle'
        ? L.circle(zone.geometry.center, {
              ...zoneStyle(),
              radius: zone.geometry.radius
          })
        : L.polygon(zone.geometry.points, zoneStyle());

const toggleLayers = (event: MouseEvent): void => {
    layersRef.value?.toggle(event);
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
 * AutoComplete `complete` handler: fills suggestions from the vehicles inside
 * the zone, matching name, brand/model or driver. An empty query lists the
 * first vehicles.
 * @param {{ query: string }} event AutoComplete query event.
 */
const onSearchComplete = (event: { query: string }): void => {
    const q = event.query.trim().toLowerCase();
    const source = q
        ? zoneVehicles.value.filter(
              (v) =>
                  v.name.toLowerCase().includes(q) ||
                  v.label.toLowerCase().includes(q) ||
                  v.driver.toLowerCase().includes(q)
          )
        : zoneVehicles.value;
    suggestions.value = source.slice(0, SEARCH_LIMIT);
};

/**
 * Flies the map to a vehicle, pulses its marker and closes the search box.
 * @param {ZoneVehicleEntry} entry Selected search result.
 */
const focusVehicle = (entry: ZoneVehicleEntry): void => {
    getMap()?.flyTo(entry.position, SEARCH_FOCUS_ZOOM, { duration: 0.75 });
    const element = markerById.get(entry.vehicleId)?.getElement();
    if (element) {
        element.classList.remove('zone-vehicle-marker-active');
        // force reflow so the pulse animation restarts on repeat picks
        void element.offsetWidth;
        element.classList.add('zone-vehicle-marker-active');
    }
    closeSearch();
};

/**
 * AutoComplete `option-select` handler: focuses the chosen vehicle on the map.
 * @param {{ value: ZoneVehicleEntry }} event AutoComplete selection event.
 */
const onOptionSelect = (event: { value: ZoneVehicleEntry }): void => {
    focusVehicle(event.value);
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;

    // zone shape below the markers, then fit the view around it
    const zoneLayer = createZoneLayer().addTo(map);
    map.fitBounds(zoneLayer.getBounds(), { padding: [40, 40] });

    markersLayer = L.layerGroup().addTo(map);
    renderMarkers();

    // tapping the map dismisses the search box
    map.on('click', closeSearch);
});

watch(zoneVehicles, renderMarkers);
</script>

<style>
/* Unscoped: Leaflet injects marker/tooltip HTML outside Vue's scope attrs. */
.zone-vehicle-marker-wrap {
    background: transparent;
    border: none;
}

.zone-vehicle-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
    color: #fff;
    box-shadow: 0 2px 6px rgb(0 0 0 / 0.25);
}

/* Pulse ring when a search result focuses the marker */
.zone-vehicle-marker-active .zone-vehicle-marker {
    animation: zone-vehicle-marker-pulse 1.2s ease-out;
}

@keyframes zone-vehicle-marker-pulse {
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

.zone-vehicle-label {
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

.zone-vehicle-label::before {
    display: none;
}

.zone-vehicle-label-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.zone-vehicle-label-row::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 9999px;
    background: var(--p-surface-300);
    flex-shrink: 0;
}

.zone-vehicle-label-dim {
    color: var(--p-surface-800);
}
</style>
