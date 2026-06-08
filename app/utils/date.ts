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
