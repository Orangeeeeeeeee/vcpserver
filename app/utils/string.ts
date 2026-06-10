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
