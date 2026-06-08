<template>
    <div class="flex flex-col gap-6">
        <AccountFormFieldSet :title="$t('account.settings.general')">
            <div class="border-b border-surface-300 pb-6">
                <AccountGeneralSettingsForm />
            </div>
        </AccountFormFieldSet>

        <AccountFormFieldSet :title="$t('account.settings.pushNotifications')">
            <AccountPushNotificationsForm />
        </AccountFormFieldSet>
    </div>
</template>

<script setup lang="ts"></script>
