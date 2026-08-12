/** Return type of the {@link useSidebar} composable */
export interface UseSidebarReturn {
    /** Whether the sidebar is collapsed (desktop) */
    isCollapsed: Ref<boolean>;
    /** Whether the tablet overlay sidebar is expanded (not persisted) */
    isTabletExpanded: Ref<boolean>;
    /** Whether the mobile sidebar drawer is open */
    isMobileOpen: Ref<boolean>;
    /** Whether the sidebar is positioned on the right side */
    isRight: ComputedRef<boolean>;
    /** Toggles the sidebar collapsed state */
    toggleCollapse: () => void;
    /** Toggles the tablet overlay expanded state */
    toggleTabletExpanded: () => void;
    /** Collapses the tablet overlay sidebar */
    closeTabletExpanded: () => void;
    /** Opens the mobile sidebar drawer */
    openMobile: () => void;
    /** Closes the mobile sidebar drawer */
    closeMobile: () => void;
}

const COOKIE_KEY = 'sidebar-collapsed';

/**
 * Composable for managing sidebar state.
 *
 * Handles desktop collapse (persisted in cookie), the tablet overlay
 * expanded state (session-only, never touches the desktop cookie) and
 * mobile drawer visibility.
 * @returns {UseSidebarReturn} Composable
 */
export const useSidebar = (): UseSidebarReturn => {
    const isCollapsed = useCookie<boolean>(COOKIE_KEY, {
        default: () => false,
        maxAge: 60 * 60 * 24 * 365
    });
    const isTabletExpanded = useState('sidebar-tablet-expanded', () => false);
    const isMobileOpen = useState('sidebar-mobile-open', () => false);
    const { settings } = useAccountSettings();

    /** Whether the sidebar is positioned on the right side */
    const isRight = computed(
        (): boolean => settings.value.menuPosition === 'right'
    );

    /** Toggles the sidebar collapsed state */
    const toggleCollapse = (): void => {
        isCollapsed.value = !isCollapsed.value;
    };

    /** Toggles the tablet overlay expanded state */
    const toggleTabletExpanded = (): void => {
        isTabletExpanded.value = !isTabletExpanded.value;
    };

    /** Collapses the tablet overlay sidebar */
    const closeTabletExpanded = (): void => {
        isTabletExpanded.value = false;
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
        isTabletExpanded,
        isMobileOpen,
        isRight,
        toggleCollapse,
        toggleTabletExpanded,
        closeTabletExpanded,
        openMobile,
        closeMobile
    };
};
