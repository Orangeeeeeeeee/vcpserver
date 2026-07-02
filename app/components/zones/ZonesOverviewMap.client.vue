<template>
    <div ref="wrapperRef" class="relative size-full bg-surface-100">
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- List toggle + search (top-left) -->
        <div
            class="absolute left-3 top-3 z-[1000] flex flex-col items-start gap-2"
        >
            <div class="flex items-center gap-2">
                <!-- Mobile: back to the zones list panel -->
                <UiMapAction
                    class="lg:hidden"
                    icon="tabler:list"
                    :aria-label="$t('zones.list.listView')"
                    @click="emit('showPanel')"
                />

                <UiMapAction
                    :icon="searchOpen ? 'tabler:x' : 'tabler:search'"
                    :aria-label="$t('objects.online.map.search')"
                    :aria-expanded="searchOpen"
                    @click="toggleSearch"
                />
            </div>

            <AutoComplete
                v-if="searchOpen"
                v-model="searchModel"
                :suggestions="suggestions"
                option-label="name"
                :placeholder="$t('zones.list.map.searchPlaceholder')"
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
                        <Icon
                            :name="shapeIcon(option)"
                            class="size-4 shrink-0"
                            :style="{ color: zoneColor(option) }"
                        />
                        <div class="flex min-w-0 flex-col">
                            <span class="truncate text-sm text-surface-900">
                                {{ option.name }}
                            </span>
                            <span class="truncate text-xs text-surface-500">
                                {{ option.companies.join(', ') }}
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
                        for="zonesOverviewMapLayerStreets"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="mapLayer"
                            input-id="zonesOverviewMapLayerStreets"
                            value="streets"
                            size="small"
                        />
                        {{ $t('objects.online.map.street') }}
                    </label>
                    <label
                        for="zonesOverviewMapLayerSatellite"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="mapLayer"
                            input-id="zonesOverviewMapLayerSatellite"
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
import { useLeafletMap } from '~/composables/useLeafletMap';
import { useZonesOverviewContext } from '~/composables/useZonesOverview';
import { ZONE_SHAPE_OPTIONS, ZONE_TYPE_OPTIONS } from '~/constants/zones';
import { primitiveColors } from '~/theme/colors';
import type { Zone } from '~/types/zone';

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'zones-overview-map';

/** Rendered zone shape kinds; rectangles are L.Rectangle extends L.Polygon */
type ZoneLayer = L.Polygon | L.Circle;

/** Max results shown in the map search dropdown */
const SEARCH_LIMIT = 8;

const emit = defineEmits<{
    /** Mobile «back to the zones list panel» toggle */
    showPanel: [];
}>();

const { t } = useI18n();

/** Shared page state: zones, selection and the map base layer */
const { zones, selectedZoneId, selectZone, mapLayer } =
    useZonesOverviewContext();

/** Shared Leaflet + Mapbox tiles plumbing (creation, layer switch, cleanup) */
const { init, getMap, zoomIn, zoomOut, toggleFullscreen } = useLeafletMap({
    containerId: MAP_CONTAINER_ID,
    mapLayer
});

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');
const layersRef = ref<InstanceType<typeof Popover> | null>(null);
const layersOpen = ref<boolean>(false);

/** Map search box state; model holds the typed string or the picked zone */
const searchOpen = ref<boolean>(false);
const searchModel = ref<string | Zone>('');
const suggestions = ref<Zone[]>([]);

/** Zone shapes layer; created on mount on top of the shared map */
let zonesLayer: L.LayerGroup | null = null;

/** Rendered shapes by zone id, so selection and search can locate them */
const layerById = new Map<string, ZoneLayer>();

/** Escapes user-facing text inserted into Leaflet HTML strings */
const esc = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Hex accent color of the zone's palette key.
 * @param {Zone} zone Zone to look up.
 * @returns {string} Hex color of the 500 shade.
 */
const zoneColor = (zone: Zone): string => primitiveColors[zone.color]['500'];

/**
 * Iconify icon of the zone's shape kind.
 * @param {Zone} zone Zone to look up.
 * @returns {string} Tabler icon name of the shape.
 */
const shapeIcon = (zone: Zone): string =>
    ZONE_SHAPE_OPTIONS.find((o) => o.value === zone.geometry.kind)?.icon ??
    'tabler:polygon';

/**
 * Translated label of the zone's first type, e.g. «Склад».
 * @param {Zone} zone Zone to look up.
 * @returns {string} Translated type label, or an empty string.
 */
const zoneTypeLabel = (zone: Zone): string => {
    const option = ZONE_TYPE_OPTIONS.find((o) => o.value === zone.types[0]);
    return option ? t(option.labelKey) : '';
};

/**
 * Builds the hover tooltip HTML: a muted meta row (companies · type · area)
 * and the zone name with its accent-colored dot.
 * @param {Zone} zone Hovered zone.
 * @returns {string} Escaped tooltip HTML string.
 */
