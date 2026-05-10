import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, useTemplateRef } from 'vue';
import { Icon } from '@iconify/vue';
import Popover from 'primevue/popover';
import Button from 'primevue/button';

const meta = {
    title: 'PrimeVue/Overlay/Popover',
    component: Popover,
    tags: ['autodocs'],
    argTypes: {
        content: { control: 'text' },
        buttonLabel: { control: 'text' }
    },
    args: {
        content: 'Вміст popover',
        buttonLabel: 'Показати'
    }
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) =>
        defineComponent({
            components: { Popover, Button },
            setup() {
                const op = useTemplateRef<InstanceType<typeof Popover>>('op');
                return {
                    args,
                    toggle: (event: Event) => op.value?.toggle(event)
                };
            },
            template: `
      <div>
        <Button :label="args.buttonLabel" @click="toggle" />
        <Popover ref="op">
          <p>{{ args.content }}</p>
        </Popover>
      </div>
    `
        })
};

export const Basic: Story = {
    render: () =>
        defineComponent({
            components: { Popover, Button },
            setup() {
                const op = useTemplateRef<InstanceType<typeof Popover>>('op');
                return {
                    toggle: (event: Event) => op.value?.toggle(event)
                };
            },
            template: `
      <div>
        <Button label="Показати" @click="toggle" />
        <Popover ref="op">
          <p>Вміст popover</p>
        </Popover>
      </div>
    `
        })
};

export const WithContent: Story = {
    render: () =>
        defineComponent({
            components: { Popover, Button, Icon },
            setup() {
                const op = useTemplateRef<InstanceType<typeof Popover>>('op');
                return {
                    toggle: (event: Event) => op.value?.toggle(event)
                };
            },
            template: `
      <div>
        <Button severity="secondary" rounded text @click="toggle"><template #icon><Icon icon="tabler:info-circle" /></template></Button>
        <Popover ref="op">
          <div class="flex flex-col gap-2 w-64">
            <h4 class="font-semibold m-0">Інформація</h4>
            <p class="text-sm text-surface-500 m-0">Це додаткова інформація у вигляді popover.</p>
          </div>
        </Popover>
      </div>
    `
        })
};
