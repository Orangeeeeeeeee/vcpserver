<template>
    <div class="flex flex-col gap-5 pb-5">
        <!-- «Основне» -->
        <section class="flex flex-col gap-4">
            <h3 class="font-semibold text-surface-900">
                {{ $t('routes.create.general.title') }}
            </h3>

            <SharedAppFormField
                id="routeCompanies"
                name="companies"
                :label="$t('routes.create.general.company')"
                :error="r$.$fields.companies.$errors"
            >
                <UiMultiSelect
                    v-model="state.companies"
                    input-id="routeCompanies"
                    :options="mockCompanies"
                    display="chip"
                    :placeholder="
                        $t('routes.create.general.companyPlaceholder')
                    "
                    :invalid="r$.$fields.companies.$error"
                    fluid
                    show-select-all
                />
            </SharedAppFormField>

            <SharedAppFormField
                id="routeName"
                name="name"
                :label="$t('routes.create.general.name')"
                :error="r$.$fields.name.$errors"
            >
                <InputText
                    id="routeName"
                    v-model="state.name"
                    :placeholder="$t('routes.create.general.namePlaceholder')"
                    :invalid="r$.$fields.name.$error"
                    fluid
                />
            </SharedAppFormField>

            <label class="flex items-center gap-3 text-sm text-surface-900">
                <ToggleSwitch v-model="state.active" />
                {{ $t('routes.create.general.active') }}
            </label>

            <label class="flex items-center gap-3 text-sm text-surface-900">
                <ToggleSwitch v-model="state.scheduled" />
                {{ $t('routes.create.general.scheduled') }}
            </label>

            <SharedAppFormField
                id="routeStartAt"
                name="startAt"
                :label="$t('routes.create.general.startAt')"
                :error="r$.$fields.startAt.$errors"
            >
                <DatePicker
                    v-model="state.startAt"
                    input-id="routeStartAt"
                    show-time
                    hour-format="24"
                    :disabled="!state.scheduled"
                    :placeholder="
                        $t('routes.create.general.startAtPlaceholder')
                    "
                    :invalid="r$.$fields.startAt.$error"
                    fluid
                />
            </SharedAppFormField>

            <SharedAppFormField
                id="routeErrorCount"
                name="errorCount"
                :label="$t('routes.create.general.errorCount')"
            >
                <InputNumber
                    v-model="state.errorCount"
                    input-id="routeErrorCount"
                    :min="0"
                    :use-grouping="false"
                    :placeholder="
                        $t('routes.create.general.errorCountPlaceholder')
                    "
                    fluid
                />
            </SharedAppFormField>
        </section>

        <!-- «Перевезення пасажирів» -->
        <section
            class="flex flex-col gap-4 border-t border-surface-300 pt-5"
        >
            <h3 class="font-semibold text-surface-900">
                {{ $t('routes.create.passenger.title') }}
            </h3>

            <label class="flex items-center gap-3 text-sm text-surface-900">
                <ToggleSwitch v-model="state.passenger" />
                {{ $t('routes.create.passenger.route') }}
            </label>

            <template v-if="state.passenger">
                <label
                    class="flex items-center gap-3 text-sm text-surface-900"
                >
                    <ToggleSwitch v-model="state.intercity" />
                    {{ $t('routes.create.passenger.intercity') }}
                </label>

                <label
                    class="flex items-center gap-3 text-sm text-surface-900"
                >
                    <ToggleSwitch v-model="state.reverseCalculation" />
                    {{ $t('routes.create.passenger.reverseCalculation') }}
                </label>
            </template>
        </section>

        <!-- «Пасажирський тариф» -->
        <section
            v-if="state.passenger"
            class="flex flex-col gap-4 border-t border-surface-300 pt-5"
        >
            <h3 class="font-semibold text-surface-900">
                {{ $t('routes.create.tariff.title') }}
            </h3>

            <RoutesRouteTariffSection
                @go-to-points="emit('goToPoints')"
            />
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRouteFormContext } from '~/composables/useRouteForm';
import { mockCompanies } from '~/mocks/companies';

/** «Основне» tab: route basics, passenger toggles and the tariff section. */

const emit = defineEmits<{
    /** The tariff placeholder asked to jump to the «Точки маршруту» tab */
    goToPoints: [];
}>();

const { state, r$ } = useRouteFormContext();
</script>
