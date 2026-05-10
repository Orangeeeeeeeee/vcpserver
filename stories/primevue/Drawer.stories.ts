import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';

const meta = {
    title: 'PrimeVue/Overlay/Drawer',
    component: Drawer,
    tags: ['autodocs'],
    argTypes: {
        header: { control: 'text' },
        position: {
            control: 'select',
            options: ['left', 'right', 'top', 'bottom']
        },
        modal: { control: 'boolean' }
    },
    args: {
        header: 'Drawer',
        position: 'left',
        modal: true
    }
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => ({
        components: { Drawer, Button },
        setup() {
            const visible = ref(false);
            return { args, visible };
        },
        template: `
      <Button label="Відкрити" @click="visible = true" />
      <Drawer v-model:visible="visible" v-bind="args">
        <p>Контент панелі</p>
      </Drawer>
    `
    })
};

export const Left: Story = {
    render: () => ({
        components: { Drawer, Button },
        data: () => ({ visible: false }),
        template: `
      <div>
        <Button label="Ліва панель" @click="visible = true" />
        <Drawer v-model:visible="visible" header="Ліва панель">
          <p>Вміст бічної панелі</p>
        </Drawer>
      </div>
    `
    })
};

export const Right: Story = {
    render: () => ({
        components: { Drawer, Button },
        data: () => ({ visible: false }),
        template: `
      <div>
        <Button label="Права панель" @click="visible = true" />
        <Drawer v-model:visible="visible" header="Права панель" position="right">
          <p>Вміст бічної панелі</p>
        </Drawer>
      </div>
    `
    })
};

export const Top: Story = {
    render: () => ({
        components: { Drawer, Button },
        data: () => ({ visible: false }),
        template: `
      <div>
        <Button label="Верхня панель" @click="visible = true" />
        <Drawer v-model:visible="visible" header="Верхня панель" position="top">
          <p>Вміст панелі</p>
        </Drawer>
      </div>
    `
    })
};

export const Bottom: Story = {
    render: () => ({
        components: { Drawer, Button },
        data: () => ({ visible: false }),
        template: `
      <div>
        <Button label="Нижня панель" @click="visible = true" />
        <Drawer v-model:visible="visible" header="Нижня панель" position="bottom">
          <p>Вміст панелі</p>
        </Drawer>
      </div>
    `
    })
};
