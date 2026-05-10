import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Icon } from '@iconify/vue';
import Message from 'primevue/message';

const meta = {
    title: 'PrimeVue/Messages/Message',
    component: Message,
    tags: ['autodocs']
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        severity: 'info',
        text: 'Повідомлення',
        closable: false
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
        closable: { control: 'boolean' },
        text: { control: 'text' }
    },
    render: (args) => ({
        components: { Message },
        setup() {
            return { args };
        },
        template:
            '<Message :severity="args.severity" :closable="args.closable">{{ args.text }}</Message>'
    })
};

export const Severities: Story = {
    render: () => ({
        components: { Message },
        template: `
      <div class="flex flex-col gap-2">
        <Message severity="success">Успішно збережено</Message>
        <Message severity="info">Інформаційне повідомлення</Message>
        <Message severity="warn">Увага! Перевірте дані</Message>
        <Message severity="error">Помилка при збереженні</Message>
        <Message severity="secondary">Вторинне повідомлення</Message>
        <Message severity="contrast">Контрастне повідомлення</Message>
      </div>
    `
    })
};

export const Closable: Story = {
    render: () => ({
        components: { Message },
        template: `
      <div class="flex flex-col gap-2">
        <Message severity="success" :closable="true">Можна закрити</Message>
        <Message severity="info" :closable="true">Можна закрити</Message>
      </div>
    `
    })
};

export const WithIcon: Story = {
    render: () => ({
        components: { Message, Icon },
        template: `
      <div class="flex flex-col gap-2">
        <Message severity="info"><template #icon><Icon icon="tabler:send" /></template>Повідомлення з іконкою</Message>
        <Message severity="warn"><template #icon><Icon icon="tabler:alert-triangle" /></template>Увага!</Message>
      </div>
    `
    })
};
