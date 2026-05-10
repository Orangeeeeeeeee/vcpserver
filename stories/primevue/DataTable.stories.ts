import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const meta = {
    title: 'PrimeVue/Data/DataTable',
    component: DataTable,
    tags: ['autodocs'],
    argTypes: {
        stripedRows: { control: 'boolean' },
        showGridlines: { control: 'boolean' },
        size: {
            control: 'select',
            options: ['small', undefined, 'large']
        },
        paginator: { control: 'boolean' },
        rows: { control: 'number' }
    },
    args: {
        stripedRows: false,
        showGridlines: false,
        size: undefined,
        paginator: false,
        rows: 10
    }
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const products = [
    {
        id: 1,
        name: 'Ноутбук',
        category: 'Електроніка',
        price: 25000,
        status: 'В наявності'
    },
    {
        id: 2,
        name: 'Телефон',
        category: 'Електроніка',
        price: 15000,
        status: 'В наявності'
    },
    {
        id: 3,
        name: 'Планшет',
        category: 'Електроніка',
        price: 12000,
        status: 'Немає'
    },
    {
        id: 4,
        name: 'Навушники',
        category: 'Аксесуари',
        price: 3000,
        status: 'В наявності'
    },
    {
        id: 5,
        name: 'Клавіатура',
        category: 'Аксесуари',
        price: 2500,
        status: 'Мало'
    },
    {
        id: 6,
        name: 'Монітор',
        category: 'Електроніка',
        price: 18000,
        status: 'В наявності'
    },
    {
        id: 7,
        name: 'Мишка',
        category: 'Аксесуари',
        price: 1200,
        status: 'В наявності'
    },
    {
        id: 8,
        name: 'Веб-камера',
        category: 'Аксесуари',
        price: 4500,
        status: 'Немає'
    }
];

export const Playground: Story = {
    render: (args) => ({
        components: { DataTable, Column },
        setup() {
            return { args, products };
        },
        template: `
      <DataTable :value="products" v-bind="args">
        <Column field="name" header="Назва" />
        <Column field="category" header="Категорія" />
        <Column field="price" header="Ціна" />
        <Column field="status" header="Статус" />
      </DataTable>
    `
    })
};

export const Basic: Story = {
    render: () => ({
        components: { DataTable, Column },
        data: () => ({ products }),
        template: `
      <DataTable :value="products">
        <Column field="name" header="Назва" />
        <Column field="category" header="Категорія" />
        <Column field="price" header="Ціна" />
        <Column field="status" header="Статус" />
      </DataTable>
    `
    })
};

export const Striped: Story = {
    render: () => ({
        components: { DataTable, Column },
        data: () => ({ products }),
        template: `
      <DataTable :value="products" stripedRows>
        <Column field="name" header="Назва" />
        <Column field="category" header="Категорія" />
        <Column field="price" header="Ціна" />
        <Column field="status" header="Статус" />
      </DataTable>
    `
    })
};

export const Gridlines: Story = {
    render: () => ({
        components: { DataTable, Column },
        data: () => ({ products }),
        template: `
      <DataTable :value="products" showGridlines>
        <Column field="name" header="Назва" />
        <Column field="category" header="Категорія" />
        <Column field="price" header="Ціна" />
        <Column field="status" header="Статус" />
      </DataTable>
    `
    })
};

export const Sortable: Story = {
    render: () => ({
        components: { DataTable, Column },
        data: () => ({ products }),
        template: `
      <DataTable :value="products">
        <Column field="name" header="Назва" sortable />
        <Column field="category" header="Категорія" sortable />
        <Column field="price" header="Ціна" sortable />
        <Column field="status" header="Статус" sortable />
      </DataTable>
    `
    })
};

export const WithPaginator: Story = {
    render: () => ({
        components: { DataTable, Column },
        data: () => ({ products }),
        template: `
      <DataTable :value="products" paginator :rows="5" :rowsPerPageOptions="[5, 10]">
        <Column field="name" header="Назва" />
        <Column field="category" header="Категорія" />
        <Column field="price" header="Ціна" />
        <Column field="status" header="Статус" />
      </DataTable>
    `
    })
};

export const Sizes: Story = {
    render: () => ({
        components: { DataTable, Column },
        data: () => ({ products: products.slice(0, 3) }),
        template: `
      <div class="flex flex-col gap-6">
        <div>
          <h3 class="mb-2 font-semibold">Small</h3>
          <DataTable :value="products" size="small">
            <Column field="name" header="Назва" />
            <Column field="price" header="Ціна" />
          </DataTable>
        </div>
        <div>
          <h3 class="mb-2 font-semibold">Normal</h3>
          <DataTable :value="products">
            <Column field="name" header="Назва" />
            <Column field="price" header="Ціна" />
          </DataTable>
        </div>
        <div>
          <h3 class="mb-2 font-semibold">Large</h3>
          <DataTable :value="products" size="large">
            <Column field="name" header="Назва" />
            <Column field="price" header="Ціна" />
          </DataTable>
        </div>
      </div>
    `
    })
};
