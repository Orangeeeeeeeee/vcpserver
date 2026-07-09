<template>
    <div
        class="flex h-full flex-col lg:rounded-[10px] lg:border lg:border-surface-300"
    >
        <!-- Tab strip + mobile map toggle -->
        <div class="flex items-center justify-between gap-2 px-4 pt-2">
            <UiTabNav
                v-model:value="activeTab"
                :items="tabItems"
                size="sm"
                border
                class="min-w-0 flex-1"
            />
            <UiMapAction
                class="shrink-0 lg:hidden"
                icon="tabler:map"
                :aria-label="$t('routes.create.map.showMap')"
                @click="emit('showMap')"
            />
        </div>

        <!-- Scrollable body; v-show keeps every tab mounted so regle errors
             stay live across tabs -->
        <div class="min-h-0 flex-1 px-4 pt-4">
            <UiScrollPanel class="h-full">
                <RoutesRouteFormGeneralTab
                    v-show="activeTab === 'general'"
                    @go-to-points="activeTab = 'points'"
                />
                <RoutesRouteFormPointsTab
                    v-show="activeTab === 'points'"
                    @request-map="emit('showMap')"
                />
                <RoutesRouteFormAssignTab v-show="activeTab === 'assignment'" />
            </UiScrollPanel>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 border-t border-surface-300 p-4">
            <Button
                type="button"
                severity="secondary"
                outlined
                class="flex-1"
                :label="$t('routes.create.cancel')"
                @click="emit('cancel')"
            />
            <Button
                type="button"
                class="flex-1"
                :label="$t('routes.create.submit')"
                :disabled="!canSubmit"
                @click="onSubmit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouteFormContext } from '~/composables/useRouteForm';
import type { RouteFormTabKey } from '~/composables/useRouteForm';
import type { Route } from '~/types/route';
import type { TabItem } from '~/components/ui/TabNav/TabNav.vue';

/** The route form panel: tab strip, tab bodies and the footer actions. */

const emit = defineEmits<{
    /** Requests switching to the map view (below lg) */
    showMap: [];
    /** Requests cancelling the route form */
    cancel: [];
    /** Fired with the created route after a successful submit */
    saved: [route: Route];
}>();

const { t } = useI18n();
const { canSubmit, firstInvalidTab, submit } = useRouteFormContext();

const activeTab = ref<RouteFormTabKey>('general');

/** Tab definitions of the form panel */
const tabItems = computed<TabItem[]>(() => [
    { value: 'general', label: t('routes.create.tabs.general') },
    { value: 'points', label: t('routes.create.tabs.points') },
    { value: 'assignment', label: t('routes.create.tabs.assignment') }
]);

/** Validates and submits; jumps to the first invalid tab on failure */
const onSubmit = async (): Promise<void> => {
    const route = await submit();
    if (!route) {
        activeTab.value = firstInvalidTab();
        return;
    }
    emit('saved', route);
};
</script>
