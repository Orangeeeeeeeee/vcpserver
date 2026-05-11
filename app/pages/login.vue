<template>
    <SharedAuthLayout
        :title="$t('login.title')"
        :subtitle="[$t('login.subtitle1'), $t('login.subtitle2')]"
    >
        <SharedLoginForm />
    </SharedAuthLayout>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank'
});
</script>
