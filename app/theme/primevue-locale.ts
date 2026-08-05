import type { PrimeVueLocaleOptions } from 'primevue/config';

/**
 * Ukrainian overrides for the PrimeVue locale (calendar/date related keys).
 * Passed to the PrimeVue `locale` option in `nuxt.config.ts` and Storybook's
 * `preview.ts`; PrimeVue deep-merges it over the built-in English locale, so
 * untranslated keys (aria labels, filter messages etc.) keep their defaults.
 */
export const UK_LOCALE: Partial<PrimeVueLocaleOptions> = {
    firstDayOfWeek: 1,
    dayNames: [
        'Неділя',
        'Понеділок',
        'Вівторок',
        'Середа',
        'Четвер',
        'Пʼятниця',
        'Субота'
    ],
    dayNamesShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
        'Січень',
        'Лютий',
        'Березень',
        'Квітень',
        'Травень',
        'Червень',
        'Липень',
        'Серпень',
        'Вересень',
        'Жовтень',
        'Листопад',
        'Грудень'
    ],
    monthNamesShort: [
        'Січ',
        'Лют',
        'Бер',
        'Кві',
        'Тра',
        'Чер',
        'Лип',
        'Сер',
        'Вер',
        'Жов',
        'Лис',
        'Гру'
    ],
    today: 'Сьогодні',
    clear: 'Очистити',
    weekHeader: 'Тиж',
    dateFormat: 'dd.mm.yy'
};
