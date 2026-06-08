<template>
    <Tabs
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
                <span :class="sizeClasses[props.size]">{{ item.label }}</span>
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
</script>

<style scoped>
/* Remove the tablist bottom border defined in app/theme/components/tabs.ts.
   Unlayered scoped rule overrides the themed border in @layer primevue. */
.tabnav--borderless :deep(.p-tablist-tab-list) {
    border-bottom-width: 0;
}
</style>
