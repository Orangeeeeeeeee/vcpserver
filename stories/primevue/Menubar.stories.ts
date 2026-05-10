import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Menubar from 'primevue/menubar';

const meta = {
    title: 'PrimeVue/Menu/Menubar',
    component: Menubar,
    tags: ['autodocs'],
    argTypes: {
        breakpoint: { control: 'text' }
    },
    args: {
        breakpoint: '960px'
    }
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
    {
        label: 'Головна'
    },
    {
        label: 'Проєкти',
        items: [
            { label: 'Новий' },
            { label: 'Список' },
            {
                label: 'Архів',
                items: [{ label: '2024' }, { label: '2023' }]
            }
        ]
    },
    {
        label: 'Команда',
        items: [
            { label: 'Учасники' },
            { label: 'Запросити' }
        ]
    },
    {
        label: 'Налаштування'
    }
];

export const Playground: Story = {
    render: (args) => ({
        components: { Menubar },
        setup() {
            return { args, items };
        },
        template: '<Menubar :model="items" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Menubar },
        data: () => ({ items }),
        template: '<Menubar :model="items" />'
    })
};
