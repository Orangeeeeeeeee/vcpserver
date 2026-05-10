import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Paginator from 'primevue/paginator';

const meta = {
    title: 'PrimeVue/Data/Paginator',
    component: Paginator,
    tags: ['autodocs'],
    argTypes: {
        rows: { control: 'number' },
        totalRecords: { control: 'number' },
        rowsPerPageOptions: { control: 'object' }
    },
    args: {
        rows: 10,
        totalRecords: 100,
        rowsPerPageOptions: [10, 20, 50]
    }
} satisfies Meta<typeof Paginator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => ({
        components: { Paginator },
        setup() {
            const first = ref(0);
            return { args, first };
        },
        template:
            '<Paginator v-model:first="first" :rows="args.rows" :totalRecords="args.totalRecords" :rowsPerPageOptions="args.rowsPerPageOptions" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Paginator },
        data: () => ({ first: 0 }),
        template:
            '<Paginator v-model:first="first" :rows="10" :totalRecords="120" />'
    })
};

export const WithRowsPerPage: Story = {
    render: () => ({
        components: { Paginator },
        data: () => ({ first: 0, rows: 10 }),
        template:
            '<Paginator v-model:first="first" v-model:rows="rows" :totalRecords="120" :rowsPerPageOptions="[10, 20, 50]" />'
    })
};
