/** A single slot in the pagination strip: a page number or a gap marker. */
export type PaginationItem = number | 'ellipsis';

/**
 * Build the pagination strip with boundary pages and ellipsis gaps.
 * @param currentPage - 1-based active page.
 * @param totalPages - total number of pages (>= 0).
 * @param siblingCount - page numbers shown on each side of the current page.
 * @param boundaryCount - page numbers always shown at the very start and end.
 * @param expand - when true (default), pad the near-edge block to a stable width
 *   (e.g. `1 2 3 4 5 … 9`); when false, keep it minimal (e.g. `1 2 … 9`) — used for
 *   the compact mobile strip.
 * @returns {PaginationItem[]} e.g. `[1, 'ellipsis', 4, 5, 6, 'ellipsis', 8]`.
 */
export const getPaginationRange = (
    currentPage: number,
    totalPages: number,
    siblingCount = 1,
    boundaryCount = 1,
    expand = true
): PaginationItem[] => {
    /** Inclusive integer range `[start, end]`. */
    const range = (start: number, end: number): number[] =>
        Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);

    const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
    if (totalPages <= totalNumbers) return range(1, totalPages);

    const leftSibling = Math.max(currentPage - siblingCount, boundaryCount + 1);
    const rightSibling = Math.min(
        currentPage + siblingCount,
        totalPages - boundaryCount
    );

    const showLeftEllipsis = leftSibling > boundaryCount + 2;
    const showRightEllipsis = rightSibling < totalPages - boundaryCount - 1;

    const startPages = range(1, boundaryCount);
    const endPages = range(totalPages - boundaryCount + 1, totalPages);

    if (!showLeftEllipsis && showRightEllipsis) {
        const end = expand
            ? Math.max(boundaryCount + 1, siblingCount * 2 + 2 + boundaryCount)
            : Math.max(boundaryCount + 1, currentPage + siblingCount);
        return [...range(1, end), 'ellipsis', ...endPages];
    }
    if (showLeftEllipsis && !showRightEllipsis) {
        const start = expand
            ? totalPages - Math.max(boundaryCount, siblingCount * 2 + 1 + boundaryCount)
            : Math.min(totalPages - boundaryCount, currentPage - siblingCount);
        return [...startPages, 'ellipsis', ...range(start, totalPages)];
    }
    if (showLeftEllipsis && showRightEllipsis) {
        return [
            ...startPages,
            'ellipsis',
            ...range(leftSibling, rightSibling),
            'ellipsis',
            ...endPages
        ];
    }
    return range(1, totalPages);
};
