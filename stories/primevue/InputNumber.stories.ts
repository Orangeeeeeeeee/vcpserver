import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InputNumber from 'primevue/inputnumber';

const meta = {
    title: 'PrimeVue/Form/InputNumber',
    component: InputNumber,
    tags: ['autodocs']
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        placeholder: 'Число',
        disabled: false,
        invalid: false,
        mode: 'decimal',
        min: undefined,
        max: undefined,
        showButtons: false
    },
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        mode: {
            control: 'select',
            options: ['decimal', 'currency']
        },
        min: { control: 'number' },
        max: { control: 'number' },
        showButtons: { control: 'boolean' }
    },
    render: (args) => ({
        components: { InputNumber },
        setup() {
            const value = ref(null);
            return { args, value };
        },
        template: '<InputNumber v-model="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { InputNumber },
        data: () => ({ value: null }),
        template: '<InputNumber v-model="value" placeholder="Число" />'
    })
};

export const Decimal: Story = {
    render: () => ({
        components: { InputNumber },
        data: () => ({ value: 1234.5 }),
        template:
            '<InputNumber v-model="value" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" />'
    })
};

export const Currency: Story = {
    render: () => ({
        components: { InputNumber },
        data: () => ({ v1: 1500, v2: 2500 }),
        template: `
      <div class="flex flex-col gap-4">
        <InputNumber v-model="v1" mode="currency" currency="UAH" locale="uk-UA" />
        <InputNumber v-model="v2" mode="currency" currency="USD" locale="en-US" />
      </div>
    `
    })
};

export const WithButtons: Story = {
    render: () => ({
        components: { InputNumber },
        data: () => ({ v1: 0, v2: 0 }),
        template: `
      <div class="flex flex-col gap-4">
        <InputNumber v-model="v1" showButtons />
        <InputNumber v-model="v2" showButtons buttonLayout="horizontal" :step="1" />
      </div>
    `
    })
};

export const MinMax: Story = {
    render: () => ({
        components: { InputNumber },
        data: () => ({ value: 20 }),
        template:
            '<InputNumber v-model="value" :min="0" :max="100" showButtons />'
    })
};

export const PrefixSuffix: Story = {
    render: () => ({
        components: { InputNumber },
        data: () => ({ v1: 50, v2: 20 }),
        template: `
      <div class="flex flex-col gap-4">
        <InputNumber v-model="v1" prefix="%" />
        <InputNumber v-model="v2" suffix=" кг" />
      </div>
    `
    })
};
