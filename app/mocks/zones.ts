import type { Zone } from '~/types/zone';
import { mockCompanies } from '~/mocks/companies';

/**
 * Generates mock zones (geometry within Ukraine, coordinates as `[lat, lng]`).
 * Binding ids reference the mock group / vehicle catalogs (`String(i + 1)`).
 * @returns Mock zone list for the shared `useZones` state
 */
export const generateZones = (): Zone[] => [
    {
        id: '1',
        companies: [mockCompanies[0] as string],
        types: ['parking'],
        color: 'rose',
        name: 'Зона «Ромни — Конотоп»',
        description:
            'Робоча зона вантажних перевезень у північно-східному регіоні.',
        geometry: {
            kind: 'polygon',
            points: [
                [51.35, 33.2],
                [51.15, 34.05],
                [50.55, 33.95],
                [50.35, 33.2],
                [50.85, 32.7]
            ]
        },
        groupBindings: [
            {
                ids: ['1', '2'],
                trigger: 'both',
                notificationTypes: ['info'],
                channels: ['site']
            }
        ],
        vehicleBindings: []
    },
    {
        id: '2',
        companies: [mockCompanies[1] as string],
        types: ['loading'],
        color: 'sky',
        name: 'Термінал «Сміла»',
        description: 'Зона завантаження/розвантаження логістичного терміналу.',
        geometry: {
            kind: 'rectangle',
            points: [
                [49.45, 31.3],
                [49.45, 32.15],
                [49.0, 32.15],
                [49.0, 31.3]
            ]
        },
        groupBindings: [
            {
                ids: ['3'],
                trigger: 'enter',
                notificationTypes: ['important'],
                channels: ['site', 'email']
            }
        ],
        vehicleBindings: [
            {
                ids: ['5', '12'],
                trigger: 'exit',
                notificationTypes: ['info'],
                channels: ['site']
            }
        ]
    },
    {
        id: '3',
        companies: [mockCompanies[0] as string, mockCompanies[1] as string],
        types: ['restricted', 'other'],
        color: 'amber',
        name: 'Заборонена зона «Полтава»',
        geometry: {
            kind: 'circle',
            center: [49.52, 34.62],
            radius: 35000
        },
        groupBindings: [],
        vehicleBindings: [
            {
                ids: ['7'],
                trigger: 'enter',
                notificationTypes: ['urgent'],
                channels: ['site', 'email', 'sms']
            }
        ]
    }
];
