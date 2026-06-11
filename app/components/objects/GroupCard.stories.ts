import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GroupCard from './GroupCard.vue';
import type { GroupCardLabels } from './GroupCard.vue';
import type { Group, GroupColor } from '~/types/group';

const meta: Meta<typeof GroupCard> = {
    title: 'Objects/GroupCard',
    component: GroupCard,
    tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof GroupCard>;

const group: Group = {
    id: '1',
    name: 'Вантажні перевезення 1',
    company: 'Logistics UA',
    status: 'active',
    order: 1,
    comment:
        'Група обʼєднує транспортні засоби, що використовуються для виконання регулярних маршрутів між обласними центрами та логістичними хабами компанії.',
    color: 'indigo',
    vehicles: [
        { transport: 'MAN TGX 18.480', transportId: 'TRK-112', type: 'truck' },
        { transport: 'Volvo FH 460', transportId: 'TRK-113', type: 'truck' },
        { transport: 'Scania R 500', transportId: 'TRK-114', type: 'bus' },
        { transport: 'Mercedes Actros', transportId: 'TRK-115', type: 'bus' },
        { transport: 'DAF XF 480', transportId: 'TRK-116', type: 'van' }
    ]
};

const labels: GroupCardLabels = {
    statusActive: 'Активна',
    statusInactive: 'Не активна',
    expand: 'Розгорнути',
    collapse: 'Згорнути',
    menuEdit: 'Редагувати',
    menuDelete: 'Видалити'
};

export const Default: Story = {
    args: { group, labels },
    render: (args) => ({
        components: { GroupCard },
        setup: () => ({ args }),
        template: `
            <div class="p-8 max-w-md">
                <GroupCard
                    :group="args.group"
                    :labels="args.labels"
                    @edit="(g) => console.log('edit', g)"
                    @delete="(g) => console.log('delete', g)"
                />
            </div>
        `
    })
};

export const Inactive: Story = {
    args: { group: { ...group, status: 'inactive', color: 'rose' }, labels },
    render: (args) => ({
        components: { GroupCard },
        setup: () => ({ args }),
        template: `
            <div class="p-8 max-w-md">
                <GroupCard
                    :group="args.group"
                    :labels="args.labels"
                    @edit="(g) => console.log('edit', g)"
                    @delete="(g) => console.log('delete', g)"
                />
            </div>
        `
    })
};

export const FewVehicles: Story = {
    args: {
        group: {
            ...group,
            color: 'teal',
            comment: 'Резервна група для пікових навантажень.',
            vehicles: group.vehicles.slice(0, 2)
        },
        labels
    },
    render: (args) => ({
        components: { GroupCard },
        setup: () => ({ args }),
        template: `
            <div class="p-8 max-w-md">
                <GroupCard
                    :group="args.group"
                    :labels="args.labels"
                    @edit="(g) => console.log('edit', g)"
                    @delete="(g) => console.log('delete', g)"
                />
            </div>
        `
    })
};

export const Colors: Story = {
    render: () => ({
        components: { GroupCard },
        setup() {
            const colors: GroupColor[] = [
                'indigo',
                'teal',
                'violet',
                'sky',
                'rose',
                'amber'
            ];
            const groups: Group[] = colors.map((color, i) => ({
                ...group,
                id: String(i + 1),
                name: `Група ${i + 1}`,
                color,
                status: i % 4 === 3 ? 'inactive' : 'active'
            }));
            return { groups, labels };
        },
        template: `
            <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
                <GroupCard
                    v-for="g in groups"
                    :key="g.id"
                    :group="g"
                    :labels="labels"
                    @edit="(gr) => console.log('edit', gr)"
                    @delete="(gr) => console.log('delete', gr)"
                />
            </div>
        `
    })
};
