import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Button from 'primevue/button';
import { ROUTES } from '~/constants/routes';
import PageLayout from './PageLayout.vue';

const meta: Meta<typeof PageLayout> = {
    title: 'Shared/PageLayout',
    component: PageLayout,
    argTypes: {
        title: { control: 'text' }
    }
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
    args: {
        title: 'Заголовок сторінки'
    },
    render: (args) => ({
        components: { PageLayout },
        setup: () => ({ args }),
        template: `
            <PageLayout v-bind="args">
                <template #content>
                    <p class="text-[var(--p-surface-700)]">Вміст сторінки</p>
                </template>
            </PageLayout>
        `
    })
};

export const WithTabs: Story = {
    args: {
        title: 'Профіль та налаштування',
        tabs: [
            { label: 'Особисті дані', to: ROUTES.ACCOUNT_INFO },
            { label: 'Налаштування', to: ROUTES.ACCOUNT_SETTINGS }
        ]
    },
    render: (args) => ({
        components: { PageLayout },
        setup: () => ({ args }),
        template: `
            <PageLayout v-bind="args">
                <template #content>
                    <p class="text-[var(--p-surface-700)]">Вміст активного табу</p>
                </template>
            </PageLayout>
        `
    })
};

export const WithBreadcrumbs: Story = {
    args: {
        title: 'Mercedes-Benz Sprinter 519 CDI',
        breadcrumbs: [
            { icon: 'tabler:bus', to: ROUTES.OBJECTS },
            { label: 'Онлайн', to: ROUTES.OBJECTS },
            { label: 'Mercedes-Benz Sprinter 519 CDI' }
        ]
    },
    render: (args) => ({
        components: { PageLayout },
        setup: () => ({ args }),
        template: `
            <PageLayout v-bind="args">
                <template #content>
                    <p class="text-[var(--p-surface-700)]">Деталі об'єкта</p>
                </template>
            </PageLayout>
        `
    })
};

export const Full: Story = {
    args: {
        title: 'Профіль та налаштування',
        breadcrumbs: [
            { icon: 'tabler:bus', to: ROUTES.OBJECTS },
            { label: 'Акаунт' }
        ],
        tabs: [
            { label: 'Особисті дані', to: ROUTES.ACCOUNT_INFO },
            { label: 'Налаштування', to: ROUTES.ACCOUNT_SETTINGS }
        ]
    },
    render: (args) => ({
        components: { PageLayout },
        setup: () => ({ args }),
        template: `
            <PageLayout v-bind="args">
                <template #content>
                    <p class="text-[var(--p-surface-700)]">Вміст</p>
                </template>
            </PageLayout>
        `
    })
};

export const WithActions: Story = {
    args: {
        title: 'Mercedes-Benz Sprinter 519 CDI',
        breadcrumbs: [
            { icon: 'tabler:bus', to: ROUTES.OBJECTS },
            { label: 'Онлайн', to: ROUTES.OBJECTS },
            { label: 'Mercedes-Benz Sprinter 519 CDI' }
        ],
        tabs: [
            { label: 'Онлайн', to: ROUTES.ACCOUNT_INFO },
            { label: 'Історія', to: ROUTES.ACCOUNT_SETTINGS }
        ]
    },
    render: (args) => ({
        components: { PageLayout, Button },
        setup: () => ({ args }),
        template: `
            <PageLayout v-bind="args">
                <template #actions>

                    <Button outlined>
                        <template #icon><Icon icon="tabler:share-3" /></template>
                    </Button>

                    <Button outlined>
                        <template #icon><Icon icon="tabler:pencil" /></template>
                    </Button>

                    <Button outlined severity="danger">
                        <template #icon><Icon icon="tabler:trash" /></template>
                    </Button>

                </template>
                <template #content>
                    <p class="text-[var(--p-surface-700)]">Деталі об'єкта</p>
                </template>
            </PageLayout>
        `
    })
};
