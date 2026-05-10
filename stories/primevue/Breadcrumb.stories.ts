import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Breadcrumb from 'primevue/breadcrumb';

const meta = {
    title: 'PrimeVue/Menu/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    argTypes: {},
    args: {}
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => ({
        components: { Breadcrumb },
        setup() {
            return {
                args,
                home: { label: 'Головна', url: '#' },
                items: [
                    { label: 'Проєкти', url: '#' },
                    { label: 'VCPServer', url: '#' },
                    { label: 'Налаштування' }
                ]
            };
        },
        template: '<Breadcrumb :home="home" :model="items" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Breadcrumb },
        data: () => ({
            home: { label: 'Головна', url: '#' },
            items: [
                { label: 'Проєкти', url: '#' },
                { label: 'VCPServer', url: '#' },
                { label: 'Налаштування' }
            ]
        }),
        template: '<Breadcrumb :home="home" :model="items" />'
    })
};
