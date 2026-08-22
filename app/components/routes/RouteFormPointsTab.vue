<template>
    <div class="flex flex-col pb-4">
        <!-- Header + JSON import -->
        <div class="flex items-center justify-between gap-2 p-4">
            <h3 class="font-semibold text-surface-900">
                {{ $t('routes.create.points.title') }}
            </h3>
            <div class="shrink-0 flex items-center gap-1.5 text-surface-800 text-sm font-medium cursor-pointer" @click="fileInput?.click()">
                <Icon name="tabler:upload" class="size-5 text-surface-700" />
                {{ $t('routes.create.points.importJson') }}
            </div>
            <input
                ref="fileInput"
                type="file"
                accept=".json,application/json"
                class="hidden"
                @change="onImportFile"
            />
        </div>

        <template v-for="(point, index) in points" :key="point.id">
            <div class="px-4">
                <RoutesRoutePointCard
                    :index="index"
                    @pick-on-map="emit('requestMap')"
                />
            </div>
            <div v-if="index < points.length - 1" class="p-4">
                <!-- Insert slot between every pair of consecutive points -->
                <button
                    type="button"
                    class="bg-dashed-border bg-transparent flex w-full items-center gap-2 py-2.5 text-sm text-surface-900 transition-colors hover:text-primary-600"
                    @click="addIntermediate(index)"
                >
                    <Icon name="tabler:plus" class="size-4 " />
                    {{ $t('routes.create.points.addIntermediate') }}
                </button>
            </div>
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

<style scoped>
    .bg-dashed-border {
        background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='1' x2='100%25' y2='1' stroke='%23E0E4E8' stroke-width='1' stroke-dasharray='8, 8'/%3E%3Cline x1='0' y1='100%25' x2='100%25' y2='100%25' stroke='%23E0E4E8' stroke-width='2' stroke-dasharray='8, 8'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
</style>
