import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Icon } from '@iconify/vue';
import Chip from 'primevue/chip';

const meta = {
    title: 'PrimeVue/Misc/Chip',
    component: Chip,
    tags: ['autodocs']
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        label: 'Logistic UA',
        removable: false
    },
    argTypes: {
        label: { control: 'text' },
        removable: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Chip },
        setup() {
            return { args };
        },
        template: '<Chip v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Chip },
        template: `
      <div class="flex flex-wrap gap-2">
        <Chip label="Logistic UA" />
        <Chip label="Transport KZ" />
        <Chip label="Carrier PL" />
      </div>
    `
    })
};

export const WithIcon: Story = {
    render: () => ({
        components: { Chip, Icon },
        template: `
      <div class="flex flex-wrap gap-2">
        <Chip label="Користувач"><template #icon><Icon icon="tabler:user" /></template></Chip>
        <Chip label="Компанія"><template #icon><Icon icon="tabler:building" /></template></Chip>
        <Chip label="Локація"><template #icon><Icon icon="tabler:map-pin" /></template></Chip>
      </div>
    `
    })
};

export const WithImage: Story = {
    render: () => ({
        components: { Chip },
        template: `
      <div class="flex flex-wrap gap-2">
        <Chip
          label="Amy Elsner"
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        />
        <Chip
          label="Asiya Javayant"
          image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png"
        />
      </div>
    `
    })
};

export const Removable: Story = {
    render: () => ({
        components: { Chip, Icon },
        template: `
      <div class="flex flex-wrap gap-2">
        <Chip label="Logistic UA" removable />
        <Chip label="Transport KZ" removable>
          <template #removeicon="{ removeCallback }">
            <Icon icon="tabler:x" class="cursor-pointer" @click="removeCallback" />
          </template>
        </Chip>
      </div>
    `
    })
};
