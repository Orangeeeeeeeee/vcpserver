import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Textarea from 'primevue/textarea';

const meta = {
    title: 'PrimeVue/Form/Textarea',
    component: Textarea,
    tags: ['autodocs']
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        placeholder: 'Введіть текст',
        rows: 5,
        cols: 30,
        disabled: false,
        invalid: false,
        autoResize: false
    },
    argTypes: {
        placeholder: { control: 'text' },
        rows: { control: 'number' },
        cols: { control: 'number' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        autoResize: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Textarea },
        setup() {
            const value = ref('');
            return { args, value };
        },
        template: '<Textarea v-model="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Textarea },
        data: () => ({ value: '' }),
        template:
            '<Textarea v-model="value" rows="5" cols="30" placeholder="Введіть текст" />'
    })
};

export const AutoResize: Story = {
    render: () => ({
        components: { Textarea },
        data: () => ({ value: '' }),
        template:
            '<Textarea v-model="value" autoResize rows="3" cols="30" placeholder="Auto resize" />'
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { Textarea },
        data: () => ({ value: 'Disabled text' }),
        template: '<Textarea v-model="value" disabled rows="3" cols="30" />'
    })
};

export const Invalid: Story = {
    render: () => ({
        components: { Textarea },
        data: () => ({ value: '' }),
        template:
            '<Textarea v-model="value" invalid rows="3" cols="30" placeholder="Invalid" />'
    })
};
