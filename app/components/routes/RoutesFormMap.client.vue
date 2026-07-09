<template>
    <div ref="wrapperRef" class="relative size-full bg-surface-100">
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- Mobile: back to the form panel (top-left) -->
        <UiMapAction
            class="absolute left-3 top-3 z-[1000] lg:hidden"
            icon="tabler:list"
            :aria-label="$t('routes.create.map.showForm')"
            @click="emit('showPanel')"
        />

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

        <!-- Pick-on-map hint -->
        <div
            v-if="isPicking"
            class="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-lg bg-surface-0 px-4 py-2 text-sm text-surface-900 shadow-md"
        >
            {{ $t('routes.create.map.pickHint') }}
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
                        for="routesMapLayerStreets"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="mapLayer"
                            input-id="routesMapLayerStreets"
                            value="streets"
                            size="small"
                        />
                        {{ $t('objects.online.map.street') }}
                    </label>
                    <label
                        for="routesMapLayerSatellite"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="mapLayer"
                            input-id="routesMapLayerSatellite"
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
import type { LeafletMapLayer } from '~/composables/useLeafletMap';
import { useRouteFormContext } from '~/composables/useRouteForm';
import {
    ROUTE_START_COLOR,
    ROUTE_FINISH_COLOR,
    ROUTE_INTERMEDIATE_COLORS
} from '~/constants/route-form';
import type { RoutePointColor } from '~/constants/route-form';
import { primitiveColors } from '~/theme/colors';

/**
 * Map of the route create page: renders the route points and the connecting
 * segments, and applies pick-on-map clicks to the point awaiting a location.
 */

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'routes-form-map';

const emit = defineEmits<{
    /** Mobile «back to the form panel» toggle */
    showPanel: [];
}>();

const { points, pointKind, pickingPointId, applyPick, cancelPick } =
    useRouteFormContext();

/** Base layer of this map only; the page holds no map layer state */
const mapLayer = ref<LeafletMapLayer>('streets');

/** Shared Leaflet + Mapbox tiles plumbing (creation, layer switch, cleanup) */
const { init, getMap, zoomIn, zoomOut, toggleFullscreen } = useLeafletMap({
    containerId: MAP_CONTAINER_ID,
    mapLayer
});

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');
const layersRef = ref<InstanceType<typeof Popover> | null>(null);
const layersOpen = ref<boolean>(false);

const isPicking = computed<boolean>(() => pickingPointId.value !== null);

/**
 * Crosshair cursor while picking, set imperatively: a reactive class/style
 * binding on the map container would make Vue rewrite the attribute and wipe
 * the classes Leaflet added to it on init (leaflet-container etc.), which
 * blanks the whole map.
 */
watch(isPicking, (picking): void => {
    const container = document.getElementById(MAP_CONTAINER_ID);
    if (container) container.style.cursor = picking ? 'crosshair' : '';
});

/** All rendered route layers; kept out of refs so Leaflet stays non-reactive */
let routeLayer: L.LayerGroup | null = null;

const toggleLayers = (event: MouseEvent): void => {
    layersRef.value?.toggle(event);
};

/** Marker fill color of the point at the given position */
const markerColor = (index: number): string => {
    const kind = pointKind(index);
    let color: RoutePointColor;
    if (kind === 'start') color = ROUTE_START_COLOR;
    else if (kind === 'finish') color = ROUTE_FINISH_COLOR;
    else
        color = ROUTE_INTERMEDIATE_COLORS[
            (index - 1) % ROUTE_INTERMEDIATE_COLORS.length
        ] as RoutePointColor;
    return primitiveColors[color]['500'];
};

/**
 * Redraws the route markers and segments from the current form points.
 * @param {L.Map} map Initialized Leaflet map.
 */
const renderRoute = (map: L.Map): void => {
    routeLayer?.remove();
    routeLayer = L.layerGroup();

    points.value.forEach((point, index) => {
        if (!point.coords) return;
        L.circleMarker(point.coords, {
            radius: 8,
            color: '#ffffff',
            weight: 2,
            fillColor: markerColor(index),
            fillOpacity: 1
        }).addTo(routeLayer as L.LayerGroup);
    });

    // segments connect consecutive located points; a «прямий шлях» segment
    // renders dashed to visually differ from a road-bound one
    for (let i = 1; i < points.value.length; i++) {
        const from = points.value[i - 1]?.coords;
        const target = points.value[i];
        if (!from || !target?.coords) continue;
        L.polyline([from, target.coords], {
            color: primitiveColors[ROUTE_START_COLOR]['500'],
            weight: 3,
            dashArray: target.directPath ? '8,8' : undefined
        }).addTo(routeLayer);
    }

    routeLayer.addTo(map);
};

/** Fits the view to the located points (skipped while none are set) */
const fitRoute = (map: L.Map): void => {
    const located = points.value
        .map((point) => point.coords)
        .filter((coords): coords is [number, number] => coords !== null);
    if (located.length === 0) return;
    map.fitBounds(L.latLngBounds(located), {
        padding: [60, 60],
        maxZoom: 14
    });
};

/** Escape cancels the pick-on-map mode */
const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isPicking.value) cancelPick();
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;

    map.on('click', (event: L.LeafletMouseEvent): void => {
        if (!isPicking.value) return;
        applyPick([event.latlng.lat, event.latlng.lng]);
        // below lg the pick started from the form overlay — bring it back
        emit('showPanel');
    });

    window.addEventListener('keydown', onKeydown);

    renderRoute(map);
    fitRoute(map);
});

onUnmounted((): void => {
    window.removeEventListener('keydown', onKeydown);
});

/** Signature of everything the drawn route depends on */
const routeSignature = computed<string>(() =>
    JSON.stringify(
        points.value.map((point) => [point.id, point.coords, point.directPath])
    )
);

/** Signature of the located coordinates only — drives re-fitting the view */
const coordsSignature = computed<string>(() =>
    JSON.stringify(points.value.map((point) => point.coords))
);

watch(routeSignature, (): void => {
    const map = getMap();
    if (map) renderRoute(map);
});

watch(coordsSignature, (): void => {
    const map = getMap();
    if (map) fitRoute(map);
});
</script>
