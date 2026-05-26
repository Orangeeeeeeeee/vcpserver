import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import ToggleButton from 'primevue/togglebutton';

const meta = {
    title: 'PrimeVue/Form/ToggleButton',
    component: ToggleButton,
    tags: ['autodocs']
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        onLabel: 'Увімкнено',
        offLabel: 'Вимкнено',
        disabled: false,
        invalid: false,
        size: undefined
    },
    argTypes: {
        onLabel: { control: 'text' },
        offLabel: { control: 'text' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        size: {
            control: 'select',
            options: [undefined, 'small', 'large']
        }
    },
    render: (args) => ({
        components: { ToggleButton },
        setup() {
            const value = ref(false);
            return { args, value };
        },
        template: '<ToggleButton v-model="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { ToggleButton },
        data: () => ({ value: false }),
        template: '<ToggleButton v-model="value" onLabel="Так" offLabel="Ні" />'
    })
};

export const Sizes: Story = {
    render: () => ({
        components: { ToggleButton },
        data: () => ({ v1: false, v2: true, v3: false }),
        template: `
      <div class="flex flex-col gap-3 items-start">
        <ToggleButton v-model="v1" onLabel="Small" offLabel="Small" size="small" />
        <ToggleButton v-model="v2" onLabel="Normal" offLabel="Normal" />
        <ToggleButton v-model="v3" onLabel="Large" offLabel="Large" size="large" />
      </div>
    `
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { ToggleButton },
        data: () => ({ v1: false, v2: true }),
        template: `
      <div class="flex flex-col gap-3 items-start">
        <ToggleButton v-model="v1" onLabel="Вимкнено" offLabel="Вимкнено" disabled />
        <ToggleButton v-model="v2" onLabel="Увімкнено" offLabel="Увімкнено" disabled />
      </div>
    `
    })
};

export const Invalid: Story = {
    render: () => ({
        components: { ToggleButton },
        data: () => ({ value: false }),
        template:
            '<ToggleButton v-model="value" onLabel="Так" offLabel="Ні" invalid />'
    })
};
