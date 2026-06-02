/**
 * Reactive boolean that tracks a CSS media query.
 *
 * SSR-safe: defaults to `false` on the server and during the initial client
 * render, then updates on mount and on every `change` event from the
 * MediaQueryList.
 *
 * @param query CSS media query string, e.g. `(min-width: 768px)`
 * @returns Reactive ref that is `true` while the query matches
 */
export const useMediaQuery = (query: string): Ref<boolean> => {
    const matches = ref<boolean>(false);

    onMounted(() => {
        const mql = window.matchMedia(query);
        matches.value = mql.matches;
        const handler = (e: MediaQueryListEvent): void => {
            matches.value = e.matches;
        };
        mql.addEventListener('change', handler);
        onBeforeUnmount(() => mql.removeEventListener('change', handler));
    });

    return matches;
};
