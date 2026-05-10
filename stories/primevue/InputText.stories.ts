import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

const meta = {
    title: 'PrimeVue/Form/InputText',
    component: InputText,
    tags: ['autodocs']
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        placeholder: 'Введіть текст',
        disabled: false,
        invalid: false,
        variant: undefined,
        size: undefined
    },
    argTypes: {
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        variant: {
            control: 'select',
            options: [undefined, 'filled']
        },
        size: {
            control: 'select',
            options: [undefined, 'small', 'large']
        }
    },
    render: (args) => ({
        components: { InputText },
        setup() {
            const value = ref('');
            return { args, value };
        },
        template: '<InputText v-model="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { InputText },
        data: () => ({ value: '' }),
        template: '<InputText v-model="value" placeholder="Введіть текст" />'
    })
};

export const Sizes: Story = {
    render: () => ({
        components: { InputText },
        data: () => ({ v1: '', v2: '', v3: '' }),
        template: `
      <div class="flex flex-col gap-4">
        <InputText v-model="v1" size="small" placeholder="Small" />
        <InputText v-model="v2" placeholder="Normal" />
        <InputText v-model="v3" size="large" placeholder="Large" />
      </div>
    `
    })
};

export const States: Story = {
    render: () => ({
        components: { InputText, FloatLabel },
        data: () => ({ v1: '', v2: 'Filled value', v3: '', v4: '', v5: '', v6: '' }),
        template: `
      <div class="flex flex-col gap-4">
        <InputText v-model="v1" placeholder="Default" />
        <InputText v-model="v2" />
        <InputText v-model="v3" disabled placeholder="Disabled" />
        <InputText v-model="v4" invalid placeholder="Invalid" />
        <InputText v-model="v6" variant="filled" placeholder="Filled" />
        <FloatLabel>
          <InputText id="invalid-float" v-model="v5" invalid />
          <label for="invalid-float">Float Label Invalid</label>
        </FloatLabel>
      </div>
    `
    })
};

export const WithFloatLabel: Story = {
    render: () => ({
        components: { InputText, FloatLabel },
        data: () => ({ value: '' }),
        template: `
      <FloatLabel>
        <InputText id="username" v-model="value" />
        <label for="username">Ім'я користувача</label>
      </FloatLabel>
    `
    })
};

export const WithIcon: Story = {
    render: () => ({
        components: { InputText, IconField, InputIcon, Icon },
        data: () => ({ v1: '', v2: '' }),
        template: `
      <div class="flex flex-col gap-4">
        <IconField>
          <InputIcon><Icon icon="tabler:search" /></InputIcon>
          <InputText v-model="v1" placeholder="Пошук" />
        </IconField>
        <IconField iconPosition="right">
          <InputText v-model="v2" placeholder="Пошук" />
          <InputIcon><Icon icon="tabler:loader-2" /></InputIcon>
        </IconField>
      </div>
    `
    })
};
