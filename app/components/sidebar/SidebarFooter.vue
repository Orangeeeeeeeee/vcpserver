<template>
    <div
        class="flex justify-between pt-6 pb-8 px-8 md:p-0 items-center md:items-stretch border-t border-t-[var(--p-surface-800)] md:border-none md:flex-col"
    >
        <div class="md:p-3">
            <button
                type="button"
                class="group flex items-center gap-3 md:w-full cursor-pointer text-left"
                :class="
                    collapsed
                        ? 'justify-center'
                        : 'md:px-4 md:py-2 hover:bg-primary-900 rounded-md transition-colors'
                "
                @click="onProfileClick"
            >
                <Avatar
                    :label="initials"
                    shape="circle"
                    class="shrink-0 bg-primary-300"
                />
                <div v-if="!collapsed" class="min-w-0 flex flex-col gap-1">
                    <p
                        class="text-sm font-semibold text-surface-300 group-hover:text-surface-100 truncate"
                    >
                        {{ profile.firstName }} {{ profile.lastName }}
                    </p>
                    <p
                        class="text-xs text-surface-500 group-hover:text-primary-100 truncate"
                    >
                        {{ subtitle }}
                    </p>
                </div>
            </button>
        </div>
        <div
            class="flex items-center md:-order-1 md:items-stretch md:p-3 md:border-b md:border-b-[var(--p-surface-900)] md:justify-center"
            :class="collapsed ? 'flex-col gap-3' : 'gap-4'"
        >
            <button
                class="flex items-center justify-center text-surface-500 hover:text-surface-50 hover:bg-primary-900 rounded-md transition-colors cursor-pointer shrink-0 size-12"
                @click="toggleTheme"
            >
                <Icon :name="themeIcon" class="size-6" />
            </button>
            <button
                class="flex items-center justify-center text-surface-500 hover:text-surface-50 hover:bg-primary-900 transition-colors cursor-pointer shrink-0 size-12 rounded-md"
            >
                <Icon name="tabler:bell" class="size-6" />
            </button>
        </div>

        <SidebarProfileMenu ref="profileMenu" />
    </div>
</template>

<script setup lang="ts">
interface SidebarFooterProps {
    /** Whether the sidebar is collapsed */
    collapsed: boolean;
}

defineProps<SidebarFooterProps>();

const { toggleTheme, themeIcon } = useTheme();
const { t } = useI18n();
const { profile, initials } = useAccountProfile();

const profileMenu = ref<{ open: (event: MouseEvent) => void } | null>(null);

/** Subtitle — affiliation + role */
const subtitle = computed((): string => {
    const org = profile.value.affiliations[0] ?? '';
    return org ? `${org} • ${t('account.role')}` : t('account.role');
});

/** Opens the profile menu (popover on desktop, drawer on mobile) */
const onProfileClick = (event: MouseEvent): void => {
    profileMenu.value?.open(event);
};
</script>
