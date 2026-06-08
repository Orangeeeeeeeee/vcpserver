<template>
    <!-- Desktop popover -->
    <Popover ref="popoverRef" class="hidden md:block">
        <div class="flex flex-col min-w-64">
            <SidebarProfileMenuContent @action="onAction" />
        </div>
    </Popover>

    <!-- Mobile fullscreen drawer -->
    <Drawer v-model:visible="isMobileOpen" position="full" class="md:!hidden">
        <template #header>
            <span class="text-base font-semibold text-surface-900">
                {{ $t('account.title') }}
            </span>
        </template>
        <SidebarProfileMenuContent @action="onAction" />
    </Drawer>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);
const isMobileOpen = ref(false);
const { closeMobile } = useSidebar();

/** Opens the menu — popover on desktop, fullscreen drawer on mobile */
const open = (event: MouseEvent): void => {
    if (window.matchMedia('(min-width: 768px)').matches) {
        popoverRef.value?.toggle(event);
    } else {
        isMobileOpen.value = true;
    }
};

/** Closes both surfaces (and the nav drawer on mobile) then navigates */
const onAction = async (to: string): Promise<void> => {
    popoverRef.value?.hide();
    isMobileOpen.value = false;
    closeMobile();
    await navigateTo(to);
};

defineExpose({ open });
</script>
