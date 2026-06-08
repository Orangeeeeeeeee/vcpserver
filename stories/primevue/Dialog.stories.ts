import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';

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

export const WithSubtitleHeader: Story = {
    render: () => ({
        components: { Dialog, Button },
        setup() {
            const visible = ref(false);
            return { visible };
        },
        template: `
      <div>
        <Button label="Відкрити" @click="visible = true" />
        <Dialog
          v-model:visible="visible"
          modal
          :draggable="false"
          :style="{ width: '28rem' }"
        >
          <template #header>
            <div class="flex flex-col gap-1">
              <h2 class="text-lg font-semibold text-surface-950">
                Додати трекер
              </h2>
              <p class="text-sm text-surface-600">
                Заповніть інформацію про новий GPS-трекер.
              </p>
            </div>
          </template>
          <p class="text-sm text-surface-700">
            Слот #header дозволяє рендерити title + subtitle замість стандартного header-пропа.
          </p>
          <template #footer>
            <Button label="Скасувати" severity="secondary" @click="visible = false" />
            <Button label="Додати" @click="visible = false" />
          </template>
        </Dialog>
      </div>
    `
    })
};

export const WithForm: Story = {
    render: () => ({
        components: { Dialog, Button, InputText, Select, MultiSelect },
        setup() {
            const visible = ref(false);
            const imei = ref('');
            const company = ref<string | null>(null);
            const transport = ref<string | null>(null);
            const params = ref<string[]>([]);
            const companies = [
                'Logistics UA',
                'CityBus Group',
                '1 UA',
                'Logistics'
            ];
            const transports = [
                'MAN TGX 18.480',
                'Volvo FH 460',
                'Scania R 500'
            ];
            const paramsList = [
                'Швидкість',
                'Температура двигуна',
                'Рівень палива',
                'Пробіг'
            ];
            return {
                visible,
                imei,
                company,
                transport,
                params,
                companies,
                transports,
                paramsList
            };
        },
        template: `
      <div>
        <Button label="Додати трекер" @click="visible = true" />
        <Dialog
          v-model:visible="visible"
          modal
          :draggable="false"
          :style="{ width: '28rem' }"
        >
          <template #header>
            <div class="flex flex-col gap-1">
              <h2 class="text-lg font-semibold text-surface-950">
                Додати трекер
              </h2>
              <p class="text-sm text-surface-600">
                Заповніть інформацію про новий GPS-трекер.
              </p>
            </div>
          </template>
          <form class="flex flex-col gap-5" @submit.prevent>
            <div class="flex flex-col gap-1.5">
              <label for="story-imei" class="text-sm text-surface-700">IMEI</label>
              <InputText id="story-imei" v-model="imei" placeholder="Введіть IMEI" fluid />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="story-company" class="text-sm text-surface-700">Компанія</label>
              <Select id="story-company" v-model="company" :options="companies" placeholder="Оберіть компанію" fluid />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="story-transport" class="text-sm text-surface-700">Транспорт</label>
              <Select id="story-transport" v-model="transport" :options="transports" placeholder="Оберіть транспорт" fluid />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="story-params" class="text-sm text-surface-700">Параметри</label>
              <MultiSelect id="story-params" v-model="params" :options="paramsList" display="chip" placeholder="Оберіть параметри" fluid />
            </div>
          </form>
          <template #footer>
            <Button label="Скасувати" severity="secondary" @click="visible = false" />
            <Button label="Додати" @click="visible = false" />
          </template>
        </Dialog>
      </div>
    `
    })
};
