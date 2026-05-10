const COOKIE_KEY = 'sidebar-collapsed';

export const useSidebar = () => {
    const isCollapsed = useCookie<boolean>(COOKIE_KEY, {
        default: () => false,
        maxAge: 60 * 60 * 24 * 365
    });
    const isMobileOpen = useState('sidebar-mobile-open', () => false);

    const toggleCollapse = () => {
        isCollapsed.value = !isCollapsed.value;
    };

    const openMobile = () => {
        isMobileOpen.value = true;
    };

    const closeMobile = () => {
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
