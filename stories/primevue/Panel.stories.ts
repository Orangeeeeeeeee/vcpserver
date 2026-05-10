import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Panel from 'primevue/panel';

const meta = {
    title: 'PrimeVue/Panel/Panel',
    component: Panel,
    tags: ['autodocs']
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        header: 'Заголовок',
        toggleable: false,
        collapsed: false
    },
    argTypes: {
        header: { control: 'text' },
        toggleable: { control: 'boolean' },
        collapsed: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Panel },
        setup() {
            return { args };
        },
        template:
            '<Panel v-bind="args">Вміст панелі з описом та інформацією.</Panel>'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Panel },
        template: `
      <Panel header="Заголовок">
        <p>Вміст панелі з описом та інформацією.</p>
      </Panel>
    `
    })
};

export const Toggleable: Story = {
    render: () => ({
        components: { Panel },
        template: `
      <Panel header="Toggleable панель" toggleable>
        <p>Цю панель можна згорнути та розгорнути.</p>
      </Panel>
    `
    })
};
