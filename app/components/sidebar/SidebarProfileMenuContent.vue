<template>
    <div class="flex flex-col">
        <!-- User header -->
        <div class="flex items-center gap-3 pb-3">
            <Avatar :label="initials" shape="circle" />
            <div class="min-w-0 flex flex-col gap-0.5">
                <p class="text-sm text-surface-900 truncate">
                    {{ profile.firstName }} {{ profile.lastName }}
                </p>
                <p class="text-xs text-surface-600 truncate">
                    {{ subtitle }}
                </p>
            </div>
        </div>

        <div
            class="flex flex-col gap-1 pb-3 pt-2 mb-2 border-t border-surface-200 border-b"
        >
            <button
                type="button"
                class="flex items-center gap-3 px-3 py-2 text-sm text-surface-800 hover:bg-surface-200 cursor-pointer text-left rounded-[4px]"
                @click="emit('action', ROUTES.ACCOUNT_INFO)"
            >
                <Icon name="tabler:user" class="size-5" />
                <span>{{ $t('account.menu.editPersonalData') }}</span>
            </button>

            <button
                type="button"
                class="flex items-center gap-3 px-3 py-2 text-sm text-surface-800 hover:bg-surface-200 cursor-pointer text-left rounded-[4px]"
                @click="emit('action', ROUTES.ACCOUNT_SETTINGS)"
            >
                <Icon name="tabler:settings" class="size-5" />
                <span>{{ $t('account.menu.settings') }}</span>
            </button>
        </div>

        <button
            type="button"
            class="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-surface-200 cursor-pointer text-left rounded-[4px]"
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
