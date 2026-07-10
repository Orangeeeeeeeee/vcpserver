import type { RouteGroup } from '~/types/route-group';
import { mockCompanies } from '~/mocks/companies';

/** Comments cycled across the mock route groups (some groups keep none) */
const GROUP_COMMENTS: string[] = [
    'Маршрути для перевезення негабаритних вантажів, що потребують попереднього узгодження з дорожніми службами',
    'Регулярні пасажирські рейси між обласними центрами',
    'Маршрути з підвищеними вимогами до контролю швидкості'
];

/** Display names cycled across the mock route groups */
const GROUP_NAMES: string[] = [
    'Негабаритні перевезення',
    'Міжобласні рейси',
    'Приміські маршрути',
    'Нічні перевезення',
    'Експрес-доставка',
    'Туристичні напрямки'
];

/**
 * Builds the deterministic mock list behind the «Групи» page of the routes
 * section. Route ids reference the routes of `generateRoutes()` (ids "1".."48").
 * Replaced by the real API later.
 * @returns {RouteGroup[]} Mock route groups.
 */
export const generateRouteGroups = (): RouteGroup[] =>
    Array.from({ length: 12 }, (_, i) => {
        const routeCount = 2 + (i % 5); // 2..6 routes per group
        return {
            id: String(i + 1),
            name: `${GROUP_NAMES[i % GROUP_NAMES.length]} ${1 + Math.floor(i / GROUP_NAMES.length)}`,
            company: mockCompanies[i % mockCompanies.length] as string,
            status: i % 4 === 3 ? 'inactive' : 'active',
            order: i + 1,
            comment:
                i % 3 === 2
                    ? undefined
                    : GROUP_COMMENTS[i % GROUP_COMMENTS.length],
            routeIds: Array.from({ length: routeCount }, (_, r) =>
                String(1 + ((i * 7 + r * 5) % 48))
            )
        } satisfies RouteGroup;
    });
