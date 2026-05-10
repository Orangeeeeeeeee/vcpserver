import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const meta = {
    title: 'PrimeVue/Panel/Accordion',
    component: Accordion,
    tags: ['autodocs']
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        multiple: false
    },
    argTypes: {
        multiple: { control: 'boolean' }
    },
    render: (args) => ({
        components: {
            Accordion,
            AccordionPanel,
            AccordionHeader,
            AccordionContent
        },
        setup() {
            return { args };
        },
        template: `
      <Accordion value="0" v-bind="args">
        <AccordionPanel value="0">
          <AccordionHeader>Загальна інформація</AccordionHeader>
          <AccordionContent>
            <p>Вміст першої секції з загальною інформацією про проєкт.</p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
          <AccordionHeader>Налаштування</AccordionHeader>
          <AccordionContent>
            <p>Вміст другої секції з налаштуваннями.</p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
          <AccordionHeader>Додатково</AccordionHeader>
          <AccordionContent>
            <p>Вміст третьої секції з додатковою інформацією.</p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    `
    })
};

export const Basic: Story = {
    render: () => ({
        components: {
            Accordion,
            AccordionPanel,
            AccordionHeader,
            AccordionContent
        },
        template: `
      <Accordion value="0">
        <AccordionPanel value="0">
          <AccordionHeader>Загальна інформація</AccordionHeader>
          <AccordionContent>
            <p>Вміст першої секції з загальною інформацією про проєкт.</p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
          <AccordionHeader>Налаштування</AccordionHeader>
          <AccordionContent>
            <p>Вміст другої секції з налаштуваннями.</p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
          <AccordionHeader>Додатково</AccordionHeader>
          <AccordionContent>
            <p>Вміст третьої секції з додатковою інформацією.</p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    `
    })
};

export const Multiple: Story = {
    render: () => ({
        components: {
            Accordion,
            AccordionPanel,
            AccordionHeader,
            AccordionContent
        },
        template: `
      <Accordion multiple :value="['0']">
        <AccordionPanel value="0">
          <AccordionHeader>Перша секція</AccordionHeader>
          <AccordionContent>
            <p>Можна відкрити кілька секцій одночасно.</p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
          <AccordionHeader>Друга секція</AccordionHeader>
          <AccordionContent>
            <p>Ця секція також може бути відкрита.</p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
          <AccordionHeader>Третя секція</AccordionHeader>
          <AccordionContent>
            <p>І ця також.</p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    `
    })
};
