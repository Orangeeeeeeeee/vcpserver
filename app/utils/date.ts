/**
 * Parses a "dd.mm.yyyy" display string into a Date at local midnight.
 * @param value - Display date string, e.g. "18.09.2027".
 * @returns {Date | null} Parsed date, or null when blank/malformed.
 */
export const parseUaDate = (value?: string | null): Date | null => {
    if (!value) return null;
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Formats a Date into a "dd.mm.yyyy" display string.
 * @param date - Date to format.
 * @returns {string} Formatted string, or "" when the date is null/undefined.
 */
export const formatUaDate = (date?: Date | null): string => {
    if (!date) return '';
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

/**
 * Converts an ISO "yyyy-mm-dd" date string into a "dd.mm.yyyy" display string.
 * @param value - ISO date string, e.g. "2026-06-01".
 * @returns {string} Formatted string, or the original value when malformed.
 */
export const formatIsoDateToUa = (value: string): string => {
    const [yyyy, mm, dd] = value.split('-');
    if (!yyyy || !mm || !dd) return value;
    return `${dd}.${mm}.${yyyy}`;
};

/**
 * Parses a "HH:mm" duration into a time-only Date (DatePicker model).
 * @param value - Duration string, e.g. "04:10".
 * @returns {Date | null} Time-only date, or null when malformed.
 */
export const durationToDate = (value?: string | null): Date | null => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value ?? '');
    if (!match) return null;
    const [, h, m] = match;
    if (Number(h) > 23 || Number(m) > 59) return null;
    return new Date(0, 0, 0, Number(h), Number(m));
};

/**
 * Formats a time-only Date back into a "HH:mm" duration string.
 * @param date - DatePicker model value.
 * @returns {string | null} Duration string, or null when the date is null.
 */
export const dateToDuration = (date: Date | null): string | null => {
    if (!date) return null;
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
