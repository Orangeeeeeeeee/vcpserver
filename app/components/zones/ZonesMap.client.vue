<template>
    <div ref="wrapperRef" class="relative size-full bg-surface-100">
        <div :id="MAP_CONTAINER_ID" class="size-full" />

        <!-- Mobile: back to the form panel (top-left) -->
        <UiMapAction
            class="absolute left-3 top-3 z-[1000] lg:hidden"
            icon="tabler:list"
            :aria-label="$t('zones.create.map.showForm')"
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

        <!-- Drawing tools (bottom-right) -->
        <div
            class="absolute bottom-3.5 right-3.5 z-[1000] flex flex-col items-end gap-4"
        >
            <div class="flex flex-col gap-2">
                <UiMapAction
                    icon="tabler:arrow-back-up"
                    class="disabled:pointer-events-none disabled:opacity-40"
                    :aria-label="$t('zones.create.map.undo')"
                    :disabled="activeTool !== 'Polygon'"
                    @click="undoVertex"
                />
                <UiMapAction
                    icon="tabler:trash"
                    class="disabled:pointer-events-none disabled:opacity-40"
                    :aria-label="$t('zones.create.map.delete')"
                    :disabled="!hasShape"
                    @click="deleteShape"
                />
            </div>

            <div class="flex flex-col gap-2">
                <UiMapAction
                    v-for="tool in DRAW_TOOLS"
                    :key="tool.shape"
                    :icon="tool.icon"
                    :aria-label="$t(tool.labelKey)"
                    :aria-pressed="activeTool === tool.shape"
                    :class="
                        activeTool === tool.shape
                            ? 'bg-primary-100! text-primary-500!'
                            : ''
                    "
                    @click="toggleTool(tool.shape)"
                />
            </div>
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
                        for="zonesMapLayerStreets"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="mapLayer"
                            input-id="zonesMapLayerStreets"
                            value="streets"
                            size="small"
                        />
                        {{ $t('objects.online.map.street') }}
                    </label>
                    <label
                        for="zonesMapLayerSatellite"
                        class="flex cursor-pointer items-center gap-2 text-sm text-surface-800"
                    >
                        <RadioButton
                            v-model="mapLayer"
                            input-id="zonesMapLayerSatellite"
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
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import Popover from 'primevue/popover';
import { useLeafletMap } from '~/composables/useLeafletMap';
import type { LeafletMapLayer } from '~/composables/useLeafletMap';
import { useZoneFormContext } from '~/composables/useZoneForm';
import { primitiveColors } from '~/theme/colors';
import type { ZoneColor, ZoneGeometry } from '~/types/zone';

/**
 * Looked up by id instead of a template ref: Nuxt wraps `.client.vue`
 * components in createClientOnly, where template refs are unreliable
 * (stay null in onMounted), which silently skipped the map init.
 */
const MAP_CONTAINER_ID = 'zones-map';

/** Geoman shape a drawing tool button enables */
type DrawTool = 'Polygon' | 'Rectangle' | 'Circle';

/** Drawn zone layer kinds; rectangles are L.Rectangle extends L.Polygon */
type DrawnLayer = L.Polygon | L.Circle;

/** Drawing tool buttons in the bottom-right stack display order */
const DRAW_TOOLS: { shape: DrawTool; icon: string; labelKey: string }[] = [
    {
        shape: 'Polygon',
        icon: 'tabler:polygon',
        labelKey: 'zones.create.map.polygon'
    },
    {
        shape: 'Rectangle',
        icon: 'tabler:square',
        labelKey: 'zones.create.map.rectangle'
    },
    {
        shape: 'Circle',
        icon: 'tabler:circle',
        labelKey: 'zones.create.map.circle'
    }
];

interface ZonesMapProps {
    /** Accent color of the drawn shape; defaults to indigo on the create page */
    color?: ZoneColor;
}

const props = withDefaults(defineProps<ZonesMapProps>(), { color: 'indigo' });

const emit = defineEmits<{
    /** Mobile «back to the form panel» toggle */
    showPanel: [];
}>();

/** Zone shape styling in the zone's accent color */
const SHAPE_STYLE: L.PathOptions = {
    color: primitiveColors[props.color]['500'],
    weight: 2,
    fillColor: primitiveColors[props.color]['500'],
    fillOpacity: 0.2
};

/** Drawn shape lives in the shared zone form context (provided by the page) */
const { geometry } = useZoneFormContext();

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

/** Currently enabled drawing tool; null when no draw mode is active */
const activeTool = ref<DrawTool | null>(null);

/** Reactive mirror of `drawnLayer` presence for the delete button state */
const hasShape = ref<boolean>(false);

/** The single drawn zone layer; kept out of refs so Leaflet stays non-reactive */
let drawnLayer: DrawnLayer | null = null;

