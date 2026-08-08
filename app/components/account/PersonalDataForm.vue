<template>
    <div class="flex items-center gap-4 mb-5 md:mb-6">
        <div class="relative shrink-0">
            <Avatar
                :image="profile.avatarUrl"
                :label="profile.avatarUrl ? undefined : initials"
                size="xlarge"
                shape="circle"
            />
            <FileUpload
                mode="basic"
                accept="image/*"
                class="absolute bottom-0 right-0"
                :auto="true"
                :custom-upload="true"
                :choose-button-props="{
                    rounded: true,
                    size: 'small',
                    label: '',
                    'aria-label': $t('account.info.changePhoto')
                }"
                @uploader="onAvatarUploader"
            >
                <template #chooseicon>
                    <Icon name="tabler:camera" class="size-4 shrink-0" />
                </template>
            </FileUpload>
        </div>
        <div class="flex min-w-0 flex-col gap-2">
            <p class="md:truncate text-sm font-semibold text-surface-950" :title="profile.email">
                {{ profile.email }}
            </p>
            <p class="md:truncate text-sm text-surface-800" :title="profile.phone">
                {{ profile.phone }}
            </p>
        </div>
    </div>

    <form
        class="grid grid-cols-1 gap-x-4 gap-y-5 lg:grid-cols-2"
        novalidate
        @submit.prevent="onSubmit"
    >
        <SharedAppFormField
            id="firstName"
            name="firstName"
            :label="$t('account.info.firstName')"
            :error="r$.$fields.firstName.$errors"
        >
            <InputText
                id="firstName"
                v-model="state.firstName"
                :placeholder="$t('account.info.firstNamePlaceholder')"
                :invalid="r$.$fields.firstName.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="lastName"
            name="lastName"
            :label="$t('account.info.lastName')"
            :error="r$.$fields.lastName.$errors"
        >
            <InputText
                id="lastName"
                v-model="state.lastName"
                :placeholder="$t('account.info.lastNamePlaceholder')"
                :invalid="r$.$fields.lastName.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="affiliations"
            name="affiliations"
            :label="$t('account.info.affiliation')"
            :error="r$.$fields.affiliations.$errors"
        >
            <UiMultiSelect
                id="affiliations"
                v-model="state.affiliations"
                :options="affiliationOptions"
                display="chip"
                :placeholder="$t('account.info.affiliationPlaceholder')"
                :invalid="r$.$fields.affiliations.$invalid"
                fluid
                show-select-all
            >
                <template #chipicon="{ removeCallback }">
                    <Icon
                        name="tabler:x"
                        class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                        @click="removeCallback"
                    />
                </template>
            </UiMultiSelect>
        </SharedAppFormField>

        <div class="flex items-end gap-3">
            <Button
                type="button"
                size="small"
                severity="secondary"
                class="w-full md:w-auto"
                :label="$t('common.cancel')"
                @click="onCancel"
            />
            <Button
                size="small"
                type="submit"
                :label="$t('common.saveChanges')"
                :disabled="isSubmitDisabled"
                class="w-full md:w-auto"
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core';
import { withMessage, required } from '@regle/rules';
import { useToast } from 'primevue/usetoast';

interface PersonalDataFormState {
    firstName: string;
    lastName: string;
    affiliations: string[];
}

const { t } = useI18n();
const toast = useToast();
const { profile, affiliationOptions, initials, setAvatarFromFile } =
    useAccountProfile();
console.log(profile.value);
/** Stores the chosen avatar image in the profile */
const onAvatarUploader = ({ files }: { files: File[] }): void => {
    const [file] = files;
    if (!file) return;
    setAvatarFromFile(file);
};

const state = reactive<PersonalDataFormState>({
    firstName: profile.value.firstName,
    lastName: profile.value.lastName,
    affiliations: [...profile.value.affiliations]
});

const { r$ } = useRegle(
    state,
    {
        firstName: { required: withMessage(required, 'validation.required') },
        lastName: { required: withMessage(required, 'validation.required') },
        affiliations: { required: withMessage(required, 'validation.required') }
    },
    { lazy: true }
);

/** Whether the submit button should be disabled */
const isSubmitDisabled = computed((): boolean => r$.$invalid || r$.$pending);

/** Resets the form back to the currently stored profile values */
const onCancel = (): void => {
    state.firstName = profile.value.firstName;
    state.lastName = profile.value.lastName;
    state.affiliations = [...profile.value.affiliations];
};

/** Validates and saves personal data to the shared profile */
const onSubmit = async (): Promise<void> => {
    const { valid } = await r$.$validate();
    if (valid) {
        profile.value = {
            ...profile.value,
            firstName: state.firstName,
            lastName: state.lastName,
            affiliations: [...state.affiliations]
        };
        toast.add({
            severity: 'success',
            summary: t('common.saved'),
            life: 3000
        });
    }
};
</script>
