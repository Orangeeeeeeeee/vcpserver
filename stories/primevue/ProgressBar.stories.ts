import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';

const meta = {
    title: 'PrimeVue/Misc/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs']
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: 50,
        mode: 'determinate',
        showValue: true
    },
    argTypes: {
        mode: {
            control: 'select',
            options: ['determinate', 'indeterminate']
        },
        value: { control: 'number' },
        showValue: { control: 'boolean' }
    },
    render: (args) => ({
        components: { ProgressBar },
        setup() {
            return { args };
        },
        template: '<ProgressBar v-bind="args" />'
    })
};

export const Determinate: Story = {
    render: () => ({
        components: { ProgressBar },
        template: `
      <div class="flex flex-col gap-4">
        <ProgressBar :value="25" />
        <ProgressBar :value="50" />
        <ProgressBar :value="75" />
        <ProgressBar :value="100" />
      </div>
    `
    })
};

export const Indeterminate: Story = {
    render: () => ({
        components: { ProgressBar },
        template: '<ProgressBar mode="indeterminate" style="height: 6px" />'
    })
};

export const Spinner: Story = {
    render: () => ({
        components: { ProgressSpinner },
        template: `
      <div class="flex flex-wrap gap-4">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>
    `
    })
};
