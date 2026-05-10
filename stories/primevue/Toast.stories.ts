import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent } from 'vue';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const meta = {
    title: 'PrimeVue/Messages/Toast',
    component: Toast,
    tags: ['autodocs'],
    argTypes: {
        severity: {
            control: 'select',
            options: ['success', 'info', 'warn', 'error']
        },
        summary: { control: 'text' },
        detail: { control: 'text' },
        life: { control: 'number' },
        position: {
            control: 'select',
            options: [
                'top-left',
                'top-center',
                'top-right',
                'bottom-left',
                'bottom-center',
                'bottom-right',
                'center'
            ]
        }
    },
    args: {
        severity: 'info',
        summary: 'Повідомлення',
        detail: 'Це тестове повідомлення',
        life: 3000,
        position: 'top-right'
    }
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) =>
        defineComponent({
            components: { Toast, Button },
            setup() {
                const toast = useToast();
                return {
                    show: () =>
                        toast.add({
                            severity: args.severity as
                                | 'success'
                                | 'info'
                                | 'warn'
                                | 'error',
                            summary: args.summary,
                            detail: args.detail,
                            life: args.life
                        })
                };
            },
            template: `
      <div>
        <Toast :position="'${(args as { position?: string }).position || 'top-right'}'" />
        <Button label="Показати повідомлення" @click="show" />
      </div>
    `
        })
};

export const Severities: Story = {
    render: () =>
        defineComponent({
            components: { Toast, Button },
            setup() {
                const toast = useToast();
                return {
                    showSuccess: () =>
                        toast.add({
                            severity: 'success',
                            summary: 'Успіх',
                            detail: 'Дані збережено',
                            life: 3000
                        }),
                    showInfo: () =>
                        toast.add({
                            severity: 'info',
                            summary: 'Інфо',
                            detail: 'Нове повідомлення',
                            life: 3000
                        }),
                    showWarn: () =>
                        toast.add({
                            severity: 'warn',
                            summary: 'Увага',
                            detail: 'Перевірте дані',
                            life: 3000
                        }),
                    showError: () =>
                        toast.add({
                            severity: 'error',
                            summary: 'Помилка',
                            detail: 'Щось пішло не так',
                            life: 3000
                        })
                };
            },
            template: `
      <div>
        <Toast />
        <div class="flex flex-wrap gap-2">
          <Button label="Success" severity="success" @click="showSuccess" />
          <Button label="Info" severity="info" @click="showInfo" />
          <Button label="Warn" severity="warn" @click="showWarn" />
          <Button label="Error" severity="danger" @click="showError" />
        </div>
      </div>
    `
        })
};

export const Positions: Story = {
    render: () =>
        defineComponent({
            components: { Toast, Button },
            setup() {
                const toast = useToast();
                return {
                    show: (position: string) =>
                        toast.add({
                            severity: 'info',
                            summary: position,
                            detail: 'Повідомлення',
                            life: 3000,
                            group: position
                        })
                };
            },
            template: `
      <div>
        <Toast position="top-left" group="top-left" />
        <Toast position="top-center" group="top-center" />
        <Toast position="top-right" group="top-right" />
        <Toast position="bottom-left" group="bottom-left" />
        <Toast position="bottom-center" group="bottom-center" />
        <Toast position="bottom-right" group="bottom-right" />
        <div class="flex flex-wrap gap-2">
          <Button label="Top Left" @click="show('top-left')" />
          <Button label="Top Center" @click="show('top-center')" />
          <Button label="Top Right" @click="show('top-right')" />
          <Button label="Bottom Left" @click="show('bottom-left')" />
          <Button label="Bottom Center" @click="show('bottom-center')" />
          <Button label="Bottom Right" @click="show('bottom-right')" />
        </div>
      </div>
    `
        })
};
