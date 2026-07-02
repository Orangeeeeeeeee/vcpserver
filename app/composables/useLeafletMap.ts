import type { Map as LeafletMap, TileLayer } from 'leaflet';

/** Map base layer of a Leaflet map backed by Mapbox Static Tiles */
export type LeafletMapLayer = 'streets' | 'satellite';

/** Default map center — Ukraine fits the viewport at the default zoom */
export const DEFAULT_MAP_CENTER: [number, number] = [49.3, 31.5];

/** Default map zoom paired with {@link DEFAULT_MAP_CENTER} */
export const DEFAULT_MAP_ZOOM = 6;

/** Mapbox style id per base layer */
const MAPBOX_STYLE_IDS: Record<LeafletMapLayer, string> = {
    streets: 'streets-v12',
    satellite: 'satellite-v9'
};

export interface UseLeafletMapParams {
    /** Id of the DOM element the map mounts into */
    containerId: string;
    /** Reactive base layer; switching it swaps the Static Tiles style */
    mapLayer: Ref<LeafletMapLayer>;
    /** Initial map center as [lat, lng] */
    center?: [number, number];
    /** Initial map zoom */
    zoom?: number;
}

export interface UseLeafletMapReturn {
    /**
     * Creates the map inside the container element. Waits for the DOM
     * (`nextTick`), verifies the container and the Mapbox token, then mounts
     * the Static Tiles layer and schedules an `invalidateSize()` once the
     * container has its final layout size.
     * @returns The created map, or `null` when the container/token is missing.
     */
    init: () => Promise<LeafletMap | null>;
    /** Raw Leaflet map for consumer layers/markers/events */
    getMap: () => LeafletMap | null;
    /** Zooms the map in by one step */
    zoomIn: () => void;
    /** Zooms the map out by one step */
    zoomOut: () => void;
    /** Re-measures the map container */
    invalidateSize: () => void;
    /** Browser Fullscreen API toggle on the given element */
    toggleFullscreen: (element?: HTMLElement | null) => void;
    /** Destroys the map; also runs automatically on unmount */
    destroy: () => void;
}

/**
 * Shared Leaflet + Mapbox Static Tiles map plumbing: map creation, tile layer
 * with street/satellite switching, zoom, fullscreen and cleanup. Consumers
 * add their own layers, markers and events via the returned map instance.
 *
 * Client-only: call it from `.client.vue` components. Leaflet is loaded via a
 * dynamic import inside `init()`, so the composable itself is safe to bundle
 * on the server.
 *
 * @param {UseLeafletMapParams} params Container id, base layer ref and view.
 * @returns {UseLeafletMapReturn} Map lifecycle and control helpers.
 */
export const useLeafletMap = (
    params: UseLeafletMapParams
): UseLeafletMapReturn => {
    const {
        containerId,
        mapLayer,
        center = DEFAULT_MAP_CENTER,
        zoom = DEFAULT_MAP_ZOOM
    } = params;

    const { mapboxToken } = useRuntimeConfig().public;

    /** Leaflet instance; created in init(), destroyed on unmount */
    let map: LeafletMap | null = null;
    let tileLayer: TileLayer | null = null;

    /** Mapbox Static Tiles URL for the given style id */
    const tilesUrl = (styleId: string): string =>
        `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/512/{z}/{x}/{y}@2x?access_token=${mapboxToken}`;

    const init = async (): Promise<LeafletMap | null> => {
        await nextTick();
        const container = document.getElementById(containerId);
        if (!container || !mapboxToken) {
            console.warn(
                'useLeafletMap: missing map container or Mapbox token'
            );
            return null;
        }

        const L = await import('leaflet');

        map = L.map(container, { zoomControl: false }).setView(center, zoom);

        // Mapbox Static Tiles API (512px tiles need zoomOffset -1 in Leaflet)
        tileLayer = L.tileLayer(tilesUrl(MAPBOX_STYLE_IDS[mapLayer.value]), {
            tileSize: 512,
            zoomOffset: -1,
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // re-measure once the container has its final layout size
        requestAnimationFrame(() => map?.invalidateSize());

        return map;
    };

    const getMap = (): LeafletMap | null => map;

    const zoomIn = (): void => {
        map?.zoomIn();
    };

    const zoomOut = (): void => {
        map?.zoomOut();
    };

    const invalidateSize = (): void => {
        map?.invalidateSize();
    };

    const toggleFullscreen = (element?: HTMLElement | null): void => {
        if (document.fullscreenElement) {
            void document.exitFullscreen();
            return;
        }
        void element?.requestFullscreen();
    };

    const destroy = (): void => {
        map?.remove();
        map = null;
        tileLayer = null;
    };

    /** Street ↔ satellite switch swaps the Static Tiles style */
    watch(mapLayer, (layer): void => {
        tileLayer?.setUrl(tilesUrl(MAPBOX_STYLE_IDS[layer]));
    });

    onUnmounted(destroy);

    return {
        init,
        getMap,
        zoomIn,
        zoomOut,
        invalidateSize,
        toggleFullscreen,
        destroy
    };
};
