import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, computed } from 'vue';
import { Icon } from '@iconify/vue';
import Button from 'primevue/button';
import img401 from '../app/assets/images/401.svg';
import img403 from '../app/assets/images/403.svg';
import img404 from '../app/assets/images/404.svg';
import img500 from '../app/assets/images/500.svg';
import img503 from '../app/assets/images/503.svg';

const errorImages: Record<string, string> = {
    '401': img401,
    '403': img403,
    '404': img404,
    '500': img500,
    '503': img503
};

const errors: Record<
    string,
    { label: string; title: string; description: string }
> = {
    '401': {
        label: 'Помилка 401',
        title: 'Необхідно авторизуватись',
        description:
            'Для перегляду цієї сторінки, будь ласка, авторизуйтесь у системі.'
    },
    '403': {
        label: 'Помилка 403',
        title: 'Дія заборонена',
        description: 'У вас недостатньо прав для перегляду цієї сторінки.'
    },
    '404': {
        label: 'Помилка 404',
        title: 'Сторінку не знайдено',
        description:
            'Схоже, адреса сторінки змінилася, або її ніколи не існувало.'
    },
    '500': {
        label: 'Помилка 500',
        title: 'Помилка сервера',
        description:
            'Щось пішло не так на нашому боці. Ми вже знаємо про проблему та працюємо над її вирішенням.'
    },
    '503': {
        label: 'Помилка 503',
        title: 'Проводимо технічні роботи',
        description:
            'Ми оновлюємо систему, щоб зробити сервіс ще кращим. Це не займе багато часу, зачекайте, будь ласка.'
    }
};

const ErrorPage = defineComponent({
    props: {
        statusCode: { type: Number, default: 404 }
    },
    components: { Button, Icon },
    setup(props) {
        const code = computed(() => {
            const c = String(props.statusCode);
            return c in errors ? c : '404';
        });
        const errorData = computed(() => errors[code.value]);
        const errorImage = computed(() => errorImages[code.value]);
        const isAuth = computed(() => props.statusCode === 401);
        return { code, errorData, errorImage, isAuth };
    },
    template: `
        <div class="flex flex-col min-h-dvh">
            <div class="flex flex-1 flex-col lg:flex-row items-center justify-center px-4 md:px-8 gap-8 md:gap-16 lg:gap-20 lg:max-w-[1300px] lg:m-auto">
                <div class="flex flex-col items-center lg:items-start text-center lg:text-left order-2 md:order-1 md:max-w-[460px] lg:max-w-max lg:shrink-0">
                    <p class="text-xs md:text-sm lg:text-base mb-2 lg:mb-4 font-semibold text-[var(--p-primary-600)]">
                        {{ errorData.label }}
                    </p>
                    <h1 class="font-manrope text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] font-semibold text-[var(--p-primary-950)] mb-2 lg:mb-4">
                        {{ errorData.title }}
                    </h1>
                    <p class="text-xs md:text-sm lg:text-base text-[var(--p-surface-500)] mb-8 md:mb-11">
                        {{ errorData.description }}
                    </p>
                    <div class="flex gap-3 w-full">
                        <Button severity="secondary" label="Назад" class="grow shrink-0 lg:grow-0">
                            <template #icon><Icon icon="tabler:arrow-left" /></template>
                        </Button>
                        <Button v-if="isAuth" label="Увійти" class="grow shrink-0 lg:grow-0" />
                        <Button v-else label="На головну" class="grow shrink-0 lg:grow-0" />
                    </div>
                </div>
                <div class="order-[-1] lg:order-2 w-full max-w-[81.634%] md:max-w-[56.82%] h-auto flex items-center justify-center">
                    <img :src="errorImage" :alt="errorData.label" class="w-full h-auto" />
                </div>
            </div>
        </div>
    `
});

const meta: Meta<typeof ErrorPage> = {
    title: 'Pages/Error',
    component: ErrorPage,
    parameters: {
        layout: 'fullscreen'
    },
    argTypes: {
        statusCode: {
            control: 'select',
            options: [401, 403, 404, 500, 503]
        }
    }
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Playground: Story = {
    args: { statusCode: 404 }
};

export const Error401: Story = { args: { statusCode: 401 } };
export const Error403: Story = { args: { statusCode: 403 } };
export const Error404: Story = { args: { statusCode: 404 } };
export const Error500: Story = { args: { statusCode: 500 } };
export const Error503: Story = { args: { statusCode: 503 } };
