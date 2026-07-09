<template>
    <div
        :id="ROUTE_VIEW_MAP_WRAPPER_ID"
        class="relative size-full bg-surface-100"
    >
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- Below lg: back to the route panel (top-left) -->
        <div class="absolute left-3 top-3 z-[1000] lg:hidden">
            <UiMapAction
                icon="tabler:list-details"
                :aria-label="$t('objects.online.listView')"
                @click="emit('showPanel')"
            />
        </div>

        <RoutesRouteViewMapControls
            v-model:layer="mapLayer"
            @zoom-in="zoomIn()"
            @zoom-out="zoomOut()"
            @fullscreen="toggleFullscreen(wrapperEl())"
        />

        <!-- External link + points export (bottom-left) -->
        <div class="absolute bottom-4 left-3 z-[1000] flex items-center gap-2">
            <button
                type="button"
                class="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-surface-300 bg-surface-0 px-3 text-sm font-medium text-surface-900 shadow-sm transition-colors hover:bg-surface-100"
                @click="openGoogleMaps"
            >
                {{ $t('routes.detail.googleMaps') }}
                <Icon name="tabler:map-pin" class="size-4 shrink-0" />
            </button>
            <button
                type="button"
                class="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-surface-300 bg-surface-0 px-3 text-sm font-medium text-surface-900 shadow-sm transition-colors hover:bg-surface-100"
                @click="exportJson"
            >
                {{ $t('routes.detail.exportJson') }}
                <Icon name="tabler:download" class="size-4 shrink-0" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { primitiveColors } from '~/theme/colors';
import { useLeafletMap } from '~/composables/useLeafletMap';
import {
    useRouteViewContext,
    ROUTE_VIEW_MAP_WRAPPER_ID
} from '~/composables/useRouteView';
import { ROUTE_POINT_TYPE_VIEW_META } from '~/constants/route-view';
import type { RouteCoords, RoutePoint } from '~/types/route';

/**
 * Read-only map of the route detail page: the route polyline with A/B
 * endpoint pins and typed intermediate markers, the control stack and the
 * Google Maps / JSON export actions.
 */

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'route-view-map';

/** Route line color (the blue polyline from the mockup) */
const ROUTE_COLOR = primitiveColors.sky['600'];

const emit = defineEmits<{
    /** Below lg: open the route panel overlay */
    showPanel: [];
}>();

const { route: viewedRoute, mapLayer } = useRouteViewContext();

/** Shared Leaflet + Mapbox tiles plumbing (creation, layer switch, cleanup) */
const { init, getMap, zoomIn, zoomOut, toggleFullscreen } = useLeafletMap({
    containerId: MAP_CONTAINER_ID,
    mapLayer
});

/** Fullscreen target (the wrapper with the overlaid controls) */
const wrapperEl = (): HTMLElement | null =>
    document.getElementById(ROUTE_VIEW_MAP_WRAPPER_ID);

/** All rendered route layers; kept out of refs so Leaflet stays non-reactive */
let routeLayer: L.LayerGroup | null = null;

/** Builds the round A/B endpoint divIcon */
const endpointIcon = (letter: string): L.DivIcon =>
    L.divIcon({
        className: 'route-endpoint-wrap',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `<div class="route-endpoint">${letter}</div>`
    });

/** Marker fill color of an intermediate point (by its type accent) */
const intermediateColor = (point: RoutePoint): string => {
    const meta = ROUTE_POINT_TYPE_VIEW_META[point.type ?? 'checkpoint'];
    return primitiveColors[meta.badgeColor]['500'];
};

/** Located points of the viewed route */
const locatedCoords = (): RouteCoords[] =>
    viewedRoute.value.points
        .map((point) => point.coords)
        .filter((coords): coords is RouteCoords => coords !== null);

/** Re-draws the polyline, endpoint pins and intermediate markers */
const renderRoute = (map: L.Map): void => {
    routeLayer?.remove();
    routeLayer = L.layerGroup();

    const points = viewedRoute.value.points;

    // segments connect consecutive located points; a «прямий шлях» segment
    // renders dashed to visually differ from a road-bound one
    for (let i = 1; i < points.length; i++) {
        const from = points[i - 1]?.coords;
        const target = points[i];
        if (!from || !target?.coords) continue;
        L.polyline([from, target.coords], {
            color: ROUTE_COLOR,
            weight: 4,
            opacity: 0.9,
            dashArray: target.directPath ? '8,8' : undefined
        }).addTo(routeLayer);
    }

    points.forEach((point) => {
        if (!point.coords) return;
        if (point.kind === 'start' || point.kind === 'finish') {
            L.marker(point.coords, {
                icon: endpointIcon(point.kind === 'start' ? 'A' : 'B')
            }).addTo(routeLayer as L.LayerGroup);
            return;
        }
        L.circleMarker(point.coords, {
            radius: 7,
            color: '#ffffff',
            weight: 2,
            fillColor: intermediateColor(point),
            fillOpacity: 1
        }).addTo(routeLayer as L.LayerGroup);
    });

    routeLayer.addTo(map);
};

/** Fits the view to the located points */
const fitRoute = (map: L.Map): void => {
    const located = locatedCoords();
    if (located.length === 0) return;
    map.fitBounds(L.latLngBounds(located), { padding: [40, 40] });
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;
    renderRoute(map);
    fitRoute(map);
});

/** Signature of everything the drawn route depends on (edits re-draw it) */
const routeSignature = computed<string>(() =>
    JSON.stringify(
        viewedRoute.value.points.map((point) => [
            point.id,
            point.coords,
            point.directPath,
            point.type
        ])
    )
);

watch(routeSignature, (): void => {
    const map = getMap();
    if (!map) return;
    renderRoute(map);
    fitRoute(map);
});

/** Opens the route as a Google Maps directions link in a new tab */
const openGoogleMaps = (): void => {
    const path = locatedCoords()
        .map(([lat, lng]) => `${lat},${lng}`)
        .join('/');
    if (!path) return;
    window.open(
        `https://www.google.com/maps/dir/${path}`,
        '_blank',
        'noopener'
    );
};

/**
 * Downloads the route points as a JSON file in the same shape the create
 * form's «Імпорт JSON» accepts (see `importPoints` in useRouteForm).
 */
const exportJson = (): void => {
    const data = viewedRoute.value.points
        .filter((point) => point.coords)
        .map((point) => ({
            address: point.address,
            lat: (point.coords as RouteCoords)[0],
            lng: (point.coords as RouteCoords)[1],
            name: point.name || undefined,
            type: point.type ?? undefined,
            radius: point.radius,
            directPath: point.directPath,
            timeToPoint: point.timeToPoint ?? undefined
        }));
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `route-${viewedRoute.value.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
};
</script>

<style>
/* Unscoped: Leaflet injects the endpoint HTML outside Vue's scope attrs. */
.route-endpoint-wrap {
    background: transparent;
    border: none;
}

.route-endpoint {
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
