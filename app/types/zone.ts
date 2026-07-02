/** Kind of a geofence zone */
export type ZoneType = 'parking' | 'loading' | 'restricted' | 'work' | 'other';

/** Event that fires zone notifications */
export type ZoneTrigger = 'enter' | 'exit' | 'both';

/** Importance level of a zone notification */
export type ZoneNotificationType = 'info' | 'important' | 'urgent';

/** Delivery channel of a zone notification */
export type ZoneNotificationChannel = 'site' | 'email' | 'sms';

/**
 * Zone shape on the map. Rectangles keep the same point list as polygons —
 * the kind only records which drawing tool produced the shape.
 * Coordinates are `[lat, lng]` tuples; circle radius is in meters.
 */
export type ZoneGeometry =
    | { kind: 'polygon'; points: [number, number][] }
    | { kind: 'rectangle'; points: [number, number][] }
    | { kind: 'circle'; center: [number, number]; radius: number };

/** Discriminant of {@link ZoneGeometry} (the «Форма зони» filter values) */
export type ZoneShape = ZoneGeometry['kind'];

/** Palette key of the zone accent color (maps to `primitiveColors`) */
export type ZoneColor = 'indigo' | 'teal' | 'violet' | 'sky' | 'rose' | 'amber';

/** Notification binding of a zone to groups or vehicles */
export interface ZoneBinding {
    /** Bound entity ids — group ids or vehicle ids depending on the section */
    ids: string[];
    trigger: ZoneTrigger;
    notificationTypes: ZoneNotificationType[];
    channels: ZoneNotificationChannel[];
}

export interface Zone {
    id: string;
    /** Owning companies, e.g. ["Logistics UA"] */
    companies: string[];
    types: ZoneType[];
    /** Accent color of the zone card and its shape on the map */
    color: ZoneColor;
    /** Display name, e.g. "Склад №1" */
    name: string;
    description?: string;
    geometry: ZoneGeometry;
    /** Notification bindings to vehicle groups */
    groupBindings: ZoneBinding[];
    /** Notification bindings to individual vehicles */
    vehicleBindings: ZoneBinding[];
}
