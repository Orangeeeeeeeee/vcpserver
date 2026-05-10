import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Select from 'primevue/select';

const meta = {
    title: 'PrimeVue/Form/Select',
    component: Select,
    tags: ['autodocs']
} satisfies Meta<typeof Select>;

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
        showClear: false,
        filter: false
    },
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        showClear: { control: 'boolean' },
        filter: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Select },
        setup() {
            const value = ref(null);
            return { args, value, cities };
        },
        template:
            '<Select v-model="value" :options="cities" optionLabel="name" v-bind="args" class="w-full md:w-56" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Select },
        data: () => ({ selected: null, cities }),
        template:
            '<Select v-model="selected" :options="cities" optionLabel="name" placeholder="Оберіть місто" class="w-full md:w-56" />'
    })
};

export const WithFilter: Story = {
    render: () => ({
        components: { Select },
        data: () => ({ selected: null, cities }),
        template:
            '<Select v-model="selected" :options="cities" optionLabel="name" filter placeholder="Пошук міста" class="w-full md:w-56" />'
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { Select },
        data: () => ({ selected: null, cities }),
        template:
            '<Select v-model="selected" :options="cities" optionLabel="name" disabled placeholder="Disabled" class="w-full md:w-56" />'
    })
};

export const Invalid: Story = {
    render: () => ({
        components: { Select },
        data: () => ({ selected: null, cities }),
        template:
            '<Select v-model="selected" :options="cities" optionLabel="name" invalid placeholder="Invalid" class="w-full md:w-56" />'
    })
};

export const Grouped: Story = {
    render: () => ({
        components: { Select },
        data: () => ({
            selected: null,
            groupedCities: [
                {
                    label: 'Україна',
                    items: [
                        { name: 'Київ', code: 'KY' },
                        { name: 'Львів', code: 'LV' }
                    ]
                },
                {
                    label: 'Польща',
                    items: [
                        { name: 'Варшава', code: 'WA' },
                        { name: 'Краків', code: 'KR' }
                    ]
                }
            ]
        }),
        template:
            '<Select v-model="selected" :options="groupedCities" optionLabel="name" optionGroupLabel="label" optionGroupChildren="items" placeholder="Оберіть місто" class="w-full md:w-56" />'
    })
};
