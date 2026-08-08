<template>
    <div class="flex min-h-dvh w-full flex-col">
        <div
            class="pt-6 pb-2 pr-4 pl-4 md:p-4 lg:pl-10 lg:pr-10 lg:pt-6 lg:pb-4 border-b border-b-[var(--p-surface-300)]"
        >
            <div
                class="page-header grid grid-cols-[1fr_auto] items-center gap-x-2"
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
                    class="[grid-area:crumb] min-w-0"
                ></div>

                <UiTabNav
                    v-if="tabs?.length"
                    :value="route.path"
                    :items="tabs"
                    class="page-header-tabs [grid-area:tabs] min-w-0"
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
/* Header reflows between breakpoints: on mobile breadcrumb/actions share row 2
   and tabs span full width in row 3; on desktop breadcrumb floats right in row 1
   and tabs/actions share row 2. */
.page-header {
    grid-template-areas:
        'title title'
        'crumb actions'
        'tabs tabs';
}

/* Teleport targets must exist in the DOM before pages mount their
   <SharedClientTeleport>, so they can't be v-if'ed away — collapse them with
   CSS instead. :has(*) rather than :empty: Vue Teleport keeps anchor text
   nodes inside the target even when no content is mounted. */
#page-actions-header:not(:has(*)),
#page-breadcrumbs-target:not(:has(*)),
#page-actions-target:not(:has(*)) {
    display: none;
}

/* Vertical rhythm comes from margins on non-empty rows, not the grid's
   row-gap: a uniform row-gap keeps spacing around empty (zero-height) tracks,
   e.g. a page with tabs but no crumbs/actions would get a double gap. */
.page-header > #page-breadcrumbs-target:has(*),
.page-header > #page-actions-target:has(*),
.page-header > .page-header-tabs {
    margin-top: 0.5rem;
}

@media (min-width: 768px) {
    .page-header {
        grid-template-areas:
            'title .'
            'tabs  actions';
    }

    /* Crumb spans the full first row and right-aligns. Placing it with
       grid-column: 1 / -1 (instead of a named single-column area) prevents
       it from contributing to the auto column's minimum size, so the tabs in
       row 2 are constrained only by the actions button, not by the breadcrumb. */
    .page-header > #page-breadcrumbs-target {
        grid-row: 1;
        grid-column: 1 / -1;
        justify-self: end;
        margin-top: 0;
    }
}
</style>
