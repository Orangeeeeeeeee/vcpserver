import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import SelectButton from 'primevue/selectbutton';

const meta = {
    title: 'PrimeVue/Form/SelectButton',
    component: SelectButton,
    tags: ['autodocs']
} satisfies Meta<typeof SelectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const themeOptions = [
    { label: 'Світла', value: 'light' },
    { label: 'Темна', value: 'dark' }
];

const unitsOptions = [
    { label: 'Метрична (SI)', value: 'metric' },
    { label: 'Імперська (UK)', value: 'uk' },
    { label: 'Імперська (US)', value: 'us' }
];

export const Playground: Story = {
    args: {
        multiple: false,
        allowEmpty: true,
        disabled: false,
        invalid: false,
        size: undefined
    },
    argTypes: {
        multiple: { control: 'boolean' },
        allowEmpty: { control: 'boolean' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        size: {
            control: 'select',
            options: [undefined, 'small', 'large']
        }
    },
    render: (args) => ({
        components: { SelectButton },
        setup() {
            const value = ref(args.multiple ? [] : null);
            return { args, value, options: unitsOptions };
        },
        template:
            '<SelectButton v-model="value" :options="options" optionLabel="label" optionValue="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { SelectButton },
        data: () => ({ value: 'light', options: themeOptions }),
        template:
            '<SelectButton v-model="value" :options="options" optionLabel="label" optionValue="value" :allowEmpty="false" />'
    })
};

export const Multiple: Story = {
    render: () => ({
        components: { SelectButton },
        data: () => ({ value: ['metric'], options: unitsOptions }),
        template:
            '<SelectButton v-model="value" :options="options" optionLabel="label" optionValue="value" multiple />'
    })
};

export const Sizes: Story = {
    render: () => ({
        components: { SelectButton },
        data: () => ({
            v1: 'light',
            v2: 'light',
            v3: 'light',
            options: themeOptions
        }),
        template: `
      <div class="flex flex-col gap-4 items-start">
        <SelectButton v-model="v1" :options="options" optionLabel="label" optionValue="value" size="small" :allowEmpty="false" />
        <SelectButton v-model="v2" :options="options" optionLabel="label" optionValue="value" :allowEmpty="false" />
        <SelectButton v-model="v3" :options="options" optionLabel="label" optionValue="value" size="large" :allowEmpty="false" />
      </div>
    `
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { SelectButton },
        data: () => ({ value: 'light', options: themeOptions }),
        template:
            '<SelectButton v-model="value" :options="options" optionLabel="label" optionValue="value" disabled />'
    })
};

export const Invalid: Story = {
    render: () => ({
        components: { SelectButton },
        data: () => ({ value: null, options: themeOptions }),
        template:
            '<SelectButton v-model="value" :options="options" optionLabel="label" optionValue="value" invalid />'
    })
};
