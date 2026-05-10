import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const meta = {
    title: 'PrimeVue/Panel/Tabs',
    component: Tabs,
    tags: ['autodocs']
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        scrollable: false
    },
    argTypes: {
        scrollable: { control: 'boolean' }
    },
    render: (args) => ({
        components: { Tabs, TabList, Tab, TabPanels, TabPanel },
        setup() {
            return { args };
        },
        template: `
      <Tabs value="0" v-bind="args">
        <TabList>
          <Tab value="0">Загальне</Tab>
          <Tab value="1">Налаштування</Tab>
          <Tab value="2">Безпека</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <p class="p-4">Вміст вкладки "Загальне"</p>
          </TabPanel>
          <TabPanel value="1">
            <p class="p-4">Вміст вкладки "Налаштування"</p>
          </TabPanel>
          <TabPanel value="2">
            <p class="p-4">Вміст вкладки "Безпека"</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    `
    })
};

export const Basic: Story = {
    render: () => ({
        components: { Tabs, TabList, Tab, TabPanels, TabPanel },
        template: `
      <Tabs value="0">
        <TabList>
          <Tab value="0">Загальне</Tab>
          <Tab value="1">Налаштування</Tab>
          <Tab value="2">Безпека</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <p class="p-4">Вміст вкладки "Загальне"</p>
          </TabPanel>
          <TabPanel value="1">
            <p class="p-4">Вміст вкладки "Налаштування"</p>
          </TabPanel>
          <TabPanel value="2">
            <p class="p-4">Вміст вкладки "Безпека"</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    `
    })
};

export const Scrollable: Story = {
    render: () => ({
        components: { Tabs, TabList, Tab, TabPanels, TabPanel },
        template: `
      <Tabs value="0" scrollable>
        <TabList>
          <Tab v-for="i in 10" :key="i" :value="String(i - 1)">Вкладка {{ i }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="i in 10" :key="i" :value="String(i - 1)">
            <p class="p-4">Вміст вкладки {{ i }}</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    `
    })
};
