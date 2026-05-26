import type {
    Currency,
    MenuPosition,
    TimeFormat,
    UnitsSystem
} from '~/constants/settings';

export interface NotificationContact {
    /** Stable identifier */
    id: string;
    /** Email address or phone number */
    value: string;
    /** Whether the contact has been verified (vs pending) */
    verified: boolean;
}

export interface AccountSettings {
    /** Interface language code */
    language: string;
    /** 24h vs 12h time format */
    timeFormat: TimeFormat;
    /** IANA timezone identifier */
    timezone: string;
    /** Display currency */
    currency: Currency;
    /** Side of the sidebar (preference only — sidebar move not implemented) */
    menuPosition: MenuPosition;
    /** Measurement system */
    units: UnitsSystem;
    /** Email contacts subscribed to push notifications */
    notificationEmails: NotificationContact[];
    /** Phone contacts subscribed to push notifications */
    notificationPhones: NotificationContact[];
}

/** Return type of the {@link useAccountSettings} composable */
export interface UseAccountSettingsReturn {
    /** Reactive shared account settings */
    settings: Ref<AccountSettings>;
}

/**
 * Provides the current account settings (mock data shared via useState).
 * Theme lives separately in {@link useTheme}; this composable holds everything else.
 * @returns {UseAccountSettingsReturn} Composable
 */
export const useAccountSettings = (): UseAccountSettingsReturn => {
    const settings = useState<AccountSettings>('account-settings', () => ({
        language: 'uk',
        timeFormat: '24h',
        timezone: 'Europe/Kyiv',
        currency: 'UAH',
        menuPosition: 'left',
        units: 'metric',
        notificationEmails: [
            { id: '1', value: 'olivia@untitledui.com', verified: true },
            { id: '2', value: 'olivia.rhye@untitledui.com', verified: true },
            { id: '3', value: 'oli@untitledui.com', verified: true },
            { id: '4', value: 'oli@untitledui.com', verified: false }
        ],
        notificationPhones: [
            { id: '1', value: '+38 (098) 888 88 88', verified: true },
            { id: '2', value: '+38 (098) 888 88 88', verified: true },
            { id: '3', value: '+38 (098) 888 88 88', verified: false },
            { id: '4', value: '+38 (098) 888 88 88', verified: false }
        ]
    }));

    return { settings };
};
