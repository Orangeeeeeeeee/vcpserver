import { ref } from 'vue';
import type { UseSidebarReturn } from '../app/composables/useSidebar';

/**
 * Storybook stub for the Nuxt `useSidebar` composable.
 *
 * The real composable relies on `useCookie`/`useState`, which don't exist in
 * the plain Vue/Vite Storybook runtime, so this returns inert state instead.
 * @returns {UseSidebarReturn} No-op sidebar state
 */
export const useSidebar = (): UseSidebarReturn => ({
    isCollapsed: ref(false),
    isMobileOpen: ref(false),
    toggleCollapse: () => {},
    openMobile: () => {},
    closeMobile: () => {}
});
