<template>
    <div class="flex flex-col">
        <div
            class="pt-6 pb-2 pr-4 pl-4 md:p-4 lg:pl-10 lg:pr-10 lg:pt-6 lg:pb-4 border-b border-b-[var(--p-surface-300)]"
        >
            <div
                class="page-header grid grid-cols-[1fr_auto] items-center gap-2 md:gap-4"
            >
                <div
                    class="[grid-area:title] flex items-center gap-3 justify-between"
                >
                    <h1
                        class="font-manrope text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] font-semibold text-[var(--p-surface-950)]"
                    >
                        {{ title }}
                    </h1>
                    <Button
                        severity="secondary"
                        text
                        class="md:hidden"
                        @click="openMobile"
                    >
                        <template #icon>
                            <Icon
                                name="tabler:menu-2"
                                class="size-6 text-[var(--p-primary-950)]"
                            />
                        </template>
                    </Button>
                </div>

                <Breadcrumb
                    v-if="breadcrumbs?.length"
                    :model="breadcrumbs"
                    class="[grid-area:crumb] min-w-0"
                >
                    <template #item="{ item }">
                        <NuxtLink
                            v-if="item.to"
                            :to="item.to"
                            class="flex items-center gap-1.5 text-sm text-[var(--p-surface-700)] hover:text-[var(--p-primary-600)] transition-colors min-w-0"
                        >
                            <Icon
                                v-if="item.icon"
                                :name="item.icon"
                                class="size-[1.125rem] shrink-0"
                            />
                            <span v-if="item.label" class="truncate">
                                {{ item.label }}
                            </span>
                        </NuxtLink>
                        <span
                            v-else
                            class="flex items-center gap-1.5 text-sm text-[var(--p-primary-600)] min-w-0"
                        >
                            <Icon
                                v-if="item.icon"
                                :name="item.icon"
                                class="size-[1.125rem] shrink-0"
                            />
                            <span v-if="item.label" class="truncate">
                                {{ item.label }}
                            </span>
                        </span>
                    </template>
                    <template #separator>/</template>
                </Breadcrumb>

                <Tabs
                    v-if="tabs?.length"
                    :value="route.path"
                    class="[grid-area:tabs] min-w-0"
                >
                    <TabList :pt="{ tabList: { class: 'gap-4 md:gap-5' } }">
                        <Tab
                            v-for="tab in tabs"
                            :key="tab.to"
                            :value="tab.to"
                            as="router-link"
                            :to="tab.to"
                            :pt="{ root: { class: 'text-sm md:text-base' } }"
                        >
                            {{ tab.label }}
                        </Tab>
                    </TabList>
                </Tabs>

                <div
                    v-if="$slots.actions"
                    class="[grid-area:actions] flex justify-end items-center gap-2 shrink-0"
                >
                    <slot name="actions"></slot>
                </div>
            </div>
        </div>
        <div class="p-4 lg:p-6">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script lang="ts">
export interface PageLayoutTab {
    /** Tab label text */
    label: string;
    /** Target route path */
    to: string;
}

export interface PageLayoutBreadcrumb {
    /** Item label text */
    label?: string;
    /** Iconify icon name (e.g. 'tabler:bus') */
    icon?: string;
    /** Target route; omit for the current (non-clickable) item */
    to?: string;
}
</script>

<script setup lang="ts">
const route = useRoute();
const { openMobile } = useSidebar();

interface PageLayoutProps {
    /** Page title */
    title: string;
    /** Navigation tabs rendered under the title */
    tabs?: PageLayoutTab[];
    /** Breadcrumb items rendered on the right of the title */
    breadcrumbs?: PageLayoutBreadcrumb[];
}

defineProps<PageLayoutProps>();
</script>

<style scoped>
/* Header reflows between breakpoints: actions sit by the tabs on desktop,
   and move up next to the breadcrumb on mobile. */
.page-header {
    grid-template-areas:
        'title title'
        'crumb actions'
        'tabs tabs';
}

@media (min-width: 768px) {
    .page-header {
        grid-template-areas:
            'title crumb'
            'tabs actions';
    }
}

/* Keep the breadcrumb on one line: only the current (last) crumb shrinks and
   truncates with an ellipsis; preceding crumbs and separators stay intact. */
.page-header :deep(.p-breadcrumb-item:last-child) {
    min-width: 0;
}

.page-header :deep(.p-breadcrumb-item:not(:last-child)),
.page-header :deep(.p-breadcrumb-separator) {
    flex-shrink: 0;
}
</style>
