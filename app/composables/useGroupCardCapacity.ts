/** Minimum item rows shown while a group card is collapsed (SSR / pre-measure baseline) */
export const GROUP_CARD_BASELINE_ROWS = 3;

/**
 * Attribute set on an expanded card's root element. Sibling cards in the same
 * grid check it to pause their own capacity measurement, so a temporarily
 * inflated row (a neighbor expanded in-flow) never bakes extra rows into a
 * collapsed card's natural height.
 */
export const GROUP_CARD_EXPANDED_ATTR = 'data-group-card-expanded';

/** Extra tolerance for fractional layout rounding, px */
const EPSILON_PX = 1;

/**
 * Delay after collapsing before measurement resumes: SharedAnimatedHeight's
 * 300ms grid-template-rows transition plus a safety margin, so geometry is
 * measured only once it has settled.
 */
const SETTLE_DELAY_MS = 350;

/**
 * Toggle button height shared across all group cards (same typography/icon
 * everywhere). Cached at module level because the toggle unmounts once the
 * full list fits, yet its height is still needed when the card later shrinks.
 * It is guaranteed to be measured at hydration whenever any card has more
 * items than the baseline, since SSR renders the toggle in that case.
 */
let cachedToggleHeight: number | null = null;

export interface UseGroupCardCapacityParams {
    /** Card root element — grid-stretched flex column, observed for resizes */
    cardRef: Ref<HTMLElement | null>;
    /** Card body element (the `p-3 flex flex-1 flex-col gap-2` wrapper) */
    bodyRef: Ref<HTMLElement | null>;
    /** The head item list `<ul>` element (always-visible rows) */
    listRef: Ref<HTMLElement | null>;
    /** Expand toggle button element, `null` while not rendered */
    toggleRef: Ref<HTMLElement | null>;
    /** Total number of items in the full list */
    itemCount: MaybeRefOrGetter<number>;
    /** In-flow expanded state: measurement is paused while `true` */
    expanded: Ref<boolean>;
}

export interface UseGroupCardCapacityReturn {
    /** Item rows to render while collapsed (baseline before the first measure) */
    visibleCount: ComputedRef<number>;
    /** Whether the expand/collapse toggle must be rendered */
    showToggle: ComputedRef<boolean>;
}

/**
 * Measures how many item rows fit inside a grid-stretched group card.
 *
 * Group cards live in a CSS grid with default `align-items: stretch`, so every
 * card in a row is as tall as its tallest sibling and shorter cards have free
 * space at the bottom. Instead of always slicing the list to a fixed count,
 * this composable measures that free space: when the full list fits, all items
 * are shown and the toggle is hidden; otherwise as many rows as fit (never
 * fewer than {@link GROUP_CARD_BASELINE_ROWS}) are shown plus the toggle.
 *
 * DOM contract: the head rows (`visibleCount` first items) live in `listRef`;
 * the tail lives right below inside a `<SharedAnimatedHeight>` and expands
 * in-flow, growing the card and the grid row. Expanding/collapsing never
 * mounts or unmounts rows — the slice boundary only moves on real re-measures.
 *
 * Stability: capacity is only recomputed on settled, fully-collapsed grid
 * geometry. While this card or any sibling card in the same grid is expanded
 * (marked via {@link GROUP_CARD_EXPANDED_ATTR}), and for {@link SETTLE_DELAY_MS}
 * after collapsing (the height animation), measurement is paused — otherwise
 * collapsed neighbors would fill the temporarily inflated row with extra rows
 * and permanently ratchet the row height up. At settled geometry the rendered
 * count always satisfies `renderedHeight <= currentStretchedHeight (+1px)`, so
 * the grid row never grows because of this logic.
 *
 * SSR-safe: the server and the initial client render show the baseline slice
 * (identical to the old fixed-count behavior); measurement kicks in on mount.
 *
 * @param params Element refs, item count and expanded state of the card
 * @returns {UseGroupCardCapacityReturn} Collapsed row count and toggle visibility
 */
