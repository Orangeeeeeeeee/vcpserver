<template>
    <Form :resolver="resolver" class="flex flex-col gap-5" novalidate @submit="onSubmit">
        <SharedAppFormField id="email" name="email" :label="$t('common.email')">
            <InputText
                id="email"
                v-model="email"
                type="email"
                :placeholder="$t('common.emailPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <div class="flex gap-3">
            <Button
                type="button"
                :label="$t('common.back')"
                severity="secondary"
                class="flex-1"
                @click="navigateBack"
            />
            <Button
                type="submit"
                :label="$t('forgotPassword.submit')"
                class="flex-1"
                :disabled="isSubmitDisabled"
            />
        </div>
    </Form>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

const email = ref('');
const isSubmitDisabled = computed(() => !email.value);
const router = useRouter();

const resolver = zodResolver(
    z.object({
        email: emailSchema(),
    })
);

const navigateBack = () => {
    router.push(ROUTES.LOGIN);
};

const emit = defineEmits<{
    submitted: [email: string];
}>();

const onSubmit = (e: FormSubmitEvent) => {
    if (e.valid) {
        emit('submitted', e.values.email);
    }
};
</script>
