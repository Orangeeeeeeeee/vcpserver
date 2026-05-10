import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Tree from 'primevue/tree';

const meta = {
    title: 'PrimeVue/Data/Tree',
    component: Tree,
    tags: ['autodocs'],
    argTypes: {
        selectionMode: {
            control: 'select',
            options: [undefined, 'single', 'multiple', 'checkbox']
        },
        filter: { control: 'boolean' },
        filterPlaceholder: { control: 'text' }
    },
    args: {
        selectionMode: undefined,
        filter: false,
        filterPlaceholder: 'Пошук'
    }
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

const nodes = [
    {
        key: '0',
        label: 'Документи',
        children: [
            {
                key: '0-0',
                label: 'Звіти',
                children: [
                    { key: '0-0-0', label: 'Звіт Q1.pdf' },
                    { key: '0-0-1', label: 'Звіт Q2.pdf' }
                ]
            },
            {
                key: '0-1',
                label: 'Контракти',
                children: [
                    {
                        key: '0-1-0',
                        label: 'Контракт A.docx'
                    }
                ]
            }
        ]
    },
    {
        key: '1',
        label: 'Зображення',
        children: [
            { key: '1-0', label: 'logo.png' },
            { key: '1-1', label: 'banner.jpg' }
        ]
    }
];

export const Playground: Story = {
    render: (args) => ({
        components: { Tree },
        setup() {
            const selectedKeys = ref({});
            return { args, nodes, selectedKeys };
        },
        template: '<Tree :value="nodes" v-model:selectionKeys="selectedKeys" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Tree },
        data: () => ({ nodes }),
        template: '<Tree :value="nodes" />'
    })
};

export const WithCheckbox: Story = {
    render: () => ({
        components: { Tree },
        data: () => ({ nodes, selectedKeys: {} }),
        template:
            '<Tree :value="nodes" v-model:selectionKeys="selectedKeys" selectionMode="checkbox" />'
    })
};

export const WithFilter: Story = {
    render: () => ({
        components: { Tree },
        data: () => ({ nodes, filterValue: '' }),
        template:
            '<Tree :value="nodes" filter filterMode="lenient" filterPlaceholder="Пошук" />'
    })
};
