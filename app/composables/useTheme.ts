const STORAGE_KEY = 'theme';

export const useTheme = () => {
    const theme = useState<'light' | 'dark'>('theme', () => 'light');

    const isDark = computed(() => theme.value === 'dark');
    const themeIcon = computed(() => (isDark.value ? 'tabler:moon' : 'tabler:sun'));

    const applyTheme = (value: 'light' | 'dark') => {
        document.documentElement.setAttribute('data-theme', value);
    };

    const toggleTheme = () => {
        theme.value = isDark.value ? 'light' : 'dark';
        applyTheme(theme.value);
        localStorage.setItem(STORAGE_KEY, theme.value);
    };

    onMounted(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
        if (stored) {
            theme.value = stored;
            applyTheme(stored);
        }
    });

    return {
        theme,
        isDark,
        themeIcon,
        toggleTheme
    };
};
