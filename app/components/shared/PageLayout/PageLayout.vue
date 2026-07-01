<template>
    <div class="flex min-h-dvh w-full flex-col">
        <div
            class="pt-6 pb-2 pr-4 pl-4 md:p-4 lg:pl-10 lg:pr-10 lg:pt-6 lg:pb-4 border-b border-b-[var(--p-surface-300)]"
        >
            <div
                class="page-header grid grid-cols-[1fr_auto] items-center gap-2 md:gap-[0.25rem]"
            >
                <div
                    class="[grid-area:title] flex items-center gap-3 justify-between"
                >
                    <h1
                        class="font-manrope text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] font-semibold text-surface-950"
                    >
                        {{ title }}
                    </h1>
                    <div class="flex justify-end items-center gap-2 shrink-0">
                        <div id="page-actions-header"></div>
                        <Button
                            severity="secondary"
                            text
                            class="md:hidden"
                            @click="openMobile"
                        >
                            <template #icon>
                                <Icon
                                    name="custom:burger"
                                    class="size-6 text-primary-950"
                                />
                            </template>
                        </Button>
                    </div>
                </div>

                <div
                    id="page-breadcrumbs-target"
                    class="[grid-area:crumb] min-w-0 md:ml-auto"
                ></div>

                <UiTabNav
                    v-if="tabs?.length"
                    :value="route.path"
                    :items="tabs"
                    class="[grid-area:tabs] min-w-0"
                    :border="false"
                />

                <div
                    id="page-actions-target"
                    class="[grid-area:actions] flex justify-end items-center gap-2 shrink-0"
                ></div>
            </div>
        </div>
        <div class="flex min-h-0 flex-1 flex-col p-4 lg:px-6 lg:py-5">
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
    /** Optional Iconify icon rendered after the label (e.g. 'tabler:arrow-up-right') */
    trailingIcon?: string;
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
</style>
