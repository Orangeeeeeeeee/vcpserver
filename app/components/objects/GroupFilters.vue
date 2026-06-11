<template>
    <div>
        <UiFilterButton
            :label="$t('common.filter')"
            :badge="activeCount"
            :expanded="isOpen"
            @click="toggle"
        />

        <Popover
            ref="popoverRef"
            @show="isOpen = true"
            @hide="isOpen = false"
        >
            <div class="flex w-80 flex-col gap-4">
                <!-- Company -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.groups.filters.company') }}
                    </span>
                    <MultiSelect
                        v-model="state.companies"
                        :options="companies"
                        display="chip"
                        :placeholder="
                            $t('objects.groups.filters.companyPlaceholder')
                        "
                        fluid
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </MultiSelect>
                </div>

                <!-- Status -->
                <div class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-surface-900">
                        {{ $t('objects.groups.filters.status') }}
                    </span>
                    <MultiSelect
                        v-model="state.statuses"
                        :options="statusOptions"
                        option-label="label"
                        option-value="value"
                        display="chip"
                        :placeholder="
                            $t('objects.groups.filters.statusPlaceholder')
                        "
                        fluid
                    >
                        <template #chipicon="{ removeCallback }">
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click="removeCallback"
                            />
                        </template>
                    </MultiSelect>
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover';
import { useGroupFiltersContext } from '~/composables/useGroupFilters';

const { state, companies, statusOptions, activeCount } =
    useGroupFiltersContext();

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

/** Whether the filter popover is currently open (drives the active button styles) */
const isOpen = ref<boolean>(false);

const toggle = (event: MouseEvent): void => {
    popoverRef.value?.toggle(event);
};
</script>
