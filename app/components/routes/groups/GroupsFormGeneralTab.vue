<template>
    <div class="flex flex-col gap-5">
        <SharedAppFormField
            id="rtGrpName"
            name="name"
            :label="$t('routes.groups.modal.name')"
            :error="r$.$fields.name.$errors"
        >
            <InputText
                id="rtGrpName"
                v-model="state.name"
                :placeholder="$t('routes.groups.modal.namePlaceholder')"
                :invalid="r$.$fields.name.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="rtGrpCompany"
            name="company"
            :label="$t('routes.groups.modal.company')"
            :error="r$.$fields.company.$errors"
        >
            <Select
                id="rtGrpCompany"
                v-model="state.company"
                :options="companies"
                :placeholder="$t('routes.groups.modal.companyPlaceholder')"
                :invalid="r$.$fields.company.$invalid"
                :pt="{ label: { class: 'flex items-center py-1' } }"
                fluid
            >
                <template #value="{ value, placeholder }">
                    <Chip v-if="value" :label="value" removable>
                        <template #removeicon>
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click.stop="state.company = null"
                            />
                        </template>
                    </Chip>
                    <span v-else>{{ placeholder }}</span>
                </template>
            </Select>
        </SharedAppFormField>

        <SharedAppFormField
            id="rtGrpStatus"
            name="status"
            :label="$t('routes.groups.modal.status')"
            :error="r$.$fields.status.$errors"
        >
            <Select
                id="rtGrpStatus"
                v-model="state.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                :placeholder="$t('routes.groups.modal.statusPlaceholder')"
                :invalid="r$.$fields.status.$invalid"
                :pt="{ label: { class: 'flex items-center py-1' } }"
                fluid
            >
                <template #value="{ value, placeholder }">
                    <Chip
                        v-if="value"
                        :label="statusLabelOf(value)"
                        removable
                    >
                        <template #removeicon>
                            <Icon
                                name="tabler:x"
                                class="size-4 cursor-pointer text-surface-700 transition-colors hover:text-surface-900"
                                @click.stop="state.status = null"
                            />
                        </template>
                    </Chip>
                    <span v-else>{{ placeholder }}</span>
                </template>
            </Select>
        </SharedAppFormField>

        <SharedAppFormField
            id="rtGrpOrder"
            name="order"
            :label="$t('routes.groups.modal.order')"
            :error="r$.$fields.order.$errors"
        >
            <InputNumber
                id="rtGrpOrder"
                v-model="state.order"
                :min="1"
                :use-grouping="false"
                :placeholder="$t('routes.groups.modal.orderPlaceholder')"
                :invalid="r$.$fields.order.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="rtGrpComment"
            name="comment"
            :label="$t('routes.groups.modal.comment')"
        >
            <Textarea
                id="rtGrpComment"
                v-model="state.comment"
                rows="3"
                auto-resize
                :placeholder="$t('routes.groups.modal.commentPlaceholder')"
                fluid
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import type { RouteGroupStatus } from '~/types/route-group';
import { useRouteGroupFormContext } from '~/composables/useRouteGroupForm';

const { state, r$, companies, statusOptions } = useRouteGroupFormContext();

/** Resolves the localized label for a selected status value */
const statusLabelOf = (value: RouteGroupStatus): string =>
    statusOptions.value.find((o) => o.value === value)?.label ?? value;
</script>
