<template>
    <div class="flex flex-col gap-5">
        <SharedAppFormField
            id="grpName"
            name="name"
            :label="$t('objects.groups.modal.name')"
            :error="r$.$fields.name.$errors[0]"
        >
            <InputText
                id="grpName"
                v-model="state.name"
                :placeholder="$t('objects.groups.modal.namePlaceholder')"
                :invalid="r$.$fields.name.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="grpCompany"
            name="company"
            :label="$t('objects.groups.modal.company')"
            :error="r$.$fields.company.$errors[0]"
        >
            <Select
                id="grpCompany"
                v-model="state.company"
                :options="companies"
                :placeholder="$t('objects.groups.modal.companyPlaceholder')"
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
            id="grpStatus"
            name="status"
            :label="$t('objects.groups.modal.status')"
            :error="r$.$fields.status.$errors[0]"
        >
            <Select
                id="grpStatus"
                v-model="state.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                :placeholder="$t('objects.groups.modal.statusPlaceholder')"
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
            id="grpOrder"
            name="order"
            :label="$t('objects.groups.modal.order')"
            :error="r$.$fields.order.$errors[0]"
        >
            <InputNumber
                id="grpOrder"
                v-model="state.order"
                :min="1"
                :use-grouping="false"
                :placeholder="$t('objects.groups.modal.orderPlaceholder')"
                :invalid="r$.$fields.order.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="grpComment"
            name="comment"
            :label="$t('objects.groups.modal.comment')"
        >
            <Textarea
                id="grpComment"
                v-model="state.comment"
                rows="3"
                auto-resize
                :placeholder="$t('objects.groups.modal.commentPlaceholder')"
                fluid
            />
        </SharedAppFormField>

        <div class="flex flex-col gap-1.5">
            <span class="text-sm font-normal text-surface-700">
                {{ $t('objects.groups.modal.color') }}
            </span>
            <div role="radiogroup" class="flex items-center gap-3">
                <button
                    v-for="color in colors"
                    :key="color"
                    type="button"
                    role="radio"
                    :aria-checked="state.color === color"
                    :aria-label="color"
                    class="size-6 cursor-pointer rounded-full transition-shadow"
                    :class="
                        state.color === color
                            ? 'ring-2 ring-offset-2 ring-surface-400'
                            : ''
                    "
                    :style="{ backgroundColor: primitiveColors[color]['500'] }"
                    @click="state.color = color"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GroupStatus } from '~/types/group';
import { useGroupFormContext } from '~/composables/useGroupForm';
import { primitiveColors } from '~/theme/colors';

const { state, r$, companies, colors, statusOptions } = useGroupFormContext();

/** Resolves the localized label for a selected status value */
const statusLabelOf = (value: GroupStatus): string =>
    statusOptions.value.find((o) => o.value === value)?.label ?? value;
</script>
