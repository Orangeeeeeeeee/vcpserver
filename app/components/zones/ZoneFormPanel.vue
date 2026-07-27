<template>
    <div
        class="flex h-full flex-col lg:rounded-[10px] lg:border lg:border-surface-300"
    >
        <!-- Header -->
        <div class="flex items-center justify-between gap-2 p-4">
            <h2 class="text-lg font-semibold text-surface-900">
                {{ $t(`zones.${mode}.title`) }}
            </h2>
            <UiMapAction
                class="shrink-0 lg:hidden"
                icon="tabler:map"
                :aria-label="$t('zones.create.map.showMap')"
                @click="emit('showMap')"
            />
        </div>

        <!-- Scrollable body -->
        <div class="min-h-0 flex-1 px-4">
            <UiScrollPanel class="h-full">
                <div class="flex flex-col gap-4 pb-5">
                    <SharedAppFormField
                        id="zoneCompany"
                        name="companies"
                        :label="$t('zones.create.fields.company')"
                        :error="r$.$fields.companies.$errors"
                    >
                        <UiMultiSelect
                            v-model="state.companies"
                            input-id="zoneCompany"
                            :options="mockCompanies"
                            display="chip"
                            :placeholder="
                                $t('zones.create.fields.companyPlaceholder')
                            "
                            :invalid="r$.$fields.companies.$error"
                            fluid
                            show-select-all
                        />
                    </SharedAppFormField>

                    <SharedAppFormField
                        id="zoneType"
                        name="types"
                        :label="$t('zones.create.fields.type')"
                        :error="r$.$fields.types.$errors"
                    >
                        <UiMultiSelect
                            v-model="state.types"
                            input-id="zoneType"
                            :options="ZONE_TYPE_OPTIONS"
                            option-value="value"
                            :option-label="(o) => t(o.labelKey)"
                            display="chip"
                            :placeholder="
                                $t('zones.create.fields.typePlaceholder')
                            "
                            :invalid="r$.$fields.types.$error"
                            fluid
                        />
                    </SharedAppFormField>

                    <SharedAppFormField
                        id="zoneName"
                        name="name"
                        :label="$t('zones.create.fields.name')"
                        :error="r$.$fields.name.$errors"
                    >
                        <InputText
                            id="zoneName"
                            v-model="state.name"
                            :placeholder="
                                $t('zones.create.fields.namePlaceholder')
                            "
                            :invalid="r$.$fields.name.$error"
                            fluid
                        />
                    </SharedAppFormField>

                    <SharedAppFormField
                        id="zoneDescription"
                        name="description"
                        :label="$t('zones.create.fields.description')"
                    >
                        <Textarea
                            id="zoneDescription"
                            v-model="state.description"
                            :rows="5"
                            :placeholder="
                                $t('zones.create.fields.descriptionPlaceholder')
                            "
                            fluid
                        />
                    </SharedAppFormField>
                </div>

                <ZonesZoneBindingSection
                    :title="$t('zones.create.groups.title')"
                    :add-more-label="$t('zones.create.groups.addMore')"
                    :add-row-label="$t('zones.create.groups.addRow')"
                    :options="groupOptions"
                    :placeholder="$t('zones.create.groups.placeholder')"
                    :rows="groupRows"
                    @add="addGroupRow"
                    @remove="removeGroupRow"
                />

                <ZonesZoneBindingSection
                    :title="$t('zones.create.vehicles.title')"
                    :add-more-label="$t('zones.create.vehicles.addMore')"
                    :add-row-label="$t('zones.create.vehicles.addRow')"
                    :options="vehicleOptions"
                    :placeholder="$t('zones.create.vehicles.placeholder')"
                    :rows="vehicleRows"
                    @add="addVehicleRow"
                    @remove="removeVehicleRow"
                />
            </UiScrollPanel>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 border-t border-surface-300 p-4">
            <Button
                type="button"
                severity="secondary"
                outlined
                class="flex-1"
                :label="$t('zones.create.cancel')"
                @click="emit('cancel')"
            />
            <Button
                type="button"
                class="flex-1"
                :label="$t(`zones.${mode}.submit`)"
                :disabled="!canSubmit"
                @click="onSubmit"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useZoneFormContext } from '~/composables/useZoneForm';
import { ZONE_TYPE_OPTIONS } from '~/constants/zones';
import { mockCompanies } from '~/mocks/companies';
import type { Zone } from '~/types/zone';
import type { ZoneBindingOption } from '~/components/zones/ZoneBindingItem.vue';

interface ZoneFormPanelProps {
    /** Drives the panel title and the submit button label */
    mode: 'create' | 'edit';
}

defineProps<ZoneFormPanelProps>();

const emit = defineEmits<{
    /** Requests switching to the map view (below lg) / closing the panel */
    showMap: [];
    /** Requests cancelling the zone form */
    cancel: [];
    /** Fired with the created/updated zone after a successful submit */
    saved: [zone: Zone];
}>();

const { t } = useI18n();

const {
    state,
    groupRows,
    vehicleRows,
    r$,
    addGroupRow,
    addVehicleRow,
    removeGroupRow,
    removeVehicleRow,
    canSubmit,
    submit
} = useZoneFormContext();

const { groups } = useGroups();
const { vehicles } = useVehicles();

/** Group multiselect options (label: group name, value: group id) */
const groupOptions = computed<ZoneBindingOption[]>(() =>
    groups.value.map((group) => ({ label: group.name, value: group.id }))
);

/** Vehicle multiselect options, labelled like «MAN TGX 18.480 (ID: TRK-112)» */
const vehicleOptions = computed<ZoneBindingOption[]>(() =>
    vehicles.value.map((vehicle) => ({
        label: `${vehicle.brand} ${vehicle.model} (ID: ${vehicle.name})`,
        value: vehicle.id
    }))
);

/** Validates and submits the form; notifies the parent on success */
const onSubmit = async (): Promise<void> => {
    const zone = await submit();
    if (zone) {
        emit('saved', zone);
    }
};
</script>
