import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Fieldset from 'primevue/fieldset';

const meta = {
    title: 'PrimeVue/Panel/Fieldset',
    component: Fieldset,
    tags: ['autodocs']
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        legend: 'Легенда',
        toggleable: false,
        collapsed: false
    },
    argTypes: {
        legend: { control: 'text' },
        toggleable: { control: 'boolean' },
        collapsed: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Fieldset },
        setup() {
            return { args };
        },
        template: '<Fieldset v-bind="args">Вміст fieldset з контактною інформацією.</Fieldset>'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Fieldset },
        template: `
      <Fieldset legend="Контактна інформація">
        <p>Вміст fieldset з контактною інформацією.</p>
      </Fieldset>
    `
    })
};

export const Toggleable: Story = {
    render: () => ({
        components: { Fieldset },
        template: `
      <Fieldset legend="Додаткові параметри" toggleable>
        <p>Цей fieldset можна згорнути та розгорнути.</p>
      </Fieldset>
    `
    })
};
