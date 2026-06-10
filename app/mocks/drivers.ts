import type { Driver, DriverStatus } from '~/types/driver';
import { initialsOf } from '~/utils/string';

/** Mock company catalog (drivers domain) */
export const COMPANIES = ['Logistics UA', 'CityBus Group', '1 UA', 'Logistics'];

const TRANSPORT_MODELS = [
    'MAN TGX 18.480',
    'Volvo FH 460',
    'Scania R 500',
    'Mercedes Actros',
    'DAF XF 480',
    'Iveco Stralis'
];

const NAMES = [
    'Василь Прийма',
    'Олена Коваль',
    'Михайло Іщенко',
    'Олександр Гриценко',
    'Юлія Бондар',
    'Андрій Бойко',
    'Тетяна Мельник',
    'Ігор Кравченко',
    'Наталія Шевченко',
    'Сергій Поліщук',
    'Ірина Лисенко',
    'Володимир Ткаченко',
    'Марія Савчук',
    'Дмитро Павленко',
    'Оксана Гаврилюк',
    'Роман Зінченко'
];

/** Mock employment type catalog (for the driver form) */
export const EMPLOYMENT_TYPES = [
    'Повна зайнятість',
    'Часткова зайнятість',
    'Контракт'
];

const LICENSE_CATEGORIES = ['B', 'B, C', 'C', 'C, D', 'B, C, D, E'];

/** Single license categories for the form multiselect (model stores them joined) */
export const LICENSE_CATEGORY_OPTIONS = ['A', 'B', 'C', 'D', 'E'];

/** Seed document names attached to each mock driver */
const DOCUMENT_NAMES = [
    'Водійське посвідчення (скан)',
    'Медична довідка про придатність до керування ТЗ'
];

/** Seed comments cycled across mock drivers for the detail page */
const COMMENTS = [
    'Досвід роботи з вантажними перевезеннями. Закріплений за автомобілем Mercedes-Benz Sprinter. Працює у змінному графіку.',
    'Спеціалізується на міжнародних рейсах ЄС. Має сертифікат ADR на перевезення небезпечних вантажів.',
    'Старший водій бригади. Відповідає за наставництво новачків та контроль маршрутних карток.',
    'Регулярно проходить медогляди без зауважень. Бере участь у тренінгах з економного водіння.',
    'Знає маршрути південного напрямку (Одеса, Миколаїв, Херсон). Має досвід роботи з рефрижераторами.',
    'Виконує переважно нічні рейси по Україні. Без порушень ПДР за останні 3 роки.'
];

/** Pads a number to 2 digits */
const pad2 = (n: number): string => String(n).padStart(2, '0');

/**
 * Picks a status by index. Distributes so each 8-card page surfaces all
 * four statuses (≈63% active, 12-13% each of blocked/vacation/unavailable).
 */
const statusByIndex = (i: number): DriverStatus => {
    const r = i % 8;
    if (r === 2) return 'blocked';
    if (r === 4) return 'vacation';
    if (r === 6) return 'unavailable';
    return 'active';
};

/**
 * Generates 64 mock drivers spread across statuses, companies, transports.
 * @returns Mock driver list for the shared `useDrivers` state
 */
export const generateDrivers = (): Driver[] => {
    return Array.from({ length: 64 }, (_, i) => {
        const name = NAMES[i % NAMES.length] as string;
        const company = COMPANIES[i % COMPANIES.length] as string;
        const transport = TRANSPORT_MODELS[
            i % TRANSPORT_MODELS.length
        ] as string;
        const employment = EMPLOYMENT_TYPES[
            i % EMPLOYMENT_TYPES.length
        ] as string;
        const categories = LICENSE_CATEGORIES[
            i % LICENSE_CATEGORIES.length
        ] as string;
        return {
            id: String(i + 1),
            name,
            initials: initialsOf(name),
            company,
            status: statusByIndex(i),
            transport,
            transportId: `TRK-${112 + i}`,
            phone: `+380 67 ${pad2(458 + (i % 500))} ${pad2(29 + (i % 70))} ${pad2(14 + (i % 80))}`,
            email: `driver${i + 1}@translogistics.ua`,
            license: {
                id: `DL-UA-${78451239 + i}`,
                expiresAt: `${pad2(1 + (i % 28))}.${pad2(1 + (i % 12))}.${2025 + (i % 5)}`,
                categories
            },
            startedAt: `${pad2(1 + (i % 28))}.${pad2(1 + (i % 12))}.${2018 + (i % 8)}`,
            employment,
            comment: COMMENTS[i % COMMENTS.length] as string,
            documents: DOCUMENT_NAMES.map((docName, j) => ({
                id: `doc-${i + 1}-${j + 1}`,
                name: docName,
                previewUrl: '/mock/document-scan.svg'
            }))
        };
    });
};