const zoneTooltip = (zone: Zone): string => {
    const meta = [
        zone.companies.join(', '),
        zoneTypeLabel(zone),
        t('zones.list.area', { n: formatZoneArea(zoneAreaKm2(zone.geometry)) })
    ]
        .filter(Boolean)
        .map(esc)
        .join(' · ');
    return `<div class="zone-tooltip-meta">${meta}</div><div class="zone-tooltip-name"><span class="zone-tooltip-dot" style="background:${zoneColor(zone)}"></span>${esc(zone.name)}</div>`;
};

/**
 * Zone shape styling in the zone's accent color.
 * @param {Zone} zone Zone to style.
 * @returns {L.PathOptions} Leaflet path options.
 */
const zoneStyle = (zone: Zone): L.PathOptions => {
    const color = zoneColor(zone);
    return { color, weight: 2, fillColor: color, fillOpacity: 0.2 };
};

/**
 * Creates the Leaflet layer for a zone geometry (read-only, no editing).
 * @param {Zone} zone Zone to render.
 * @returns {ZoneLayer} Polygon (also rectangles) or circle layer.
 */
const createZoneLayer = (zone: Zone): ZoneLayer =>
    zone.geometry.kind === 'circle'
        ? L.circle(zone.geometry.center, {
              ...zoneStyle(zone),
              radius: zone.geometry.radius
          })
        : L.polygon(zone.geometry.points, zoneStyle(zone));

/** Re-renders the shapes of every zone (the map ignores panel filters) */
const renderZones = (): void => {
    if (!zonesLayer) return;
    zonesLayer.clearLayers();
    layerById.clear();
    for (const zone of zones.value) {
        const layer = createZoneLayer(zone);
        layer.bindTooltip(zoneTooltip(zone), {
            sticky: true,
            direction: 'bottom',
            className: 'zone-tooltip',
            opacity: 1
        });
        layer.on('click', () => selectZone(zone.id));
        zonesLayer.addLayer(layer);
        layerById.set(zone.id, layer);
    }
};

/**
 * Fits the map view around every rendered zone shape.
 * @param {L.Map} map Initialized Leaflet map.
 */
const fitAllZones = (map: L.Map): void => {
    const bounds = L.latLngBounds([]);
    for (const layer of layerById.values()) bounds.extend(layer.getBounds());
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
};

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
 * AutoComplete `complete` handler: fills suggestions from every zone,
 * matching name or company. An empty query lists the first zones.
 * @param {{ query: string }} event AutoComplete query event.
 */
const onSearchComplete = (event: { query: string }): void => {
    const q = event.query.trim().toLowerCase();
    const source = q
        ? zones.value.filter(
              (z) =>
                  z.name.toLowerCase().includes(q) ||
                  z.companies.some((c) => c.toLowerCase().includes(q))
          )
        : zones.value;
    suggestions.value = source.slice(0, SEARCH_LIMIT);
};

/**
 * Flies the map to a zone shape and closes the search box. Polygons and
 * rectangles fly to their bounds; circles jump to their center at the zoom
 * that fits the circle.
 * @param {Zone} zone Selected search result.
 */
const focusZone = (zone: Zone): void => {
    const map = getMap();
    const layer = layerById.get(zone.id);
    if (map && layer) {
        if (zone.geometry.kind === 'circle') {
            map.setView(
                zone.geometry.center,
                map.getBoundsZoom(layer.getBounds(), false, L.point(40, 40))
            );
        } else {
            map.flyToBounds(layer.getBounds(), {
                padding: [40, 40],
                duration: 0.75
            });
        }
    }
    closeSearch();
};

/**
 * AutoComplete `option-select` handler: focuses the chosen zone on the map.
 * @param {{ value: Zone }} event AutoComplete selection event.
 */
const onOptionSelect = (event: { value: Zone }): void => {
    focusZone(event.value);
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;

    zonesLayer = L.layerGroup().addTo(map);
    renderZones();
    fitAllZones(map);

    // tapping the map dismisses the search box
    map.on('click', closeSearch);
});

/** Shapes follow the panel search and filters */
watch(zones, renderZones);

/** Card/shape selection flies the map to the selected zone */
watch(selectedZoneId, (id): void => {
    if (!id) return;
    const layer = layerById.get(id);
    if (!layer) return;
    getMap()?.flyToBounds(layer.getBounds(), {
        padding: [40, 40],
        duration: 0.75
    });
});
</script>

<style>
/* Unscoped: Leaflet injects tooltip HTML outside Vue's scope attrs. */
.zone-tooltip {
    background: var(--p-surface-0);
    border: none;
    border-radius: 0.375rem;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
    padding: 0.375rem 0.5rem;
    color: var(--p-surface-900);
    font-size: 0.75rem;
    line-height: 1.5;
    white-space: nowrap;
}

.zone-tooltip::before {
    display: none;
}

.zone-tooltip-meta {
    color: var(--p-surface-500);
}

.zone-tooltip-name {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-weight: 500;
}

.zone-tooltip-dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    flex-shrink: 0;
}
</style>
