export interface AccountProfile {
    /** First name */
    firstName: string;
    /** Last name */
    lastName: string;
    /** Email address */
    email: string;
    /** Phone number */
    phone: string;
    /** Affiliated organizations */
    affiliations: string[];
    /** Avatar image source (blob: object URL or remote URL) */
    avatarUrl?: string;
}

/** Return type of the {@link useAccountProfile} composable */
export interface UseAccountProfileReturn {
    /** Current account profile (shared, reactive) */
    profile: Ref<AccountProfile>;
    /** Selectable affiliation options */
    affiliationOptions: string[];
    /** Avatar initials derived from the first and last name */
    initials: ComputedRef<string>;
    /** Stores the chosen File as the profile avatar via an object URL */
    setAvatarFromFile: (file: File) => void;
}

/** Mock affiliation options (placeholder until a backend exists) */
const AFFILIATION_OPTIONS = ['Logistic UA', 'Transport KZ', 'Carrier PL'];

/**
 * Provides the current account profile (mock data shared via useState) along
 * with the selectable affiliation options and the computed avatar initials.
 * @returns {UseAccountProfileReturn} Composable
 */
export const useAccountProfile = (): UseAccountProfileReturn => {
    const profile = useState<AccountProfile>('account-profile', () => ({
        firstName: 'Olivia',
        lastName: 'Rhye',
        email: 'olivia.rhye@untitledui.com',
        phone: '+38 (098) 888 88 88',
        affiliations: ['Logistic UA']
    }));

    const initials = computed((): string =>
        `${profile.value.firstName[0] ?? ''}${profile.value.lastName[0] ?? ''}`.toUpperCase()
    );

    const setAvatarFromFile = (file: File): void => {
        if (!file.type.startsWith('image/')) return;
        const previous = profile.value.avatarUrl;
        const objectUrl = URL.createObjectURL(file);
        profile.value = { ...profile.value, avatarUrl: objectUrl };
        if (previous?.startsWith('blob:')) URL.revokeObjectURL(previous);
    };

    return {
        profile,
        affiliationOptions: AFFILIATION_OPTIONS,
        initials,
        setAvatarFromFile
    };
};
