<template>
    <div class="min-h-dvh">
        <SidebarNav />

        <main
            class="min-h-dvh transition-[margin] duration-200"
            :class="[
                isRight
                    ? 'md:mr-[var(--sidebar-collapsed-width)] lg:mr-[var(--sidebar-width)]'
                    : 'md:ml-[var(--sidebar-collapsed-width)] lg:ml-[var(--sidebar-width)]',
                {
                    'lg:!mr-[var(--sidebar-collapsed-width)]':
                        isCollapsed && isRight,
                    'lg:!ml-[var(--sidebar-collapsed-width)]':
                        isCollapsed && !isRight
                }
            ]"
        >
            <slot />
        </main>

        <SharedAppToast />
    </div>
</template>

<script setup lang="ts">
const { isCollapsed, isRight } = useSidebar();
</script>
