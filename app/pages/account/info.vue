<template>
    <div class="flex flex-col gap-6">
        <AccountFormFieldSet :title="$t('account.info.personalData')">
            <div class="border-b border-surface-300 pb-6">
                <AccountPersonalDataForm />
            </div>
        </AccountFormFieldSet>

        <div
            class="grid grid-cols-1 gap-6 lg:grid-cols-2 md:border-b md:border-surface-300"
        >
            <AccountFormFieldSet :title="$t('account.info.changeEmail')">
                <div
                    class="border-b border-surface-300 pb-6 md:border-none"
                >
                    <AccountChangeEmailForm />
                </div>
            </AccountFormFieldSet>
            <AccountFormFieldSet :title="$t('account.info.changePhone')">
                <div
                    class="border-b border-surface-300 md:border-none pb-6"
                >
                    <AccountChangePhoneForm />
                </div>
            </AccountFormFieldSet>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2">
            <AccountFormFieldSet :title="$t('account.info.changePassword')">
                <AccountChangePasswordForm />
            </AccountFormFieldSet>
        </div>
    </div>
</template>

<script setup lang="ts"></script>
