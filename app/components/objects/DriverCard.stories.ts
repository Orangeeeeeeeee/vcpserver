import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DriverCard from './DriverCard.vue';
import type { DriverCardLabels } from './DriverCard.vue';
import type { Driver } from '~/types/driver';

const meta: Meta<typeof DriverCard> = {
    title: 'Objects/DriverCard',
    component: DriverCard,
    tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof DriverCard>;

const driver: Driver = {
    id: '1',
    name: 'Василь Прийма',
    initials: 'ВП',
    company: 'Logistics UA',
    status: 'active',
    transport: 'MAN TGX 18.480',
    transportId: 'TRK-112',
    phone: '+380 67 458 29 14',
    email: 'o.koval@translogistics.ua',
    license: {
        id: 'DL-UA-78451239',
        expiresAt: '18.09.2027',
        categories: 'B, C'
    },
    startedAt: '12.04.2022',
    employment: 'Повна зайнятість'
};

const labels: DriverCardLabels = {
    statusActive: 'Активний',
    statusBlocked: 'Заблокований',
    statusVacation: 'У відпустці',
    statusUnavailable: 'Тимчасово недоступний',
    licenseSection: 'Водійські права',
    startedAtLabel: 'Почав працювати',
    employmentLabel: 'Тип зайнятості',
    menuDetails: 'Докладніше',
    menuEdit: 'Редагувати',
    menuDelete: 'Видалити'
};

export const Default: Story = {
    args: { driver, labels },
    render: (args) => ({
        components: { DriverCard },
        setup: () => ({ args }),
        template: `
            <div class="p-8 max-w-md">
                <DriverCard
                    :driver="args.driver"
                    :labels="args.labels"
                    @details="(d) => console.log('details', d)"
                    @edit="(d) => console.log('edit', d)"
                    @delete="(d) => console.log('delete', d)"
                />
            </div>
        `
    })
};

export const Blocked: Story = {
    args: { driver: { ...driver, status: 'blocked' }, labels },
    render: (args) => ({
        components: { DriverCard },
        setup: () => ({ args }),
        template: `
            <div class="p-8 max-w-md">
                <DriverCard
                    :driver="args.driver"
                    :labels="args.labels"
                    @details="(d) => console.log('details', d)"
                    @edit="(d) => console.log('edit', d)"
                    @delete="(d) => console.log('delete', d)"
                />
            </div>
        `
    })
};

export const Vacation: Story = {
    args: { driver: { ...driver, status: 'vacation' }, labels },
    render: (args) => ({
        components: { DriverCard },
        setup: () => ({ args }),
        template: `
            <div class="p-8 max-w-md">
                <DriverCard
                    :driver="args.driver"
                    :labels="args.labels"
                    @details="(d) => console.log('details', d)"
                    @edit="(d) => console.log('edit', d)"
                    @delete="(d) => console.log('delete', d)"
                />
            </div>
        `
    })
};

export const Unavailable: Story = {
    args: { driver: { ...driver, status: 'unavailable' }, labels },
    render: (args) => ({
        components: { DriverCard },
        setup: () => ({ args }),
        template: `
            <div class="p-8 max-w-md">
                <DriverCard
                    :driver="args.driver"
                    :labels="args.labels"
                    @details="(d) => console.log('details', d)"
                    @edit="(d) => console.log('edit', d)"
                    @delete="(d) => console.log('delete', d)"
                />
            </div>
        `
    })
};

export const Grid: Story = {
    render: () => ({
        components: { DriverCard },
        setup() {
            const second: Driver = {
                ...driver,
                id: '2',
                name: 'Олена Коваль',
                initials: 'ОК',
                company: 'CityBus Group',
                status: 'blocked',
                transport: 'Volvo FH 460',
                transportId: 'TRK-118',
                phone: '+380 50 123 45 67',
                email: 'o.kovalenko@citybus.ua',
                license: {
                    id: 'DL-UA-12039847',
                    expiresAt: '04.11.2029',
                    categories: 'C, D, E'
                },
                startedAt: '03.07.2020',
                employment: 'Часткова зайнятість'
            };
            return { driver, second, labels };
        },
        template: `
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <DriverCard
                    :driver="driver"
                    :labels="labels"
                    @details="(d) => console.log('details', d)"
                    @edit="(d) => console.log('edit', d)"
                    @delete="(d) => console.log('delete', d)"
                />
                <DriverCard
                    :driver="second"
                    :labels="labels"
                    @details="(d) => console.log('details', d)"
                    @edit="(d) => console.log('edit', d)"
                    @delete="(d) => console.log('delete', d)"
                />
            </div>
        `
    })
};
