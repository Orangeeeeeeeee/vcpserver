const COOKIE_KEY = 'theme';

export const useTheme = () => {
    const themeCookie = useCookie<'light' | 'dark'>(COOKIE_KEY, {
        default: () => 'light',
        maxAge: 60 * 60 * 24 * 365
    });

    const isDark = computed(() => themeCookie.value === 'dark');
    const themeIcon = computed(() =>
        isDark.value ? 'tabler:moon' : 'tabler:sun'
    );

    const applyTheme = (value: 'light' | 'dark') => {
        document.documentElement.setAttribute('data-theme', value);
    };

    const toggleTheme = () => {
        themeCookie.value = isDark.value ? 'light' : 'dark';
        applyTheme(themeCookie.value);
    };

    onMounted(() => {
        applyTheme(themeCookie.value);
    });

    return {
        theme: themeCookie,
        isDark,
        themeIcon,
        toggleTheme
    };
};
