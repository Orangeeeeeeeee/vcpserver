import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Icon } from '@iconify/vue';
import Tag from 'primevue/tag';

const meta = {
    title: 'PrimeVue/Misc/Tag',
    component: Tag,
    tags: ['autodocs']
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        value: 'Tag',
        severity: 'primary',
        rounded: false,
        icon: ''
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
                'contrast'
            ]
        },
        rounded: { control: 'boolean' },
        icon: { control: 'text' },
        value: { control: 'text' }
    },
    render: (args) => ({
        components: { Tag },
        setup() {
            return { args };
        },
        template: '<Tag v-bind="args" />'
    })
};

export const Severities: Story = {
    render: () => ({
        components: { Tag },
        template: `
      <div class="flex flex-wrap gap-2">
        <Tag value="Primary" />
        <Tag value="Success" severity="success" />
        <Tag value="Info" severity="info" />
        <Tag value="Warn" severity="warn" />
        <Tag value="Danger" severity="danger" />
        <Tag value="Secondary" severity="secondary" />
        <Tag value="Contrast" severity="contrast" />
      </div>
    `
    })
};

export const Rounded: Story = {
    render: () => ({
        components: { Tag },
        template: `
      <div class="flex flex-wrap gap-2">
        <Tag value="Primary" rounded />
        <Tag value="Success" severity="success" rounded />
        <Tag value="Info" severity="info" rounded />
        <Tag value="Warn" severity="warn" rounded />
        <Tag value="Danger" severity="danger" rounded />
      </div>
    `
    })
};

export const WithIcon: Story = {
    render: () => ({
        components: { Tag, Icon },
        template: `
      <div class="flex flex-wrap gap-2">
        <Tag value="Новий"><template #icon><Icon icon="tabler:plus" /></template></Tag>
        <Tag value="Активний" severity="success"><template #icon><Icon icon="tabler:check" /></template></Tag>
        <Tag value="В очікуванні" severity="warn"><template #icon><Icon icon="tabler:clock" /></template></Tag>
        <Tag value="Помилка" severity="danger"><template #icon><Icon icon="tabler:x" /></template></Tag>
      </div>
    `
    })
};
