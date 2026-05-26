export type TimeFormat = '24h' | '12h';
export type Currency = 'UAH' | 'USD' | 'EUR';
export type MenuPosition = 'left' | 'right';
export type UnitsSystem = 'metric' | 'imperial-uk' | 'imperial-us';

export interface SelectOption<T extends string = string> {
    /** Stored value */
    value: T;
    /** i18n key for the display label */
    labelKey: string;
}

export interface LanguageOption extends SelectOption {
    /** Icon name in the `custom:` collection (e.g. `custom:ua`) */
    flag: string;
}

export const LANGUAGES: LanguageOption[] = [
    {
        value: 'uk',
        labelKey: 'account.settings.languageNames.uk',
        flag: 'custom:ua'
    },
    {
        value: 'cs',
        labelKey: 'account.settings.languageNames.cs',
        flag: 'custom:cz'
    },
    {
        value: 'de',
        labelKey: 'account.settings.languageNames.de',
        flag: 'custom:de'
    },
    {
        value: 'lv',
        labelKey: 'account.settings.languageNames.lv',
        flag: 'custom:lv'
    },
    {
        value: 'ro',
        labelKey: 'account.settings.languageNames.ro',
        flag: 'custom:md'
    },
    {
        value: 'pl',
        labelKey: 'account.settings.languageNames.pl',
        flag: 'custom:pl'
    },
    {
        value: 'sk',
        labelKey: 'account.settings.languageNames.sk',
        flag: 'custom:sk'
    }
];

export const TIMEZONES: SelectOption[] = [
    { value: 'Europe/Kyiv', labelKey: 'account.settings.timezones.kyiv' },
    { value: 'Europe/Warsaw', labelKey: 'account.settings.timezones.warsaw' },
    { value: 'Europe/London', labelKey: 'account.settings.timezones.london' }
];

export const TIME_FORMATS: SelectOption<TimeFormat>[] = [
    { value: '24h', labelKey: 'account.settings.timeFormat24h' },
    { value: '12h', labelKey: 'account.settings.timeFormat12h' }
];

export const CURRENCIES: SelectOption<Currency>[] = [
    { value: 'UAH', labelKey: 'account.settings.currencyUAH' },
    { value: 'USD', labelKey: 'account.settings.currencyUSD' },
    { value: 'EUR', labelKey: 'account.settings.currencyEUR' }
];

export const THEME_OPTIONS: SelectOption<'light' | 'dark'>[] = [
    { value: 'light', labelKey: 'account.settings.themeLight' },
    { value: 'dark', labelKey: 'account.settings.themeDark' }
];

export const MENU_POSITIONS: SelectOption<MenuPosition>[] = [
    { value: 'left', labelKey: 'account.settings.menuLeft' },
    { value: 'right', labelKey: 'account.settings.menuRight' }
];

export const UNITS_SYSTEMS: SelectOption<UnitsSystem>[] = [
    { value: 'metric', labelKey: 'account.settings.unitsMetric' },
    { value: 'imperial-uk', labelKey: 'account.settings.unitsImperialUk' },
    { value: 'imperial-us', labelKey: 'account.settings.unitsImperialUs' }
];
