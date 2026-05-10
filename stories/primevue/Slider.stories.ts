import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Slider from 'primevue/slider';

const meta = {
    title: 'PrimeVue/Form/Slider',
    component: Slider,
    tags: ['autodocs']
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
        orientation: 'horizontal'
    },
    argTypes: {
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        disabled: { control: 'boolean' },
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical']
        }
    },
    render: (args) => ({
        components: { Slider },
        setup() {
            const value = ref(50);
            return { args, value };
        },
        template: '<Slider v-model="value" v-bind="args" class="w-56" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Slider },
        data: () => ({ value: 50 }),
        template: '<Slider v-model="value" class="w-56" />'
    })
};

export const Range: Story = {
    render: () => ({
        components: { Slider },
        data: () => ({ value: [20, 80] }),
        template: '<Slider v-model="value" range class="w-56" />'
    })
};

export const Step: Story = {
    render: () => ({
        components: { Slider },
        data: () => ({ value: 40 }),
        template: '<Slider v-model="value" :step="20" class="w-56" />'
    })
};

export const Vertical: Story = {
    render: () => ({
        components: { Slider },
        data: () => ({ value: 50 }),
        template:
            '<Slider v-model="value" orientation="vertical" class="h-56" />'
    })
};
