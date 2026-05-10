import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Icon } from '@iconify/vue';
import Badge from 'primevue/badge';
import OverlayBadge from 'primevue/overlaybadge';

const meta = {
    title: 'PrimeVue/Misc/Badge',
    component: Badge,
    tags: ['autodocs']
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: '5',
        severity: 'primary',
        size: undefined
    },
    argTypes: {
        severity: {
            control: 'select',
            options: ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'contrast']
        },
        size: {
            control: 'select',
            options: [undefined, 'large', 'xlarge']
        }
    },
    render: (args) => ({
        components: { Badge },
        setup() {
            return { args };
        },
        template: '<Badge v-bind="args" />'
    })
};

export const Severities: Story = {
    render: () => ({
        components: { Badge },
        template: `
      <div class="flex flex-wrap gap-4">
        <Badge value="2" />
        <Badge value="5" severity="success" />
        <Badge value="3" severity="info" />
        <Badge value="1" severity="warn" />
        <Badge value="8" severity="danger" />
        <Badge value="4" severity="secondary" />
        <Badge value="6" severity="contrast" />
      </div>
    `
    })
};

export const Sizes: Story = {
    render: () => ({
        components: { Badge },
        template: `
      <div class="flex flex-wrap items-center gap-4">
        <Badge value="2" />
        <Badge value="5" size="large" />
        <Badge value="8" size="xlarge" />
      </div>
    `
    })
};

export const Dot: Story = {
    render: () => ({
        components: { Badge },
        template: `
      <div class="flex flex-wrap gap-4">
        <Badge />
        <Badge severity="success" />
        <Badge severity="info" />
        <Badge severity="warn" />
        <Badge severity="danger" />
      </div>
    `
    })
};

export const Overlay: Story = {
    render: () => ({
        components: { OverlayBadge, Icon },
        template: `
      <div class="flex flex-wrap gap-6">
        <OverlayBadge value="3">
          <Icon icon="tabler:bell" class="text-2xl" />
        </OverlayBadge>
        <OverlayBadge value="5" severity="danger">
          <Icon icon="tabler:mail" class="text-2xl" />
        </OverlayBadge>
      </div>
    `
    })
};
