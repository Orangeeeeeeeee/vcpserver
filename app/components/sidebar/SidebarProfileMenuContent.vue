<template>
    <div class="flex flex-col md:p-2">
        <!-- User header -->
        <div class="flex items-center gap-3 py-4">
            <Avatar :label="initials" shape="circle" />
            <div class="min-w-0 flex flex-col gap-0.5">
                <p
                    class="text-sm font-semibold text-[var(--p-surface-900)] truncate"
                >
                    {{ profile.firstName }} {{ profile.lastName }}
                </p>
                <p class="text-xs text-[var(--p-surface-600)] truncate">
                    {{ subtitle }}
                </p>
            </div>
        </div>

        <div
            class="flex flex-col gap-1 pb-3 pt-3 mb-3 border-t border-[var(--p-surface-200)] border-b"
        >
            <button
                type="button"
                class="flex items-center gap-3 p-3 text-sm text-[var(--p-surface-800)] hover:bg-[var(--p-surface-200)] cursor-pointer text-left rounded-[4px]"
                @click="emit('action', ROUTES.ACCOUNT_INFO)"
            >
                <Icon name="tabler:user" class="size-5" />
                <span>{{ $t('account.menu.editPersonalData') }}</span>
            </button>

            <button
                type="button"
                class="flex items-center gap-3 p-3 text-sm text-[var(--p-surface-800)] hover:bg-[var(--p-surface-200)] cursor-pointer text-left rounded-[4px]"
                @click="emit('action', ROUTES.ACCOUNT_SETTINGS)"
            >
                <Icon name="tabler:settings" class="size-5" />
                <span>{{ $t('account.menu.settings') }}</span>
            </button>
        </div>

        <button
            type="button"
            class="flex items-center gap-3 px-4 py-3 text-sm text-[var(--p-red-600)] hover:bg-[var(--p-surface-200)] cursor-pointer text-left rounded-[4px]"
            @click="emit('action', ROUTES.LOGIN)"
        >
            <Icon name="tabler:logout" class="size-5" />
            <span>{{ $t('account.menu.signOut') }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';

interface SidebarProfileMenuContentEmits {
    (e: 'action', to: string): void;
}

const emit = defineEmits<SidebarProfileMenuContentEmits>();
const { t } = useI18n();
const { profile, initials } = useAccountProfile();

/** Subtitle — affiliation + role */
const subtitle = computed((): string => {
    const org = profile.value.affiliations[0] ?? '';
    return org ? `${org} • ${t('account.role')}` : t('account.role');
});
</script>
