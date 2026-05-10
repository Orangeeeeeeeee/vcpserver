import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InlineMessage from 'primevue/inlinemessage';

const meta = {
    title: 'PrimeVue/Messages/InlineMessage',
    component: InlineMessage,
    tags: ['autodocs']
} satisfies Meta<typeof InlineMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        severity: 'info',
        text: 'Повідомлення'
    },
    argTypes: {
        severity: {
            control: 'select',
            options: [
                'info',
                'success',
                'warn',
                'error',
                'secondary',
                'contrast'
            ]
        },
        text: { control: 'text' }
    },
    render: (args) => ({
        components: { InlineMessage },
        setup() {
            return { args };
        },
        template:
            '<InlineMessage :severity="args.severity">{{ args.text }}</InlineMessage>'
    })
};

export const Severities: Story = {
    render: () => ({
        components: { InlineMessage },
        template: `
      <div class="flex flex-col gap-2">
        <InlineMessage severity="success">Успіх</InlineMessage>
        <InlineMessage severity="info">Інформація</InlineMessage>
        <InlineMessage severity="warn">Увага</InlineMessage>
        <InlineMessage severity="error">Помилка</InlineMessage>
        <InlineMessage severity="secondary">Вторинне</InlineMessage>
        <InlineMessage severity="contrast">Контраст</InlineMessage>
      </div>
    `
    })
};
