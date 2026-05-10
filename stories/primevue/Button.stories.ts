import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Icon } from '@iconify/vue';
import Button from 'primevue/button';

const meta = {
    title: 'PrimeVue/Form/Button',
    component: Button,
    tags: ['autodocs']
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        label: 'Button',
        severity: 'primary',
        size: undefined,
        outlined: false,
        text: false,
        raised: false,
        rounded: false,
        disabled: false,
        loading: false
    },
    argTypes: {
        severity: {
            control: 'select',
            options: [
                'primary',
                'secondary',
                'success',
                'info',
                'warn',
                'danger',
                'help',
                'contrast'
            ]
        },
        size: {
            control: 'select',
            options: ['small', undefined, 'large']
        },
        outlined: { control: 'boolean' },
        text: { control: 'boolean' },
        raised: { control: 'boolean' },
        rounded: { control: 'boolean' },
        disabled: { control: 'boolean' },
        loading: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Button },
        setup() {
            return { args };
        },
        template: '<Button v-bind="args" />'
    })
};

export const Severities: Story = {
    render: () => ({
        components: { Button },
        template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" />
        <Button label="Secondary" severity="secondary" />
        <Button label="Success" severity="success" />
        <Button label="Info" severity="info" />
        <Button label="Warn" severity="warn" />
        <Button label="Danger" severity="danger" />
        <Button label="Help" severity="help" />
        <Button label="Contrast" severity="contrast" />
      </div>
    `
    })
};

export const Outlined: Story = {
    render: () => ({
        components: { Button },
        template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" outlined />
        <Button label="Secondary" severity="secondary" outlined />
        <Button label="Success" severity="success" outlined />
        <Button label="Info" severity="info" outlined />
        <Button label="Warn" severity="warn" outlined />
        <Button label="Danger" severity="danger" outlined />
      </div>
    `
    })
};

export const Text: Story = {
    render: () => ({
        components: { Button },
        template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" text />
        <Button label="Secondary" severity="secondary" text />
        <Button label="Success" severity="success" text />
        <Button label="Info" severity="info" text />
        <Button label="Warn" severity="warn" text />
        <Button label="Danger" severity="danger" text />
      </div>
    `
    })
};

export const Raised: Story = {
    render: () => ({
        components: { Button },
        template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" raised />
        <Button label="Secondary" severity="secondary" raised />
        <Button label="Success" severity="success" raised />
        <Button label="Info" severity="info" raised />
        <Button label="Warn" severity="warn" raised />
        <Button label="Danger" severity="danger" raised />
      </div>
    `
    })
};

export const Rounded: Story = {
    render: () => ({
        components: { Button },
        template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" rounded />
        <Button label="Secondary" severity="secondary" rounded />
        <Button label="Success" severity="success" rounded />
      </div>
    `
    })
};

export const Icons: Story = {
    render: () => ({
        components: { Button, Icon },
        template: `
      <div class="flex flex-wrap gap-2">
        <Button><template #icon><Icon icon="tabler:check" /></template></Button>
        <Button label="Submit"><template #icon><Icon icon="tabler:check" /></template></Button>
        <Button label="Submit" iconPos="right"><template #icon><Icon icon="tabler:check" /></template></Button>
        <Button rounded><template #icon><Icon icon="tabler:check" /></template></Button>
        <Button rounded outlined><template #icon><Icon icon="tabler:check" /></template></Button>
        <Button rounded text><template #icon><Icon icon="tabler:check" /></template></Button>
      </div>
    `
    })
};

export const Loading: Story = {
    render: () => ({
        components: { Button, Icon },
        template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Loading" loading />
        <Button label="Loading" loading><template #icon><Icon icon="tabler:check" /></template></Button>
      </div>
    `
    })
};

export const Sizes: Story = {
    render: () => ({
        components: { Button },
        template: `
      <div class="flex flex-wrap items-center gap-2">
        <Button label="Small" size="small" />
        <Button label="Normal" />
        <Button label="Large" size="large" />
      </div>
    `
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { Button },
        template: `
      <div class="flex flex-wrap gap-2">
        <Button label="Primary" disabled />
        <Button label="Secondary" severity="secondary" disabled />
      </div>
    `
    })
};
