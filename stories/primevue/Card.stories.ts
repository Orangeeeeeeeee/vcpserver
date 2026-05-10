import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Icon } from '@iconify/vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

const meta = {
    title: 'PrimeVue/Panel/Card',
    component: Card,
    tags: ['autodocs']
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {},
    argTypes: {},
    render: (args) => ({
        components: { Card },
        setup() {
            return { args };
        },
        template: `
      <Card style="width: 25rem" v-bind="args">
        <template #title>Заголовок</template>
        <template #subtitle>Підзаголовок</template>
        <template #content>
          <p>Вміст картки з описом та додатковою інформацією.</p>
        </template>
        <template #footer>
          <p class="text-surface-500 text-sm">Нижній колонтитул</p>
        </template>
      </Card>
    `
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Card },
        template: `
      <Card style="width: 25rem">
        <template #title>Заголовок</template>
        <template #content>
          <p>Вміст картки з описом та додатковою інформацією.</p>
        </template>
      </Card>
    `
    })
};

export const WithSubtitle: Story = {
    render: () => ({
        components: { Card },
        template: `
      <Card style="width: 25rem">
        <template #title>Заголовок</template>
        <template #subtitle>Підзаголовок</template>
        <template #content>
          <p>Вміст картки з описом та додатковою інформацією.</p>
        </template>
      </Card>
    `
    })
};

export const WithHeaderAndFooter: Story = {
    render: () => ({
        components: { Card, Button, Icon },
        template: `
      <Card style="width: 25rem">
        <template #header>
          <div class="bg-surface-100 dark:bg-surface-800 h-40 flex items-center justify-center rounded-t-lg">
            <Icon icon="tabler:photo" class="text-4xl text-surface-400" />
          </div>
        </template>
        <template #title>Проєкт</template>
        <template #subtitle>Опис проєкту</template>
        <template #content>
          <p>Детальна інформація про проєкт та його прогрес.</p>
        </template>
        <template #footer>
          <div class="flex gap-2">
            <Button label="Зберегти" />
            <Button label="Скасувати" severity="secondary" />
          </div>
        </template>
      </Card>
    `
    })
};
