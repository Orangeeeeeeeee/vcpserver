import type { OnlineStatus } from '~/types/online';
import { primitiveColors, surface } from '~/theme/colors';

/** Visual identity of an online status: Iconify icon (legend/cards) + colors */
export interface OnlineStatusMeta {
    /** Iconify icon name (legend and panel cards) */
    icon: string;
    /** Tailwind text color class for the panel/legend icon */
    textClass: string;
    /** Solid background of the square map marker */
    markerBg: string;
    /** i18n label key (objects.online.statuses.*) */
    labelKey: string;
}

/** Status metadata in the legend's display order */
export const ONLINE_STATUS_META: Record<OnlineStatus, OnlineStatusMeta> = {
    moving: {
        icon: 'tabler:send',
        textClass: 'text-green-500',
        markerBg: primitiveColors.green['600'],
        labelKey: 'objects.online.statuses.moving'
    },
    speeding: {
        icon: 'tabler:send',
        textClass: 'text-yellow-500',
        markerBg: primitiveColors.yellow['500'],
        labelKey: 'objects.online.statuses.speeding'
    },
    speedingHard: {
        icon: 'tabler:send',
        textClass: 'text-red-500',
        markerBg: primitiveColors.red['500'],
        labelKey: 'objects.online.statuses.speedingHard'
    },
    idleEngine: {
        icon: 'tabler:engine',
        textClass: 'text-yellow-500',
        markerBg: primitiveColors.yellow['500'],
        labelKey: 'objects.online.statuses.idleEngine'
    },
    stopped: {
        icon: 'tabler:engine-off',
        textClass: 'text-surface-600',
        markerBg: surface['700'],
        labelKey: 'objects.online.statuses.stopped'
    },
    warning: {
        icon: 'tabler:alert-triangle',
        textClass: 'text-amber-500',
        markerBg: primitiveColors.amber['500'],
        labelKey: 'objects.online.statuses.warning'
    },
    accident: {
        icon: 'tabler:car-crash',
        textClass: 'text-rose-500',
        markerBg: primitiveColors.rose['500'],
        labelKey: 'objects.online.statuses.accident'
    }
};

/**
 * Inline Tabler SVG bodies for Leaflet divIcon markers (fetched once from the
 * Iconify API). Wrapped at runtime into a 24×24 viewBox <svg>; strokes use
 * currentColor, so the wrapper sets `color`.
 */
export const ONLINE_MARKER_SVG: Record<OnlineStatus, string> = {
    moving: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z"/>',
    speeding:
        '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z"/>',
    speedingHard:
        '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14L21 3m0 0l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z"/>',
    idleEngine:
        '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10v6m9-11v3m-2-3h4m-9 8H3m3-3h2l2-2h3.382a1 1 0 0 1 .894.553l1.448 2.894a1 1 0 0 0 .894.553H18v-2h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2v-2h-3v2a1 1 0 0 1-1 1h-3.465a1 1 0 0 1-.832-.445L8 16H6z"/>',
    stopped:
        '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10v6m9-11v3m-2-3h4m-9 8H3m13 3h-1v2a1 1 0 0 1-1 1h-3.465a1 1 0 0 1-.832-.445L8 16H6v-6h2l.99-.99M12 8h1.382a1 1 0 0 1 .894.553l1.448 2.894a1 1 0 0 0 .894.553H18v-2h2a1 1 0 0 1 1 1v6M3 3l18 18"/>',
    warning:
        '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m-1.637-9.409L2.257 17.125a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0M12 16h.01"/>',
    accident:
        '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/><path d="m7 6l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H3m0-6h8m-6 0V6m2 0H3m11 2V6m5 6h2m-3.5 3.5L19 17m-1.5-8.5L19 7"/></g>'
};

/** Statuses the «Рухається» quick filter covers */
export const MOVING_STATUSES: OnlineStatus[] = [
    'moving',
    'speeding',
    'speedingHard'
];

/** Statuses the «Стоїть» quick filter covers */
export const STANDING_STATUSES: OnlineStatus[] = ['idleEngine', 'stopped'];
