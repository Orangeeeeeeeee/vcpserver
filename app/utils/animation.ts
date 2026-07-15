/** Sliding speed of collapse/expand animations in px per ms */
export const COLLAPSE_SPEED_PX_PER_MS = 1.2;

/** Shortest allowed collapse/expand animation duration in ms */
export const COLLAPSE_MIN_DURATION_MS = 150;

/** Longest allowed collapse/expand animation duration in ms */
export const COLLAPSE_MAX_DURATION_MS = 450;

/**
 * Computes the collapse/expand animation duration for a travel distance,
 * keeping the sliding speed roughly constant and clamping to sane bounds.
 *
 * @param distancePx - Height difference the animation travels, in px
 * @returns Duration in ms
 */
export const collapseDurationFor = (distancePx: number): number =>
    Math.min(
        COLLAPSE_MAX_DURATION_MS,
        Math.max(
            COLLAPSE_MIN_DURATION_MS,
            Math.round(Math.abs(distancePx) / COLLAPSE_SPEED_PX_PER_MS)
        )
    );

/**
 * True when the user prefers reduced motion (animations should be skipped).
 *
 * @returns Reduced-motion media query state (false during SSR)
 */
export const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Silently stops a running animation without firing its finish/cancel
 * handlers (used before replacing it with a new one).
 *
 * @param animation - Animation to stop; null is a no-op
 */
export const stopAnimationSilently = (animation: Animation | null): void => {
    if (!animation) return;
    animation.onfinish = null;
    animation.oncancel = null;
    animation.cancel();
};
