import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import RadioButton from 'primevue/radiobutton';

const meta = {
    title: 'PrimeVue/Form/RadioButton',
    component: RadioButton,
    tags: ['autodocs']
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        disabled: false,
        invalid: false
    },
    argTypes: {
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' }
    },
    render: (args) => ({
        components: { RadioButton },
        setup() {
            const value = ref('Київ');
            return { args, value };
        },
        template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <RadioButton v-model="value" inputId="pg1" value="Київ" v-bind="args" />
          <label for="pg1">Київ</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="value" inputId="pg2" value="Львів" v-bind="args" />
          <label for="pg2">Львів</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="value" inputId="pg3" value="Одеса" v-bind="args" />
          <label for="pg3">Одеса</label>
        </div>
      </div>
    `
    })
};

export const Group: Story = {
    render: () => ({
        components: { RadioButton },
        data: () => ({ selected: 'Київ' }),
        template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <RadioButton v-model="selected" inputId="r1" value="Київ" />
          <label for="r1">Київ</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="selected" inputId="r2" value="Львів" />
          <label for="r2">Львів</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="selected" inputId="r3" value="Одеса" />
          <label for="r3">Одеса</label>
        </div>
      </div>
    `
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { RadioButton },
        data: () => ({ selected: 'Київ' }),
        template: `
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="rd" value="Київ" disabled />
        <label for="rd">Disabled</label>
      </div>
    `
    })
};

export const Invalid: Story = {
    render: () => ({
        components: { RadioButton },
        data: () => ({ selected: null }),
        template: `
      <div class="flex items-center gap-2">
        <RadioButton v-model="selected" inputId="ri" value="test" invalid />
        <label for="ri">Invalid</label>
      </div>
    `
    })
};
