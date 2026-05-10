import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Divider from 'primevue/divider';

const meta = {
    title: 'PrimeVue/Misc/Divider',
    component: Divider,
    tags: ['autodocs']
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        layout: 'horizontal',
        align: 'center',
        type: 'solid'
    },
    argTypes: {
        layout: {
            control: 'select',
            options: ['horizontal', 'vertical']
        },
        align: {
            control: 'select',
            options: ['left', 'center', 'right', 'top', 'bottom']
        },
        type: {
            control: 'select',
            options: ['solid', 'dashed', 'dotted']
        }
    },
    render: (args) => ({
        components: { Divider },
        setup() {
            return { args };
        },
        template: `
      <div :class="{ 'flex h-48': args.layout === 'vertical' }">
        <p>Контент зверху</p>
        <Divider v-bind="args" />
        <p>Контент знизу</p>
      </div>
    `
    })
};

export const Types: Story = {
    render: () => ({
        components: { Divider },
        template: `
      <div>
        <p>Solid</p>
        <Divider />
        <p>Dashed</p>
        <Divider type="dashed" />
        <p>Dotted</p>
        <Divider type="dotted" />
      </div>
    `
    })
};

export const WithContent: Story = {
    render: () => ({
        components: { Divider },
        template: `
      <div>
        <p>Блок зверху</p>
        <Divider align="left"><span class="text-sm text-surface-500">Ліворуч</span></Divider>
        <p>Блок посередині</p>
        <Divider align="center"><span class="text-sm text-surface-500">По центру</span></Divider>
        <p>Блок знизу</p>
        <Divider align="right"><span class="text-sm text-surface-500">Праворуч</span></Divider>
        <p>Кінець</p>
      </div>
    `
    })
};

export const Vertical: Story = {
    render: () => ({
        components: { Divider },
        template: `
      <div class="flex items-center h-12">
        <span>Елемент 1</span>
        <Divider layout="vertical" />
        <span>Елемент 2</span>
        <Divider layout="vertical" />
        <span>Елемент 3</span>
      </div>
    `
    })
};
