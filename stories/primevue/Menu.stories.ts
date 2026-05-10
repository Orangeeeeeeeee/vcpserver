import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, useTemplateRef } from 'vue';
import Menu from 'primevue/menu';
import Button from 'primevue/button';

const meta = {
    title: 'PrimeVue/Menu/Menu',
    component: Menu,
    tags: ['autodocs'],
    argTypes: {
        popup: { control: 'boolean' }
    },
    args: {
        popup: false
    }
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
    {
        label: 'Файл',
        items: [{ label: 'Новий' }, { label: 'Відкрити' }]
    },
    {
        label: 'Редагування',
        items: [{ label: 'Скасувати' }, { label: 'Повторити' }]
    }
];

export const Playground: Story = {
    render: (args) =>
        defineComponent({
            components: { Menu, Button },
            setup() {
                const menu = useTemplateRef<InstanceType<typeof Menu>>('menu');
                return {
                    args,
                    items,
                    toggle: (event: Event) => menu.value?.toggle(event)
                };
            },
            template: `
      <div>
        <Button v-if="args.popup" label="Меню" @click="toggle" />
        <Menu ref="menu" :model="items" v-bind="args" />
      </div>
    `
        })
};

export const Basic: Story = {
    render: () => ({
        components: { Menu },
        data: () => ({ items }),
        template: '<Menu :model="items" />'
    })
};

export const Popup: Story = {
    render: () =>
        defineComponent({
            components: { Menu, Button },
            setup() {
                const menu = useTemplateRef<InstanceType<typeof Menu>>('menu');
                return {
                    items: [
                        { label: 'Профіль' },
                        { label: 'Налаштування' },
                        { separator: true },
                        { label: 'Вийти' }
                    ],
                    toggle: (event: Event) => menu.value?.toggle(event)
                };
            },
            template: `
      <div>
        <Button label="Меню" @click="toggle" />
        <Menu ref="menu" :model="items" popup />
      </div>
    `
        })
};