export const useGroupCardCapacity = (
    params: UseGroupCardCapacityParams
): UseGroupCardCapacityReturn => {
    const { cardRef, bodyRef, listRef, toggleRef, itemCount, expanded } =
        params;

    /** Measured row capacity; `null` until the first client-side measure */
    const capacity = ref<number | null>(null);

    /** True while the collapse height animation is settling */
    const settling = ref<boolean>(false);

    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const visibleCount = computed<number>(() => {
        const total = toValue(itemCount);
        return capacity.value === null
            ? Math.min(GROUP_CARD_BASELINE_ROWS, total)
            : Math.min(capacity.value, total);
    });

    const showToggle = computed<boolean>(
        () => toValue(itemCount) > visibleCount.value
    );

    /** Whether any card in the same grid is currently expanded (or settling) */
    const hasExpandedSibling = (): boolean =>
        !!cardRef.value?.parentElement?.querySelector(
            `[${GROUP_CARD_EXPANDED_ATTR}]`
        );

    /** Whether measurement must be skipped at the moment */
    const isFrozen = (): boolean =>
        expanded.value || settling.value || hasExpandedSibling();

    /** Reserved height for the toggle row: button height + body flex gap */
    const toggleReserve = (bodyGap: number): number =>
        (cachedToggleHeight ?? 0) + bodyGap;

    /**
     * Bottom edge of the card's content box (the body is `flex-1`, so its
     * bottom minus its own padding is exactly where content must end).
     */
    const contentLimit = (body: HTMLElement): number =>
        body.getBoundingClientRect().bottom -
        parseFloat(getComputedStyle(body).paddingBottom);

    /** Recomputes the row capacity from the current DOM geometry */
    const recompute = (): void => {
        if (isFrozen()) return;
        const total = toValue(itemCount);
        if (total <= GROUP_CARD_BASELINE_ROWS) {
            capacity.value = null;
            return;
        }
        const body = bodyRef.value;
        const list = listRef.value;
        // Only visible head rows are considered (zero-height rows are a hedge)
        const rows = list
            ? Array.from(list.children).filter(
                  (row) => row.getBoundingClientRect().height > 0
              )
            : [];
        if (!body || !list || rows.length === 0) return;

        if (toggleRef.value) {
            cachedToggleHeight = toggleRef.value.getBoundingClientRect().height;
        }

        const bodyGap = parseFloat(getComputedStyle(body).rowGap) || 0;
        const listGap = parseFloat(getComputedStyle(list).rowGap) || 0;
        const available = contentLimit(body) - list.getBoundingClientRect().top;
        // Max over rendered rows: a conservative hedge for wrapped rows below `md`
        const rowHeight = Math.max(
            ...rows.map((row) => row.getBoundingClientRect().height)
        );

        const fullListHeight = total * rowHeight + (total - 1) * listGap;
        if (fullListHeight <= available + EPSILON_PX) {
            capacity.value = total;
            return;
        }

        const availableWithToggle = available - toggleReserve(bodyGap);
        const fitting = Math.floor(
            (availableWithToggle + listGap) / (rowHeight + listGap)
        );
        capacity.value = Math.min(
            Math.max(fitting, GROUP_CARD_BASELINE_ROWS),
            total - 1
        );
    };

    /**
     * After the measured capacity is rendered, verify the actual list bottom
     * (rows may be taller than the first-row estimate when they wrap). Only
     * ever decrements, so it terminates.
     */
    const clampAfterRender = (): void => {
        if (isFrozen() || capacity.value === null || !showToggle.value) return;
        const body = bodyRef.value;
        const list = listRef.value;
        if (!body || !list) return;
        const bodyGap = parseFloat(getComputedStyle(body).rowGap) || 0;
        const overflows =
            list.getBoundingClientRect().bottom >
            contentLimit(body) - toggleReserve(bodyGap) + EPSILON_PX;
        if (overflows && capacity.value > GROUP_CARD_BASELINE_ROWS) {
            capacity.value -= 1;
        }
    };

    watch(capacity, () => nextTick(clampAfterRender), { flush: 'post' });

    watch(() => toValue(itemCount), recompute, { flush: 'post' });

    // Mark the card while expanded so siblings pause their measurement; the
    // mark is lifted only after the collapse animation settles, then a single
    // recompute runs on the final geometry (the viewport may have changed
    // while measurement was paused).
    watch(expanded, (value) => {
        if (settleTimer !== null) clearTimeout(settleTimer);
        if (value) {
            settling.value = false;
            cardRef.value?.setAttribute(GROUP_CARD_EXPANDED_ATTR, '');
            return;
        }
        settling.value = true;
        settleTimer = setTimeout(() => {
            settling.value = false;
            cardRef.value?.removeAttribute(GROUP_CARD_EXPANDED_ATTR);
            recompute();
        }, SETTLE_DELAY_MS);
    });

    onMounted(() => {
        recompute();
        // A late font swap changes row heights without necessarily resizing
        // a non-tallest card, which the ResizeObserver would miss.
        document.fonts?.ready.then(recompute);

        const card = cardRef.value;
        if (!card) return;
        const observer = new ResizeObserver(() => recompute());
        observer.observe(card);
        onBeforeUnmount(() => {
            observer.disconnect();
            if (settleTimer !== null) clearTimeout(settleTimer);
        });
    });

    return { visibleCount, showToggle };
};
