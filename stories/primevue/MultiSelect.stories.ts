import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MultiSelect from 'primevue/multiselect';

const meta = {
    title: 'PrimeVue/Form/MultiSelect',
    component: MultiSelect,
    tags: ['autodocs']
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const cities = [
    { name: 'Київ', code: 'KY' },
    { name: 'Львів', code: 'LV' },
    { name: 'Одеса', code: 'OD' },
    { name: 'Харків', code: 'KH' },
    { name: 'Дніпро', code: 'DN' }
];

export const Playground: Story = {
    args: {
        placeholder: 'Оберіть',
        disabled: false,
        invalid: false,
        filter: false,
        display: 'comma'
    },
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        filter: { control: 'boolean' },
        display: {
            control: 'select',
            options: ['comma', 'chip']
        }
    },
    render: (args) => ({
        components: { MultiSelect },
        setup() {
            const value = ref([]);
            return { args, value, cities };
        },
        template:
            '<MultiSelect v-model="value" :options="cities" optionLabel="name" v-bind="args" class="w-full md:w-80" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { MultiSelect },
        data: () => ({ selected: null, cities }),
        template:
            '<MultiSelect v-model="selected" :options="cities" optionLabel="name" placeholder="Оберіть міста" :maxSelectedLabels="3" class="w-full md:w-80" />'
    })
};

export const WithChips: Story = {
    render: () => ({
        components: { MultiSelect },
        data: () => ({ selected: null, cities }),
        template:
            '<MultiSelect v-model="selected" :options="cities" optionLabel="name" display="chip" placeholder="Оберіть міста" class="w-full md:w-80" />'
    })
};

export const WithFilter: Story = {
    render: () => ({
        components: { MultiSelect },
        data: () => ({ selected: null, cities }),
        template:
            '<MultiSelect v-model="selected" :options="cities" optionLabel="name" filter placeholder="Пошук міста" class="w-full md:w-80" />'
    })
};
