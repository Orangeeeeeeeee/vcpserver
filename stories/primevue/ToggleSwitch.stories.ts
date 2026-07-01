import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ToggleSwitch from 'primevue/toggleswitch';

const meta = {
    title: 'PrimeVue/Form/ToggleSwitch',
    component: ToggleSwitch,
    tags: ['autodocs']
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        disabled: false,
        invalid: false
    },
    argTypes: {
        size: { control: 'select', options: [undefined, 'small', 'large'] },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' }
    },
    render: (args) => ({
        components: { ToggleSwitch },
        setup() {
            const value = ref(false);
            return { args, value };
        },
        template: '<ToggleSwitch v-model="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { ToggleSwitch },
        data: () => ({ checked: false }),
        template: '<ToggleSwitch v-model="checked" />'
    })
};

export const Sizes: Story = {
    render: () => ({
        components: { ToggleSwitch },
        data: () => ({ small: true, normal: true, large: true }),
        template: `
      <div class="flex items-center gap-4">
        <ToggleSwitch v-model="small" size="small" />
        <ToggleSwitch v-model="normal" />
        <ToggleSwitch v-model="large" size="large" />
      </div>
    `
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { ToggleSwitch },
        data: () => ({ v1: true, v2: false }),
        template: `
      <div class="flex gap-4">
        <ToggleSwitch v-model="v1" disabled />
        <ToggleSwitch v-model="v2" disabled />
      </div>
    `
    })
};

export const Invalid: Story = {
    render: () => ({
        components: { ToggleSwitch },
        data: () => ({ checked: false }),
        template: '<ToggleSwitch v-model="checked" invalid />'
    })
};
