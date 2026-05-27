<template>
    <div>
        <!-- TODO: «Онлайн» content -->
        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:bus', to: ROUTES.OBJECTS_ONLINE },
                    { label: $t('objects.tabs.online') }
                ]"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
</script>
