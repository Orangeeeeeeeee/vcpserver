import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Typography from './Typography.vue';

const meta: Meta<typeof Typography> = {
    title: 'UI/Typography',
    component: Typography,
    argTypes: {
        variant: {
            control: 'select',
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        }
    }
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const AllVariants: Story = {
    render: () => ({
        components: { Typography },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <Typography variant="h1">H1 · 40/Auto</Typography>
                <Typography variant="h2">H2 · 32/Auto</Typography>
                <Typography variant="h3">H3 · 24/Auto</Typography>
                <Typography variant="h4">H4 · 20/Auto</Typography>
                <Typography variant="h5">H5 · 18/Auto</Typography>
                <Typography variant="h6">H6 · 16/Auto</Typography>
            </div>
        `
    })
};

export const H1: Story = {
    args: { variant: 'h1' },
    render: (args) => ({
        components: { Typography },
        setup: () => ({ args }),
        template: '<Typography v-bind="args">Авторизація</Typography>'
    })
};

export const H2: Story = {
    args: { variant: 'h2' },
    render: (args) => ({
        components: { Typography },
        setup: () => ({ args }),
        template: '<Typography v-bind="args">Заголовок H2</Typography>'
    })
};

export const H3: Story = {
    args: { variant: 'h3' },
    render: (args) => ({
        components: { Typography },
        setup: () => ({ args }),
        template: '<Typography v-bind="args">Заголовок H3</Typography>'
    })
};
