import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { Icon } from '@iconify/vue';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import { formatUaDate } from '~/utils/date';

const meta = {
    title: 'PrimeVue/Form/DatePicker',
    component: DatePicker,
    tags: ['autodocs']
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    args: {
        placeholder: 'Оберіть дату',
        disabled: false,
        invalid: false,
        showIcon: false,
        showTime: false,
        selectionMode: 'single'
    },
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
        showIcon: { control: 'boolean' },
        showTime: { control: 'boolean' },
        selectionMode: {
            control: 'select',
            options: ['single', 'multiple', 'range']
        }
    },
    render: (args) => ({
        components: { DatePicker },
        setup() {
            const value = ref(null);
            return { args, value };
        },
        template: '<DatePicker v-model="value" v-bind="args" />'
    })
};

export const Basic: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template: '<DatePicker v-model="date" placeholder="Оберіть дату" />'
    })
};

export const WithTime: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template:
            '<DatePicker v-model="date" showTime hourFormat="24" placeholder="Дата і час" />'
    })
};

export const Range: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ dates: null }),
        template:
            '<DatePicker v-model="dates" selectionMode="range" placeholder="Діапазон дат" />'
    })
};

export const RangeInline: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ dates: null }),
        template: '<DatePicker v-model="dates" selectionMode="range" inline />'
    })
};

/**
 * Compact range picker configured like the report period filter
 * (`ReportsPeriodPicker`): calendar icon inside the input, ‹ month year ›
 * nav on top, start/end fields below it, auto-close once both ends are
 * picked, capped panel width.
 */
export const RangePeriod: Story = {
    render: () => ({
        components: { DatePicker, InputText, Icon },
        setup() {
            const dates: Ref<Date[] | null> = ref(null);
            const startLabel = computed(() => formatUaDate(dates.value?.[0]));
            const endLabel = computed(() => formatUaDate(dates.value?.[1]));
            const pt = {
                // !important classes beat the inline width PrimeVue freezes
                // on open (single-line max-content of the wrapped header)
                panel: { class: '!w-[21.5rem] !min-w-0' },
                // The #header slot renders inside the nav row; wrap pushes
                // the full-width range inputs below the nav controls
                header: { class: 'flex-wrap gap-y-3' }
            };
            return { dates, startLabel, endLabel, pt };
        },
        template: `
            <DatePicker
                v-model="dates"
                class="w-64"
                selection-mode="range"
                :manual-input="false"
                hide-on-range-selection
                show-icon
                icon-display="input"
                fluid
                placeholder="Оберіть період"
                :pt="pt"
            >
                <template #inputicon="{ clickCallback }">
                    <Icon
                        icon="tabler:calendar-event"
                        class="size-5 shrink-0 text-surface-600"
                        @click="clickCallback"
                    />
                </template>
                <template #header>
                    <div class="order-last grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                        <InputText :value="startLabel" readonly fluid class="min-w-0" size="small" placeholder="Початок" />
                        <span class="text-surface-600">–</span>
                        <InputText :value="endLabel" readonly fluid class="min-w-0" size="small" placeholder="Кінець" />
                    </div>
                </template>
            </DatePicker>
        `
    })
};

export const Inline: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template: '<DatePicker v-model="date" inline />'
    })
};

export const MonthPicker: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template:
            '<DatePicker v-model="date" view="month" dateFormat="mm/yy" placeholder="Оберіть місяць" />'
    })
};

export const Disabled: Story = {
    render: () => ({
        components: { DatePicker },
        data: () => ({ date: null }),
        template:
            '<DatePicker v-model="date" disabled placeholder="Disabled" />'
    })
};
