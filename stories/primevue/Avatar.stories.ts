import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Icon as IconifyIcon } from '@iconify/vue';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';

const meta = {
    title: 'PrimeVue/Misc/Avatar',
    component: Avatar,
    tags: ['autodocs']
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        label: 'A',
        size: undefined,
        shape: 'circle',
        image: '',
        icon: ''
    },
    argTypes: {
        label: { control: 'text' },
        size: {
            control: 'select',
            options: [undefined, 'large', 'xlarge']
        },
        shape: {
            control: 'select',
            options: ['circle', 'square']
        },
        image: { control: 'text' },
        icon: { control: 'text' }
    },
    render: (args) => ({
        components: { Avatar },
        setup() {
            return { args };
        },
        template: '<Avatar v-bind="args" />'
    })
};

export const Label: Story = {
    render: () => ({
        components: { Avatar },
        template: `
      <div class="flex flex-wrap gap-2">
        <Avatar label="А" />
        <Avatar label="Б" size="large" />
        <Avatar label="В" size="xlarge" />
      </div>
    `
    })
};

export const Icon: Story = {
    render: () => ({
        components: { Avatar, IconifyIcon },
        template: `
      <div class="flex flex-wrap gap-2">
        <Avatar><template #icon><IconifyIcon icon="tabler:user" /></template></Avatar>
        <Avatar size="large"><template #icon><IconifyIcon icon="tabler:user" /></template></Avatar>
        <Avatar size="xlarge"><template #icon><IconifyIcon icon="tabler:user" /></template></Avatar>
      </div>
    `
    })
};

export const Shapes: Story = {
    render: () => ({
        components: { Avatar, IconifyIcon },
        template: `
      <div class="flex flex-wrap gap-2">
        <Avatar label="А" shape="square" />
        <Avatar label="Б" shape="circle" />
        <Avatar shape="square" size="large"><template #icon><IconifyIcon icon="tabler:user" /></template></Avatar>
        <Avatar shape="circle" size="large"><template #icon><IconifyIcon icon="tabler:user" /></template></Avatar>
      </div>
    `
    })
};

export const Group: Story = {
    render: () => ({
        components: { Avatar, AvatarGroup },
        template: `
      <AvatarGroup>
        <Avatar label="А" shape="circle" />
        <Avatar label="Б" shape="circle" />
        <Avatar label="В" shape="circle" />
        <Avatar label="Г" shape="circle" />
        <Avatar label="+2" shape="circle" />
      </AvatarGroup>
    `
    })
};
