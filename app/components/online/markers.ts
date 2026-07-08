import * as L from 'leaflet';
import './markers.css';
import { ONLINE_MARKER_SVG, ONLINE_STATUS_META } from '~/constants/online';
import type { OnlineVehicle } from '~/types/online';

/**
 * Vehicle marker + label helpers shared by the online fleet map and the
 * vehicle detail map. Client-only: imports Leaflet, so pull it in from
 * `.client.vue` components exclusively.
 */

/**
 * Escapes user-facing text inserted into Leaflet HTML strings.
 * @param {string} value Raw text.
 * @returns {string} HTML-safe text.
 */
export const escapeHtml = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Builds the colored square divIcon for a vehicle.
 * @param {OnlineVehicle} vehicle Vehicle whose status picks the icon/color.
 * @returns {L.DivIcon} Leaflet divIcon for the marker.
 */
export const onlineMarkerIcon = (vehicle: OnlineVehicle): L.DivIcon => {
    const meta = ONLINE_STATUS_META[vehicle.status];
    return L.divIcon({
        className: 'online-marker-wrap',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        tooltipAnchor: [0, 22],
        html: `<div class="online-marker" style="background:${meta.markerBg}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">${ONLINE_MARKER_SVG[vehicle.status]}</svg></div>`
    });
};

/**
 * Builds the permanent white label shown under a vehicle marker.
 * @param {OnlineVehicle} vehicle Labeled vehicle.
 * @param {string} groupName Display name of the vehicle's group.
 * @returns {string} Tooltip HTML.
 */
export const onlineMarkerLabel = (
    vehicle: OnlineVehicle,
    groupName: string
): string =>
    `<div class="online-label-row"><span>${escapeHtml(groupName)}</span><span class="online-label-dim">· ID: ${escapeHtml(vehicle.vehicleId)}</span></div><div class="online-label-row">${escapeHtml(vehicle.name)}</div><div class="online-label-row">${escapeHtml(vehicle.driver)}</div>`;
