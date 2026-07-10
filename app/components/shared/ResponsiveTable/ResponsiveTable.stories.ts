import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Icon } from '@iconify/vue';
import Avatar from 'primevue/avatar';
import ResponsiveTable from './ResponsiveTable.vue';
import type { TableColumn } from './ResponsiveTable.vue';

const meta = {
    title: 'Shared/ResponsiveTable',
    component: ResponsiveTable,
    tags: ['autodocs']
} satisfies Meta<typeof ResponsiveTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const objects = [
    {
        id: 1,
        company: 'Logistics UA',
        imei: '352094083412587',
        port: 5023,
        transport: 'MAN TGX 18.480',
        transportId: 'TRK-112',
        params: 12
    },
    {
        id: 2,
        company: 'CityBus Group',
        imei: '352094083412588',
        port: 5024,
        transport: 'Volvo FH 460',
        transportId: 'TRK-113',
        params: 23
    },
    {
        id: 3,
        company: 'Logistics UA',
        imei: '352094083412589',
        port: 5025,
        transport: 'Scania R 500',
        transportId: 'TRK-114',
        params: 16
    },
    {
        id: 4,
        company: 'Logistics UA',
        imei: '352094083412590',
        port: 5026,
        transport: 'Mercedes Actros',
        transportId: 'TRK-115',
        params: 9
    },
    {
        id: 5,
        company: 'CityBus Group',
        imei: '352094083412591',
        port: 5027,
        transport: 'DAF XF 480',
        transportId: 'TRK-116',
        params: 23
    },
    {
        id: 6,
        company: 'Logistics UA',
        imei: '352094083412592',
        port: 5028,
        transport: 'Iveco Stralis',
        transportId: 'TRK-117',
        params: 12
    },
    {
        id: 7,
        company: 'Logistics UA',
        imei: '352094083412593',
        port: 5029,
        transport: 'MAN TGX 18.480',
        transportId: 'TRK-118',
        params: 12
    },
    {
        id: 8,
        company: 'Logistics UA',
        imei: '352094083412594',
        port: 5030,
        transport: 'MAN TGX 18.480',
        transportId: 'TRK-119',
        params: 12
    },
    {
        id: 9,
        company: 'Logistics UA',
        imei: '352094083412595',
        port: 5031,
        transport: 'MAN TGX 18.480',
        transportId: 'TRK-120',
        params: 12
    }
];

const basicColumns: TableColumn[] = [
    { field: 'company', header: 'Компанія' },
    { field: 'imei', header: 'IMEI' },
    { field: 'port', header: 'Порт' },
    { field: 'transport', header: 'Транспорт' },
    { field: 'params', header: 'К-ть параметрів' }
];

const sortableColumns: TableColumn[] = basicColumns.map((c) => ({
    ...c,
    sortable: true
}));

const fullColumns: TableColumn[] = [
    ...sortableColumns,
    { field: 'actions', header: 'Дії', width: '6rem', align: 'right' }
];

export const Playground: Story = {
    args: {
        paginator: false,
        rows: 10,
        loading: false
    },
    argTypes: {
        paginator: { control: 'boolean' },
        rows: { control: { type: 'number', min: 1, max: 20 } },
        loading: { control: 'boolean' }
    },
    render: (args) => ({
        components: { ResponsiveTable },
        setup() {
            return { args, objects, columns: basicColumns };
        },
        template: `
            <ResponsiveTable
                :value="objects"
                :columns="columns"
                v-bind="args"
                row-key="id"
            />
        `
    })
};

export const Basic: Story = {
    render: () => ({
        components: { ResponsiveTable },
        setup() {
            return { objects, columns: basicColumns };
        },
        template:
            '<ResponsiveTable :value="objects" :columns="columns" row-key="id" />'
    })
};

export const WithPagination: Story = {
    render: () => ({
        components: { ResponsiveTable },
        setup() {
            return { objects, columns: basicColumns };
        },
        template: `
            <ResponsiveTable
                :value="objects"
                :columns="columns"
                paginator
                :rows="3"
                row-key="id"
            />
        `
    })
};

export const WithoutPagination: Story = {
    render: () => ({
        components: { ResponsiveTable },
        setup() {
            return { objects, columns: basicColumns };
        },
        template:
            '<ResponsiveTable :value="objects" :columns="columns" row-key="id" />'
    })
};

export const WithSortableColumns: Story = {
    render: () => ({
        components: { ResponsiveTable },
        setup() {
            return { objects, columns: sortableColumns };
        },
        template:
            '<ResponsiveTable :value="objects" :columns="columns" row-key="id" />'
    })
};

export const WithCustomCells: Story = {
    render: () => ({
        components: { ResponsiveTable, Avatar, Icon },
        setup() {
            return { objects, columns: fullColumns };
        },
        template: `
            <ResponsiveTable :value="objects" :columns="columns" paginator :rows="5" row-key="id">
                <template #cell-company="{ row }">
                    <div class="flex items-center gap-2">
                        <Avatar :label="row.company.slice(0, 2).toUpperCase()" shape="circle" size="small" />
                        <span>{{ row.company }}</span>
                    </div>
                </template>
                <template #cell-transport="{ row }">
                    <div class="flex flex-col">
                        <span class="font-medium">{{ row.transport }}</span>
                        <span class="text-xs text-surface-500">ID: {{ row.transportId }}</span>
                    </div>
                </template>
                <template #cell-actions="{ row }">
                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            class="cursor-pointer text-primary-600 hover:text-primary-800"
                            :title="'Edit ' + row.id"
                            @click="() => alert('Edit ' + row.id)"
                        >
                            <Icon icon="tabler:pencil" width="20" />
                        </button>
                        <button
                            type="button"
                            class="cursor-pointer text-red-600 hover:text-red-800"
                            :title="'Delete ' + row.id"
                            @click="() => alert('Delete ' + row.id)"
                        >
                            <Icon icon="tabler:trash" width="20" />
                        </button>
                    </div>
                </template>
            </ResponsiveTable>
        `
    })
};

export const Empty: Story = {
    render: () => ({
        components: { ResponsiveTable },
        setup() {
            return { columns: basicColumns };
        },
        template: '<ResponsiveTable :value="[]" :columns="columns" />'
    })
};
