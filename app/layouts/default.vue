<template>
    <div class="min-h-dvh">
        <button
            class="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-[var(--p-primary-950)] text-white cursor-pointer"
            @click="openMobile">
            <Icon name="tabler:menu-2" class="size-5" />
        </button>

        <SidebarNav />

        <main class="min-h-dvh transition-[margin-left] duration-200 md:ml-[var(--sidebar-width)]"
            :class="{ 'md:!ml-[var(--sidebar-collapsed-width)]': isCollapsed }">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const { isCollapsed, openMobile } = useSidebar();
</script>
