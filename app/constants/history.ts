import type { HistoryEventType } from '~/types/history';

/** Visual identity of a history feed event: Iconify icon + color + label */
export interface HistoryEventMeta {
    /** Iconify icon name shown in the feed box */
    icon: string;
    /** Tailwind text color class of the icon */
    textClass: string;
    /** i18n label key (objects.vehicles.detail.history.events.*) */
    labelKey: string;
}

/** Event metadata of the history feed */
export const HISTORY_EVENT_META: Record<HistoryEventType, HistoryEventMeta> = {
    engineOn: {
        icon: 'tabler:flag',
        textClass: 'text-green-600',
        labelKey: 'objects.vehicles.detail.history.events.engineOn'
    },
    move: {
        icon: 'tabler:send',
        textClass: 'text-green-600',
        labelKey: 'objects.vehicles.detail.history.events.move'
    },
    moveSpeeding: {
        icon: 'tabler:send',
        textClass: 'text-red-500',
        labelKey: 'objects.vehicles.detail.history.events.move'
    },
    stop: {
        icon: 'tabler:player-pause',
        textClass: 'text-surface-700',
        labelKey: 'objects.vehicles.detail.history.events.stop'
    },
    engineOff: {
        icon: 'tabler:flag',
        textClass: 'text-red-500',
        labelKey: 'objects.vehicles.detail.history.events.engineOff'
    }
};
