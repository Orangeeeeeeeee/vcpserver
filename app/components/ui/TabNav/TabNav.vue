<template>
    <Tabs
        :key="itemsKey"
        v-model:value="value"
        :class="{ 'tabnav--borderless': !props.border }"
    >
        <TabList>
            <Tab
                v-for="item in items"
                :key="item.value ?? item.to"
                :value="item.value ?? item.to"
                :as="item.to ? 'router-link' : undefined"
                :to="item.to"
                class="first:pl-0"
            >
                <span
                    :class="sizeClasses[props.size]"
                    class="inline-flex items-center gap-1.5"
                >
                    {{ item.label }}
                    <Icon
                        v-if="item.trailingIcon"
                        :name="item.trailingIcon"
                        class="size-5"
                    />
                    <Badge
                        v-if="item.badge"
                        :value="item.badge"
                        :severity="item.badgeSeverity ?? 'danger'"
                        class="text-[10px] min-w-[16px] h-[16px]"
                    />
                </span>
            </Tab>
        </TabList>
    </Tabs>
</template>

<script lang="ts">
export interface TabItem {
    /** Tab label text */
    label: string;
    /** Active value; falls back to `to` when omitted */
    value?: string;
    /** Target route — renders the tab as a router-link */
    to?: string;
    /** Optional Iconify icon rendered after the label (e.g. 'tabler:arrow-up-right') */
    trailingIcon?: string;
    /** Optional error count badge rendered after the label */
    badge?: number;
    /** Severity of the badge (default: 'danger') */
    badgeSeverity?: 'danger' | 'warn' | 'info' | 'success' | 'secondary' | 'contrast';
}
</script>

<script setup lang="ts">
interface TabNavProps {
    /** Tabs to render */
    items: TabItem[];
    /** Tabs item size */
    size?: 'sm' | 'md';
    border?: boolean;
}

const sizeClasses = {
    md: 'text-sm md:text-base',
    sm: 'text-sm'
};

const props = withDefaults(defineProps<TabNavProps>(), {
    size: 'md',
    border: true
});
const value = defineModel<string>('value');

/**
 * Identity of the current item set, used as `key` on <Tabs> to force a
 * remount when the set is swapped. PrimeVue repositions the ink bar only on
 * value change or active-tab resize, so swapping items while the active
 * value stays the same would leave the bar at stale coordinates next to the
 * active tab's own border.
 */
const itemsKey = computed<string>(() =>
    props.items.map((item) => item.value ?? item.to).join('|')
);
</script>

<style scoped>
/* Remove the tablist bottom border defined in app/theme/components/tabs.ts.
   Unlayered scoped rule overrides the themed border in @layer primevue. */
.tabnav--borderless :deep(.p-tablist-tab-list) {
    border-bottom-width: 0;
}
</style>
