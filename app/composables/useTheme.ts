/** Possible theme values */
export type Theme = 'light' | 'dark';

/** Return type of the {@link useTheme} composable */
export interface UseThemeReturn {
    /** Current theme stored in cookie */
    theme: Ref<Theme>;
    /** Whether dark theme is active */
    isDark: ComputedRef<boolean>;
    /** Current theme icon (`tabler:moon` / `tabler:sun`) */
    themeIcon: ComputedRef<string>;
    /** Toggles theme between `light` and `dark` */
    toggleTheme: () => void;
}

const COOKIE_KEY = 'theme';

/**
 * Composable for managing the application theme.
 *
 * Stores the selected theme in a cookie and sets the `data-theme`
 * attribute on the document root element.
 * @returns {UseThemeReturn} Composable
 */
export const useTheme = (): UseThemeReturn => {
    const themeCookie = useCookie<Theme>(COOKIE_KEY, {
        default: () => 'light',
        maxAge: 60 * 60 * 24 * 365
    });

    const isDark = computed(() => themeCookie.value === 'dark');
    const themeIcon = computed(() =>
        isDark.value ? 'tabler:moon' : 'tabler:sun'
    );

    /** Applies theme to the DOM by setting the `data-theme` attribute */
    const applyTheme = (value: Theme): void => {
        document.documentElement.setAttribute('data-theme', value);
    };

    /** Toggles theme between `light` and `dark` */
    const toggleTheme = (): void => {
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
