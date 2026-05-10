import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TabMenu from 'primevue/tabmenu';

const meta = {
    title: 'PrimeVue/Menu/TabMenu',
    component: TabMenu,
    tags: ['autodocs']
} satisfies Meta<typeof TabMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {},
    argTypes: {},
    render: (args) => ({
        components: { TabMenu },
        setup() {
            return { args };
        },
        data: () => ({
            active: 0,
            items: [
                { label: 'Головна' },
                { label: 'Календар' },
                { label: 'Документи' },
                { label: 'Налаштування' }
            ]
        }),
        template:
            '<TabMenu v-model:activeIndex="active" :model="items" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { TabMenu },
        data: () => ({
            active: 0,
            items: [
                { label: 'Головна' },
                { label: 'Календар' },
                { label: 'Документи' },
                { label: 'Налаштування' }
            ]
        }),
        template: '<TabMenu v-model:activeIndex="active" :model="items" />'
    })
};
