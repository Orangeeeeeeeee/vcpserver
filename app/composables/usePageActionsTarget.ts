/**
 * Returns a reactive teleport target for the page's primary action button.
 *
 * On mobile the button lands next to the page title (`#page-actions-header`);
 * on tablet+ it moves to the actions row below the breadcrumb
 * (`#page-actions-target`), avoiding overlap with the breadcrumb that spans
 * the full first header row on wider viewports.
 *
 * @returns Computed ref with the CSS id selector for `<SharedClientTeleport :to>`
 */
export function usePageActionsTarget(): ComputedRef<string> {
    const isTablet = useMediaQuery('(min-width: 768px)');
    return computed(() => (isTablet.value ? '#page-actions-target' : '#page-actions-header'));
}
