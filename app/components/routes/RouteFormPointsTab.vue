<template>
    <div class="flex flex-col gap-4 pb-5">
        <!-- Header + JSON import -->
        <div class="flex items-center justify-between gap-2">
            <h3 class="font-semibold text-surface-900">
                {{ $t('routes.create.points.title') }}
            </h3>
            <Button
                type="button"
                text
                severity="secondary"
                class="shrink-0"
                @click="fileInput?.click()"
            >
                <Icon name="tabler:upload" class="size-5" />
                {{ $t('routes.create.points.importJson') }}
            </Button>
            <input
                ref="fileInput"
                type="file"
                accept=".json,application/json"
                class="hidden"
                @change="onImportFile"
            />
        </div>

        <template v-for="(point, index) in points" :key="point.id">
            <RoutesRoutePointCard
                :index="index"
                @pick-on-map="emit('requestMap')"
            />

            <!-- Insert slot between every pair of consecutive points -->
            <button
                v-if="index < points.length - 1"
                type="button"
                class="flex w-full items-center gap-2 border-y border-dashed border-surface-300 py-2.5 text-sm text-surface-900 transition-colors hover:text-primary-600"
                @click="addIntermediate(index)"
            >
                <Icon name="tabler:plus" class="size-4" />
                {{ $t('routes.create.points.addIntermediate') }}
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { useRouteFormContext } from '~/composables/useRouteForm';

/** «Точки маршруту» tab: the ordered point cards and the JSON import. */

const emit = defineEmits<{
    /** A point asked for the map (pick-on-map on small screens) */
    requestMap: [];
}>();

const { t } = useI18n();
const toast = useToast();
const { points, addIntermediate, importPoints } = useRouteFormContext();

const fileInput = useTemplateRef<HTMLInputElement>('fileInput');

/**
 * Reads the picked JSON file and replaces the route points with its content
 * (see {@link importPoints} for the expected format).
 * @param event Change event of the hidden file input.
 */
const onImportFile = async (event: Event): Promise<void> => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    let imported = false;
    try {
        imported = importPoints(JSON.parse(await file.text()));
    } catch {
        imported = false;
    }

    toast.add({
        severity: imported ? 'success' : 'error',
        summary: t(
            imported
                ? 'routes.create.points.importSuccess'
                : 'routes.create.points.importError'
        ),
        life: 3000
    });
};
</script>
