<template>
    <!-- Desktop / Tablet -->
    <aside
        class="hidden md:flex fixed inset-y-0 z-40 flex-col bg-[var(--p-surface-950)] transition-all duration-200 w-[var(--sidebar-width)]"
        :class="[
            isRight ? 'right-0' : 'left-0',
            { '!w-[var(--sidebar-collapsed-width)]': isCollapsed }
        ]"
    >
        <SidebarToggleButton
            mode="toggle"
            :collapsed="isCollapsed"
            :is-right="isRight"
            @click="toggleCollapse"
        />
        <SidebarContent :collapsed="isCollapsed" />
    </aside>

    <!-- Mobile -->
    <Drawer
        v-model:visible="isMobileOpen"
        class="md:!hidden !w-full"
        :modal="true"
        :position="isRight ? 'right' : 'left'"
        :pt="{
            root: { style: 'border: none' }
        }"
    >
        <template #container>
            <div class="flex flex-col h-full bg-[var(--p-surface-950)]">
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
const { isCollapsed, isMobileOpen, isRight, toggleCollapse, closeMobile } =
    useSidebar();

watch(
    () => route.path,
    () => {
        closeMobile();
    }
);
</script>
