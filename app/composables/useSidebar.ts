const STORAGE_KEY = 'sidebar-collapsed';

export const useSidebar = () => {
    const isCollapsed = useState('sidebar-collapsed', () => false);
    const isMobileOpen = useState('sidebar-mobile-open', () => false);

    const toggleCollapse = () => {
        isCollapsed.value = !isCollapsed.value;
        localStorage.setItem(STORAGE_KEY, String(isCollapsed.value));
    };

    const openMobile = () => {
        isMobileOpen.value = true;
    };

    const closeMobile = () => {
        isMobileOpen.value = false;
    };

    onMounted(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            isCollapsed.value = stored === 'true';
        }
    });

    return {
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        openMobile,
        closeMobile
    };
};
