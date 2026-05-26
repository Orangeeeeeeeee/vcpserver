<template>
    <form class="flex flex-col gap-5" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
                class="border-b border-[var(--p-surface-300)] pb-6 md:border-none"
            >
                <AccountNotificationContactList
                    v-model="state.emails"
                    :label="$t('common.email')"
                    :add-placeholder="
                        $t('account.settings.emailAddPlaceholder')
                    "
                    input-type="email"
                    validator="email"
                />
            </div>
            <AccountNotificationContactList
                v-model="state.phones"
                :label="$t('account.settings.phoneLabel')"
                :add-placeholder="$t('account.settings.phoneAddPlaceholder')"
                input-type="tel"
                validator="phone"
            />
        </div>

        <div class="flex gap-3">
            <Button
                type="button"
                severity="secondary"
                class="w-full md:w-auto"
                :label="$t('account.settings.cancel')"
                @click="onCancel"
            />
            <Button
                type="submit"
                class="w-full md:w-auto"
                :label="$t('account.settings.save')"
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { NotificationContact } from '~/composables/useAccountSettings';

interface PushNotificationsFormState {
    emails: NotificationContact[];
    phones: NotificationContact[];
}

const { t } = useI18n();
const toast = useToast();
const { settings } = useAccountSettings();

const state = reactive<PushNotificationsFormState>({
    emails: settings.value.notificationEmails.map((c) => ({ ...c })),
    phones: settings.value.notificationPhones.map((c) => ({ ...c }))
});

/** Resets the lists back to the currently stored contacts */
const onCancel = (): void => {
    state.emails = settings.value.notificationEmails.map((c) => ({ ...c }));
    state.phones = settings.value.notificationPhones.map((c) => ({ ...c }));
};

/** Persists notification lists to the shared settings and shows a success toast */
const onSubmit = (): void => {
    settings.value = {
        ...settings.value,
        notificationEmails: state.emails.map((c) => ({ ...c })),
        notificationPhones: state.phones.map((c) => ({ ...c }))
    };
    toast.add({
        severity: 'success',
        summary: t('account.settings.saved'),
        life: 3000
    });
};
</script>
