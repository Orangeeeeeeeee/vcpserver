/** Return type of the {@link useSidebar} composable */
export interface UseSidebarReturn {
    /** Whether the sidebar is collapsed (desktop) */
    isCollapsed: Ref<boolean>;
    /** Whether the mobile sidebar drawer is open */
    isMobileOpen: Ref<boolean>;
    /** Toggles the sidebar collapsed state */
    toggleCollapse: () => void;
    /** Opens the mobile sidebar drawer */
    openMobile: () => void;
    /** Closes the mobile sidebar drawer */
    closeMobile: () => void;
}

const COOKIE_KEY = 'sidebar-collapsed';

/**
 * Composable for managing sidebar state.
 *
 * Handles desktop collapse (persisted in cookie) and mobile drawer visibility.
 * @returns {UseSidebarReturn} Composable
 */
export const useSidebar = (): UseSidebarReturn => {
    const isCollapsed = useCookie<boolean>(COOKIE_KEY, {
        default: () => false,
        maxAge: 60 * 60 * 24 * 365
    });
    const isMobileOpen = useState('sidebar-mobile-open', () => false);

    /** Toggles the sidebar collapsed state */
    const toggleCollapse = (): void => {
        isCollapsed.value = !isCollapsed.value;
    };

    /** Opens the mobile sidebar drawer */
    const openMobile = (): void => {
        isMobileOpen.value = true;
    };

    /** Closes the mobile sidebar drawer */
    const closeMobile = (): void => {
        isMobileOpen.value = false;
    };

    return {
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        openMobile,
        closeMobile
    };
};
