/**
 * Returns 2-letter initials from a full Ukrainian name (e.g. "Василь Прийма" -> "ВП").
 * @param name - Full name with space-separated parts
 * @returns Uppercased initials of the first two name parts
 */
export const initialsOf = (name: string): string => {
    const parts = name.split(' ');
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts[1]?.charAt(0) ?? '';
    return (first + last).toUpperCase();
};

/**
 * Formats an amount breakdown as "count x price = total" (e.g. "9 x 135.8 = 1222.2"),
 * optionally appending a label in parentheses (e.g. "4 x 86.6 = 346.4 (Обухів)").
 * @param count - Number of units (e.g. passengers)
 * @param price - Price per unit
 * @param total - Total amount
 * @param label - Optional label appended in parentheses
 * @returns Formatted breakdown string
 */
export const formatAmountBreakdown = (count: number, price: number, total: number, label?: string): string => {
    const formula = `${count} x ${price} = ${total}`;
    return label ? `${formula} (${label})` : formula;
};

/**
 * Picks the correct Ukrainian plural form for a count (e.g. 1 точка, 2 точки, 5 точок).
 * @param count - Number to pick the form for
 * @param one - Form used for 1, 21, 31... (e.g. "точка")
 * @param few - Form used for 2-4, 22-24... (e.g. "точки")
 * @param many - Form used for 0, 5-20, 25-30... (e.g. "точок")
 * @returns Word in the matching plural form
 */
export const pluralizeUa = (count: number, one: string, few: string, many: string): string => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
};
