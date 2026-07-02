<template>
    <div class="h-full grow flex flex-col">
        <SharedPanelMapLayout
            v-model:view="view"
            class="h-[calc(100dvh-230px)] min-h-[28rem] md:h-[calc(100dvh-210px)]"
            panel-class="-m-4"
            map-class="-m-4 lg:ml-0 lg:-mt-5 lg:-mr-6 lg:-mb-5"
        >
            <template #panel>
                <ZonesZoneFormPanel
                    mode="edit"
                    @show-map="view = 'map'"
                    @cancel="onCancel"
                    @saved="onSaved"
                />
            </template>

            <template #map>
                <ZonesMap
                    v-if="hasToken"
                    :color="zone.color"
                    @show-panel="view = 'panel'"
                />
                <SharedTableEmpty
                    v-else
                    icon="tabler:map-pin"
                    :message="$t('objects.online.noToken')"
                />
            </template>
        </SharedPanelMapLayout>

        <Teleport to="#page-breadcrumbs-target">
            <SharedPageBreadcrumb
                :items="[
                    { icon: 'tabler:border-radius', to: ROUTES.ZONES },
                    { label: $t('zones.edit.breadcrumb') }
                ]"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ROUTES } from '~/constants/routes';
import { useZoneForm, ZONE_FORM_KEY } from '~/composables/useZoneForm';
import type { PanelMapLayoutView } from '~/components/shared/PanelMapLayout';
import type { Zone } from '~/types/zone';

definePageMeta({
    layout: 'default'
});

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const { zones } = useZones();

/** Zone being edited, resolved from the route id */
const zone = zones.value.find((z) => z.id === route.params.id);
if (!zone) {
    throw createError({ statusCode: 404 });
}

/** Shared zone form state (prefilled), provided to the panel and the map */
const form = useZoneForm(zone);
provide(ZONE_FORM_KEY, form);

/** Panel visibility switch below lg; the form shows by default */
const view = ref<PanelMapLayoutView>('panel');

/** Map renders only when the Mapbox token is configured */
const hasToken = computed<boolean>(() =>
    Boolean(useRuntimeConfig().public.mapboxToken)
);

/** «Скасувати» returns to the zones list without saving */
const onCancel = (): void => {
    void navigateTo(ROUTES.ZONES);
};

/**
 * Successful submit: notifies the user and returns to the zones list.
 * @param {Zone} updated Updated zone.
 */
const onSaved = (updated: Zone): void => {
    toast.add({
        severity: 'success',
        summary: t('zones.edit.updated'),
        detail: updated.name,
        life: 2000
    });
    void navigateTo(ROUTES.ZONES);
};
</script>