/**
 * Which tool produced the current non-circle shape. Rectangles are Leaflet
 * polygons, so the origin must be remembered to persist `kind: 'rectangle'`.
 */
let drawnKind: 'polygon' | 'rectangle' = 'polygon';

const toggleLayers = (event: MouseEvent): void => {
    layersRef.value?.toggle(event);
};

/**
 * Writes the layer's shape into the shared form geometry.
 * @param {DrawnLayer} layer Drawn polygon/rectangle or circle.
 */
const syncGeometry = (layer: DrawnLayer): void => {
    if (layer instanceof L.Circle) {
        const center = layer.getLatLng();
        geometry.value = {
            kind: 'circle',
            center: [center.lat, center.lng],
            radius: layer.getRadius()
        };
        return;
    }
    // outer ring only — zones are simple shapes without holes
    const [ring] = layer.getLatLngs() as L.LatLng[][];
    geometry.value = {
        kind: drawnKind,
        points: (ring ?? []).map((ll): [number, number] => [ll.lat, ll.lng])
    };
};

/**
 * Makes the layer the single zone shape: removes the previous one, enables
 * vertex editing, wires edit events and syncs the form geometry.
 * @param {L.Layer} layer Layer created by geoman or restored from geometry.
 */
const adoptLayer = (layer: L.Layer): void => {
    if (!(layer instanceof L.Polygon) && !(layer instanceof L.Circle)) return;
    drawnLayer?.remove();
    drawnLayer = layer;
    hasShape.value = true;
    layer.pm.enable({ allowSelfIntersection: false });
    layer.on('pm:edit', () => syncGeometry(layer));
    layer.on('pm:markerdragend', () => syncGeometry(layer));
    syncGeometry(layer);
};

/**
 * Toggles a geoman draw mode; clicking the active tool again disables it.
 * @param {DrawTool} tool Shape button that was clicked.
 */
const toggleTool = (tool: DrawTool): void => {
    const map = getMap();
    if (!map) return;
    if (activeTool.value === tool) {
        map.pm.disableDraw();
        activeTool.value = null;
        return;
    }
    map.pm.disableDraw();
    map.pm.enableDraw(tool, {
        snappable: true,
        continueDrawing: false,
        allowSelfIntersection: false,
        templineStyle: SHAPE_STYLE,
        hintlineStyle: { ...SHAPE_STYLE, dashArray: '5,5' },
        pathOptions: SHAPE_STYLE
    });
    activeTool.value = tool;
};

/** Removes the last placed vertex; only meaningful while drawing a polygon */
const undoVertex = (): void => {
    const map = getMap();
    if (!map || activeTool.value !== 'Polygon') return;
    // geoman-free exposes no public undo API; its own toolbar action calls
    // the internal _removeLastVertex on the active draw instance
    const polygonDraw = map.pm.Draw.Polygon as unknown as {
        _removeLastVertex: () => void;
    };
    polygonDraw._removeLastVertex();
};

/** Deletes the drawn shape and clears the form geometry */
const deleteShape = (): void => {
    drawnLayer?.remove();
    drawnLayer = null;
    hasShape.value = false;
    geometry.value = null;
};

/**
 * Re-creates the drawn layer from a persisted geometry (e.g. the user comes
 * back to the map while the form already holds a shape).
 * @param {L.Map} map Initialized Leaflet map.
 * @param {ZoneGeometry} geo Persisted zone shape.
 */
const restoreGeometry = (map: L.Map, geo: ZoneGeometry): void => {
    if (geo.kind !== 'circle') drawnKind = geo.kind;
    const layer =
        geo.kind === 'circle'
            ? L.circle(geo.center, { ...SHAPE_STYLE, radius: geo.radius })
            : L.polygon(geo.points, SHAPE_STYLE);
    layer.addTo(map);
    adoptLayer(layer);
    map.fitBounds(layer.getBounds(), { padding: [40, 40] });
};

onMounted(async (): Promise<void> => {
    const map = await init();
    if (!map) return;

    // one shape per zone: a newly finished shape replaces the previous one
    map.on('pm:create', (event) => {
        drawnKind = event.shape === 'Rectangle' ? 'rectangle' : 'polygon';
        adoptLayer(event.layer);
        map.pm.disableDraw();
        activeTool.value = null;
    });

    // covers Escape / programmatic draw cancellation
    map.on('pm:drawend', () => {
        activeTool.value = null;
    });

    if (geometry.value) restoreGeometry(map, geometry.value);
});

/** External resets (form reset sets geometry to null) drop the drawn layer */
watch(geometry, (geo): void => {
    if (geo === null && drawnLayer) {
        drawnLayer.remove();
        drawnLayer = null;
        hasShape.value = false;
    }
});
</script>
