import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const meta = {
    title: 'PrimeVue/Overlay/Dialog',
    component: Dialog,
    tags: ['autodocs'],
    argTypes: {
        header: { control: 'text' },
        modal: { control: 'boolean' },
        draggable: { control: 'boolean' },
        closable: { control: 'boolean' },
        maximizable: { control: 'boolean' }
    },
    args: {
        header: 'Діалог',
        modal: true,
        draggable: false,
        closable: true,
        maximizable: false
    }
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => ({
        components: { Dialog, Button },
        setup() {
            const visible = ref(false);
            return { args, visible };
        },
        template: `
      <Button label="Відкрити" @click="visible = true" />
      <Dialog v-model:visible="visible" v-bind="args">
        <p>Контент діалогу</p>
      </Dialog>
    `
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Dialog, Button },
        data: () => ({ visible: false }),
        template: `
      <div>
        <Button label="Відкрити" @click="visible = true" />
        <Dialog v-model:visible="visible" header="Заголовок" :style="{ width: '450px' }">
          <p>Вміст діалогового вікна</p>
        </Dialog>
      </div>
    `
    })
};

export const WithFooter: Story = {
    render: () => ({
        components: { Dialog, Button },
        data: () => ({ visible: false }),
        template: `
      <div>
        <Button label="Відкрити" @click="visible = true" />
        <Dialog v-model:visible="visible" header="Підтвердження" :style="{ width: '450px' }" modal>
          <p>Ви впевнені що хочете продовжити?</p>
          <template #footer>
            <Button label="Скасувати" severity="secondary" @click="visible = false" />
            <Button label="Підтвердити" @click="visible = false" />
          </template>
        </Dialog>
      </div>
    `
    })
};

export const Maximizable: Story = {
    render: () => ({
        components: { Dialog, Button },
        data: () => ({ visible: false }),
        template: `
      <div>
        <Button label="Відкрити" @click="visible = true" />
        <Dialog v-model:visible="visible" header="Maximizable" maximizable :style="{ width: '50vw' }">
          <p>Це вікно можна розгорнути на повний екран.</p>
        </Dialog>
      </div>
    `
    })
};
