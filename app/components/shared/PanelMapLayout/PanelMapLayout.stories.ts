import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Button from 'primevue/button';
import PanelMapLayout from './PanelMapLayout.vue';
import type { PanelMapLayoutView } from './PanelMapLayout.vue';

const meta: Meta<typeof PanelMapLayout> = {
    title: 'Shared/PanelMapLayout',
    component: PanelMapLayout,
    argTypes: {
        panelClass: { control: 'text' },
        mapClass: { control: 'text' }
    }
};

export default meta;
type Story = StoryObj<typeof PanelMapLayout>;

export const Default: Story = {
    render: (args) => ({
        components: { PanelMapLayout, Button },
        setup: () => {
            const view = ref<PanelMapLayoutView>('map');
            return { args, view };
        },
        template: `
            <div class="h-[32rem]">
                <PanelMapLayout v-bind="args" v-model:view="view" class="h-full">
                    <template #panel>
                        <div class="flex h-full flex-col items-start gap-3 bg-indigo-100 p-4">
                            <p class="text-surface-700">Панель (список)</p>
                            <Button class="lg:hidden" label="Показати карту" @click="view = 'map'" />
                        </div>
                    </template>
                    <template #map>
                        <div class="flex h-full flex-col items-start gap-3 bg-teal-100 p-4">
                            <p class="text-surface-700">Карта</p>
                            <Button class="lg:hidden" label="Показати панель" @click="view = 'panel'" />
                        </div>
                    </template>
                </PanelMapLayout>
            </div>
        `
    })
};

export const PanelOpen: Story = {
    render: (args) => ({
        components: { PanelMapLayout, Button },
        setup: () => {
            const view = ref<PanelMapLayoutView>('panel');
            return { args, view };
        },
        template: `
            <div class="h-[32rem]">
                <PanelMapLayout v-bind="args" v-model:view="view" class="h-full">
                    <template #panel>
                        <div class="flex h-full flex-col items-start gap-3 bg-indigo-100 p-4">
                            <p class="text-surface-700">Панель відкрита поверх карти (нижче lg)</p>
                            <Button class="lg:hidden" label="Показати карту" @click="view = 'map'" />
                        </div>
                    </template>
                    <template #map>
                        <div class="flex h-full flex-col items-start gap-3 bg-teal-100 p-4">
                            <p class="text-surface-700">Карта (завжди відрендерена)</p>
                            <Button class="lg:hidden" label="Показати панель" @click="view = 'panel'" />
                        </div>
                    </template>
                </PanelMapLayout>
            </div>
        `
    })
};
