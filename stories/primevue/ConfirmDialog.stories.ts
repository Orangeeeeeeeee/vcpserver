import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent } from 'vue';
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';

const meta = {
    title: 'PrimeVue/Overlay/ConfirmDialog',
    component: ConfirmDialog,
    tags: ['autodocs'],
    argTypes: {
        message: { control: 'text' },
        header: { control: 'text' },
        acceptLabel: { control: 'text' },
        rejectLabel: { control: 'text' }
    },
    args: {
        message: 'Ви впевнені що хочете продовжити?',
        header: 'Підтвердження',
        acceptLabel: 'Так',
        rejectLabel: 'Скасувати'
    }
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) =>
        defineComponent({
            components: { ConfirmDialog, Button },
            setup() {
                const confirm = useConfirm();
                return {
                    showConfirm: () =>
                        confirm.require({
                            message: args.message,
                            header: args.header,
                            acceptLabel: args.acceptLabel,
                            rejectLabel: args.rejectLabel
                        })
                };
            },
            template: `
      <div>
        <ConfirmDialog />
        <Button label="Підтвердити дію" @click="showConfirm" />
      </div>
    `
        })
};

export const Basic: Story = {
    render: () =>
        defineComponent({
            components: { ConfirmDialog, Button },
            setup() {
                const confirm = useConfirm();
                return {
                    showConfirm: () =>
                        confirm.require({
                            message: 'Ви впевнені що хочете продовжити?',
                            header: 'Підтвердження',
                            rejectLabel: 'Скасувати',
                            acceptLabel: 'Так'
                        })
                };
            },
            template: `
      <div>
        <ConfirmDialog />
        <Button label="Підтвердити дію" @click="showConfirm" />
      </div>
    `
        })
};

export const Danger: Story = {
    render: () =>
        defineComponent({
            components: { ConfirmDialog, Button },
            setup() {
                const confirm = useConfirm();
                return {
                    showConfirm: () =>
                        confirm.require({
                            message: 'Цю дію неможливо скасувати. Продовжити?',
                            header: 'Видалення',
                            rejectLabel: 'Скасувати',
                            acceptLabel: 'Видалити',
                            acceptClass: 'p-button-danger'
                        })
                };
            },
            template: `
      <div>
        <ConfirmDialog />
        <Button label="Видалити" severity="danger" @click="showConfirm" />
      </div>
    `
        })
};
