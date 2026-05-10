import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Timeline from 'primevue/timeline';

const meta = {
    title: 'PrimeVue/Data/Timeline',
    component: Timeline,
    tags: ['autodocs'],
    argTypes: {
        layout: {
            control: 'select',
            options: ['vertical', 'horizontal']
        },
        align: {
            control: 'select',
            options: ['left', 'right', 'alternate', 'top', 'bottom']
        }
    },
    args: {
        layout: 'vertical',
        align: 'left'
    }
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const events = [
    {
        status: 'Замовлено',
        date: '01/01/2024',
        color: '#9C27B0'
    },
    {
        status: 'Обробляється',
        date: '02/01/2024',
        color: '#673AB7'
    },
    {
        status: 'Відправлено',
        date: '03/01/2024',
        color: '#FF9800'
    },
    {
        status: 'Доставлено',
        date: '04/01/2024',
        color: '#4CAF50'
    }
];

export const Playground: Story = {
    render: (args) => ({
        components: { Timeline },
        setup() {
            return { args, events };
        },
        template: `
      <Timeline :value="events" v-bind="args">
        <template #content="slotProps">
          <div>{{ slotProps.item.status }}</div>
          <small class="text-surface-500">{{ slotProps.item.date }}</small>
        </template>
      </Timeline>
    `
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Timeline },
        data: () => ({ events }),
        template: `
      <Timeline :value="events">
        <template #content="slotProps">
          <div>{{ slotProps.item.status }}</div>
          <small class="text-surface-500">{{ slotProps.item.date }}</small>
        </template>
      </Timeline>
    `
    })
};

export const WithOpposite: Story = {
    render: () => ({
        components: { Timeline },
        data: () => ({ events }),
        template: `
      <Timeline :value="events">
        <template #opposite="slotProps">
          <small class="text-surface-500">{{ slotProps.item.date }}</small>
        </template>
        <template #content="slotProps">
          {{ slotProps.item.status }}
        </template>
      </Timeline>
    `
    })
};

export const Horizontal: Story = {
    render: () => ({
        components: { Timeline },
        data: () => ({ events }),
        template: `
      <Timeline :value="events" layout="horizontal" align="top">
        <template #content="slotProps">
          {{ slotProps.item.status }}
        </template>
        <template #opposite="slotProps">
          <small class="text-surface-500">{{ slotProps.item.date }}</small>
        </template>
      </Timeline>
    `
    })
};
