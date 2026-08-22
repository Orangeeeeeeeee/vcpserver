import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import AnimatedList from './AnimatedList.vue';
import type { AnimatedListItem } from './AnimatedList.vue';

const meta: Meta<typeof AnimatedList> = {
    title: 'UI/AnimatedList',
    component: AnimatedList,
};

export default meta;
type Story = StoryObj<typeof AnimatedList>;

/** Default built-in card UI with interactive add/remove */
export const Default: Story = {
    render: () => ({
        components: { AnimatedList },
        setup() {
            let nextId = 4;

            const items = ref<AnimatedListItem[]>([
                { id: 1, title: 'Маршрут Київ — Бориспіль' },
                { id: 2, title: 'Маршрут Харків — Полтава' },
                { id: 3, title: 'Маршрут Одеса — Миколаїв' },
            ]);

            const addTop = (): void => {
                const id = nextId++;
                items.value = [{ id, title: `Новий маршрут ${id}` }, ...items.value];
            };

            const addEnd = (): void => {
                const id = nextId++;
                items.value = [...items.value, { id, title: `Новий маршрут ${id}` }];
            };

            const remove = (id: string | number): void => {
                items.value = items.value.filter((i) => i.id !== id);
            };

            return { items, addTop, addEnd, remove };
        },
        template: `
            <div class="p-6 max-w-sm space-y-4">
                <div class="flex gap-2">
                    <button
                        class="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-700 shadow-sm hover:bg-surface-50"
                        @click="addTop"
                    >↑ Вгору</button>
                    <button
                        class="rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-700 shadow-sm hover:bg-surface-50"
                        @click="addEnd"
                    >↓ Вниз</button>
                </div>
                <AnimatedList :items="items" @remove="remove" />
            </div>
        `,
    }),
};

/** Empty list — renders nothing without errors */
export const Empty: Story = {
    render: () => ({
        components: { AnimatedList },
        template: `<div class="p-6 max-w-sm"><AnimatedList :items="[]" /></div>`,
    }),
};

/**
 * Custom slot — items with richer shape passed via #default slot.
 * Demonstrates getKey and full control over item rendering.
 */
export const CustomSlot: Story = {
    render: () => ({
        components: { AnimatedList },
        setup() {
            const people = ref([
                { id: 'p1', name: 'Василь Прийма', role: 'Старший водій', initials: 'ВП' },
                { id: 'p2', name: 'Олена Коваль', role: 'Водій', initials: 'ОК' },
                { id: 'p3', name: 'Ігор Мартиненко', role: 'Водій', initials: 'ІМ' },
            ]);

            const remove = (index: number): void => {
                people.value.splice(index, 1);
            };

            return { people, remove };
        },
        template: `
            <div class="p-6 max-w-sm">
                <AnimatedList :items="people" :get-key="(p) => p.id">
                    <template #default="{ item, index }">
                        <div class="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 shadow-sm">
                            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                                {{ item.initials }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="truncate text-sm font-medium text-surface-900">{{ item.name }}</div>
                                <div class="text-xs text-surface-500">{{ item.role }}</div>
                            </div>
                            <button
                                class="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-red-500"
                                @click="remove(index)"
                            >✕</button>
                        </div>
                    </template>
                </AnimatedList>
            </div>
        `,
    }),
};
