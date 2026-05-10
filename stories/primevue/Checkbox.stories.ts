import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Checkbox from 'primevue/checkbox';
import { ref } from 'vue';

const meta = {
    title: 'PrimeVue/Form/Checkbox',
    component: Checkbox,
    tags: ['autodocs']
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        binary: true,
        disabled: false,
        invalid: false,
        readonly: false
    },
    argTypes: {
        binary: { control: 'boolean' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        readonly: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Checkbox },
        setup() {
            const checked = ref(false);
            return { args, checked };
        },
        template: '<Checkbox v-model="checked" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Checkbox },
        data: () => ({ checked: false }),
        template: `
      <div class="flex items-center gap-2">
        <Checkbox v-model="checked" inputId="cb1" :binary="true" />
        <label for="cb1">Погоджуюсь</label>
      </div>
    `
    })
};

export const Group: Story = {
    render: () => ({
        components: { Checkbox },
        data: () => ({ selected: [] }),
        template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <Checkbox v-model="selected" inputId="c1" value="Київ" />
          <label for="c1">Київ</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="selected" inputId="c2" value="Львів" />
          <label for="c2">Львів</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="selected" inputId="c3" value="Одеса" />
          <label for="c3">Одеса</label>
        </div>
      </div>
    `
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { Checkbox },
        data: () => ({ checked: true }),
        template: `
      <div class="flex items-center gap-2">
        <Checkbox v-model="checked" :binary="true" disabled />
        <label>Disabled</label>
      </div>
    `
    })
};

export const Invalid: Story = {
    render: () => ({
        components: { Checkbox },
        data: () => ({ checked: false }),
        template: `
      <div class="flex items-center gap-2">
        <Checkbox v-model="checked" :binary="true" invalid />
        <label>Invalid</label>
      </div>
    `
    })
};
