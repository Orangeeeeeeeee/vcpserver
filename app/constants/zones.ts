import type {
    ZoneColor,
    ZoneNotificationChannel,
    ZoneNotificationType,
    ZoneShape,
    ZoneTrigger,
    ZoneType
} from '~/types/zone';

/** A zone type paired with its i18n label key */
export interface ZoneTypeOption {
    value: ZoneType;
    labelKey: string;
}

/** A zone trigger paired with its i18n label key */
export interface ZoneTriggerOption {
    value: ZoneTrigger;
    labelKey: string;
}

/** Chip accent color of a notification type */
export type ZoneNotificationColor = 'neutral' | 'amber' | 'red';

/** A notification type with its i18n label key and chip accent color */
export interface ZoneNotificationTypeOption {
    value: ZoneNotificationType;
    labelKey: string;
    color: ZoneNotificationColor;
}

/** A notification channel paired with its i18n label key */
export interface ZoneNotificationChannelOption {
    value: ZoneNotificationChannel;
    labelKey: string;
}

/** A zone shape paired with its i18n label key and Tabler icon */
export interface ZoneShapeOption {
    value: ZoneShape;
    labelKey: string;
    /** Iconify icon shown next to the shape (card header, filter option) */
    icon: string;
}

/** Zone shape options in display order (the «Форма зони» filter) */
export const ZONE_SHAPE_OPTIONS: ZoneShapeOption[] = [
    {
        value: 'polygon',
        labelKey: 'zones.list.shapes.polygon',
        icon: 'tabler:polygon'
    },
    {
        value: 'rectangle',
        labelKey: 'zones.list.shapes.rectangle',
        icon: 'tabler:square'
    },
    {
        value: 'circle',
        labelKey: 'zones.list.shapes.circle',
        icon: 'tabler:circle'
    }
];

/** Zone accent colors in auto-assignment rotation order */
export const ZONE_COLORS: ZoneColor[] = [
    'indigo',
    'teal',
    'violet',
    'sky',
    'rose',
    'amber'
];

/** Trigger icons shown on binding chips/rows of the zone list cards */
export const ZONE_TRIGGER_ICONS: Record<ZoneTrigger, string> = {
    enter: 'tabler:arrow-bar-to-right',
    exit: 'tabler:arrow-bar-to-left',
    both: 'tabler:arrows-right-left'
};

/** Zone type select options in display order */
export const ZONE_TYPE_OPTIONS: ZoneTypeOption[] = [
    { value: 'parking', labelKey: 'zones.create.zoneTypes.parking' },
    { value: 'loading', labelKey: 'zones.create.zoneTypes.loading' },
    { value: 'restricted', labelKey: 'zones.create.zoneTypes.restricted' },
    { value: 'work', labelKey: 'zones.create.zoneTypes.work' },
    { value: 'other', labelKey: 'zones.create.zoneTypes.other' }
];

/** Zone trigger select options in display order */
export const ZONE_TRIGGER_OPTIONS: ZoneTriggerOption[] = [
    { value: 'enter', labelKey: 'zones.create.triggers.enter' },
    { value: 'exit', labelKey: 'zones.create.triggers.exit' },
    { value: 'both', labelKey: 'zones.create.triggers.both' }
];

/** Notification type select options with chip accent colors */
export const ZONE_NOTIFICATION_TYPE_OPTIONS: ZoneNotificationTypeOption[] = [
    {
        value: 'info',
        labelKey: 'zones.create.notificationTypes.info',
        color: 'neutral'
    },
    {
        value: 'important',
        labelKey: 'zones.create.notificationTypes.important',
        color: 'amber'
    },
    {
        value: 'urgent',
        labelKey: 'zones.create.notificationTypes.urgent',
        color: 'red'
    }
];

/** Notification channel select options in display order */
export const ZONE_NOTIFICATION_CHANNEL_OPTIONS: ZoneNotificationChannelOption[] =
    [
        { value: 'site', labelKey: 'zones.create.channelOptions.site' },
        { value: 'email', labelKey: 'zones.create.channelOptions.email' },
        { value: 'sms', labelKey: 'zones.create.channelOptions.sms' }
    ];
