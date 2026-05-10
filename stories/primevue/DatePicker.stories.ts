import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import DatePicker from 'primevue/datepicker';

const meta = {
    title: 'PrimeVue/Form/DatePicker',
    component: DatePicker,
    tags: ['autodocs']
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        placeholder: 'Оберіть дату',
        disabled: false,
        invalid: false,
        showIcon: false,
        showTime: false,
        selectionMode: 'single'
    },
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        showIcon: { control: 'boolean' },
        showTime: { control: 'boolean' },
        selectionMode: {
            control: 'select',
            options: ['single', 'multiple', 'range']
        }
    },
    render: (args) => ({
        components: { DatePicker },
        setup() {
            const value = ref(null);
            return { args, value };
        },
        template: '<DatePicker v-model="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template: '<DatePicker v-model="date" placeholder="Оберіть дату" />'
    })
};

export const WithTime: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template:
            '<DatePicker v-model="date" showTime hourFormat="24" placeholder="Дата і час" />'
    })
};

export const Range: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ dates: null }),
        template:
            '<DatePicker v-model="dates" selectionMode="range" placeholder="Діапазон дат" />'
    })
};

export const Inline: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template: '<DatePicker v-model="date" inline />'
    })
};

export const MonthPicker: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template:
            '<DatePicker v-model="date" view="month" dateFormat="mm/yy" placeholder="Оберіть місяць" />'
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template:
            '<DatePicker v-model="date" disabled placeholder="Disabled" />'
    })
};
