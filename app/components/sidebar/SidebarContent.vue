<template>
    <SidebarHeader :collapsed="collapsed" />
    <nav
        class="flex-1 flex flex-col overflow-y-auto py-2 px-4 gap-1 md:py-5 md:px-3"
    >
        <SidebarNavItem
            v-for="item in navigationItems"
            :key="item.key"
            :icon="item.icon"
            :label="$t(`sidebar.${item.key}`)"
            :to="item.route"
            :active="isActive(item)"
            :collapsed="collapsed"
        />
    </nav>
    <SidebarFooter :collapsed="collapsed" />
</template>

<script setup lang="ts">
import {
    navigationItems,
    type NavigationItem
} from '~/constants/navigation';

interface SidebarContentProps {
    /** Whether the sidebar is collapsed */
    collapsed: boolean;
}

defineProps<SidebarContentProps>();

const route = useRoute();

/**
 * Checks whether a navigation item is currently active.
 * @param {NavigationItem} item - Navigation item to check
 * @returns {boolean} True if the route matches or is a child of the item's path or one of its extra prefixes
 */
const isActive = (item: NavigationItem): boolean =>
    [item.route, ...(item.activePrefixes ?? [])].some(
        (prefix) => route.path === prefix || route.path.startsWith(prefix + '/')
    );
</script>
