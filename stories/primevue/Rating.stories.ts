import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Rating from 'primevue/rating';

const meta = {
    title: 'PrimeVue/Form/Rating',
    component: Rating,
    tags: ['autodocs']
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        stars: 5,
        disabled: false,
        readonly: false,
        cancel: true
    },
    argTypes: {
        stars: { control: 'number' },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
        cancel: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Rating },
        setup() { const value = ref(3); return { args, value }; },
        template: '<Rating v-model="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Rating },
        data: () => ({ value: 3 }),
        template: '<Rating v-model="value" />'
    })
};

export const WithoutCancel: Story = {
    render: () => ({
        components: { Rating },
        data: () => ({ value: 3 }),
        template: '<Rating v-model="value" :cancel="false" />'
    })
};

export const ReadOnly: Story = {
    render: () => ({
        components: { Rating },
        data: () => ({ value: 4 }),
        template: '<Rating v-model="value" readonly />'
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { Rating },
        data: () => ({ value: 2 }),
        template: '<Rating v-model="value" disabled />'
    })
};

export const CustomStars: Story = {
    render: () => ({
        components: { Rating },
        data: () => ({ value: 7 }),
        template: '<Rating v-model="value" :stars="10" />'
    })
};
