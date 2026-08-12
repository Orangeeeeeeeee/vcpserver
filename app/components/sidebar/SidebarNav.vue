<template>
    <!-- Tablet-only backdrop shown while the sidebar overlays content (md..lg, expanded) -->
    <div
        class="fixed inset-0 z-[1050] hidden bg-surface-950/40 backdrop-blur-xs transition-opacity duration-200 motion-reduce:transition-none md:max-lg:block"
        :class="isAsideCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100'"
        aria-hidden="true"
        @click="closeTabletExpanded"
    />

    <!-- Desktop / Tablet -->
    <aside
        class="hidden md:flex fixed inset-y-0 z-40 md:max-lg:z-[1060] flex-col bg-surface-950 transition-all duration-200 w-[var(--sidebar-width)]"
        :class="[
            isRight ? 'right-0' : 'left-0',
            { '!w-[var(--sidebar-collapsed-width)]': isAsideCollapsed }
        ]"
    >
        <SidebarToggleButton
            mode="toggle"
            :collapsed="isAsideCollapsed"
            :is-right="isRight"
            @click="onToggleClick"
        />
        <SidebarContent :collapsed="isAsideCollapsed" />
    </aside>

    <!-- Mobile -->
    <Drawer
        v-model:visible="isMobileOpen"
        class="md:!hidden !w-full"
        :modal="true"
        :block-scroll="true"
        :position="isRight ? 'right' : 'left'"
        :pt="{
            root: { style: 'border: none' }
        }"
    >
        <template #container>
            <div class="flex flex-col h-full bg-surface-950">
                <SidebarToggleButton
                    mode="close"
                    :is-right="isRight"
                    @click="closeMobile"
                />
                <SidebarContent :collapsed="false" />
            </div>
        </template>
    </Drawer>
</template>

<script setup lang="ts">
const route = useRoute();
const {
    isCollapsed,
    isTabletExpanded,
    isMobileOpen,
    isRight,
    toggleCollapse,
    toggleTabletExpanded,
    closeTabletExpanded,
    closeMobile
} = useSidebar();

/** Matches the tablet range (md ≤ width < lg) where the expanded sidebar overlays content */
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023.98px)');

/**
 * Effective collapsed state of the aside: on tablet it follows the
 * session-only overlay state, on desktop — the persisted cookie. The
 * desktop preference is never mutated by breakpoint changes.
 */
const isAsideCollapsed = computed((): boolean =>
    isTablet.value ? !isTabletExpanded.value : isCollapsed.value
);

/** Routes the toggle button to the state matching the current breakpoint */
const onToggleClick = (): void => {
    if (isTablet.value) {
        toggleTabletExpanded();
    } else {
        toggleCollapse();
    }
};

// Reset the overlay when leaving the tablet range so a later return starts collapsed
watch(isTablet, (tablet) => {
    if (!tablet) {
        closeTabletExpanded();
    }
});

watch(
    () => route.path,
    () => {
        closeMobile();
        closeTabletExpanded();
    }
);
</script>
