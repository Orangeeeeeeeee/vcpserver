<template>
    <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
            <span class="text-sm font-normal text-surface-700">
                {{ $t('objects.drivers.modal.avatar') }}
            </span>
            <UiUploadTrigger
                name="avatar"
                @select="onAvatarSelect"
            />
        </div>

        <div class="grid grid-cols-2 gap-4">
            <SharedAppFormField
                id="drvFirstName"
                name="firstName"
                :label="$t('objects.drivers.modal.firstName')"
                :error="r$.$fields.firstName.$errors"
            >
                <InputText
                    id="drvFirstName"
                    v-model="state.firstName"
                    :placeholder="
                        $t('objects.drivers.modal.firstNamePlaceholder')
                    "
                    :invalid="r$.$fields.firstName.$invalid"
                    fluid
                />
            </SharedAppFormField>

            <SharedAppFormField
                id="drvLastName"
                name="lastName"
                :label="$t('objects.drivers.modal.lastName')"
                :error="r$.$fields.lastName.$errors"
            >
                <InputText
                    id="drvLastName"
                    v-model="state.lastName"
                    :placeholder="
                        $t('objects.drivers.modal.lastNamePlaceholder')
                    "
                    :invalid="r$.$fields.lastName.$invalid"
                    fluid
                />
            </SharedAppFormField>
        </div>

        <SharedAppFormField
            id="drvStatus"
            name="status"
            :label="$t('objects.drivers.modal.status')"
            :error="r$.$fields.status.$errors"
        >
            <Select
                id="drvStatus"
                v-model="state.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                :placeholder="$t('objects.drivers.modal.statusPlaceholder')"
                :invalid="r$.$fields.status.$invalid"
                fluid
            />
        </SharedAppFormField>

        <SharedAppFormField
            id="drvVehicle"
            name="vehicle"
            :label="$t('objects.drivers.modal.vehicle')"
            :error="r$.$fields.transportId.$errors"
        >
            <Select
                id="drvVehicle"
                v-model="state.transportId"
                :options="vehicleOptions"
                option-label="label"
                option-value="value"
                filter
                :placeholder="$t('objects.drivers.modal.vehiclePlaceholder')"
                :invalid="r$.$fields.transportId.$invalid"
                fluid
            />
        </SharedAppFormField>

        <div class="grid grid-cols-2 gap-4">
            <SharedAppFormField
                id="drvStartedAt"
                name="startedAt"
                :label="$t('objects.drivers.modal.startedAt')"
                :error="r$.$fields.startedAt.$errors"
            >
                <DatePicker
                    id="drvStartedAt"
                    v-model="state.startedAt"
                    date-format="dd.mm.yy"
                    show-icon
                    icon-display="input"
                    :placeholder="
                        $t('objects.drivers.modal.startedAtPlaceholder')
                    "
                    :invalid="r$.$fields.startedAt.$invalid"
                    fluid
                />
            </SharedAppFormField>

            <SharedAppFormField
                id="drvEmployment"
                name="employment"
                :label="$t('objects.drivers.modal.employment')"
                :error="r$.$fields.employment.$errors"
            >
                <Select
                    id="drvEmployment"
                    v-model="state.employment"
                    :options="employmentTypes"
                    :placeholder="
                        $t('objects.drivers.modal.employmentPlaceholder')
                    "
                    :invalid="r$.$fields.employment.$invalid"
                    fluid
                />
            </SharedAppFormField>
        </div>

        <SharedAppFormField
            id="drvComment"
            name="comment"
            :label="$t('objects.drivers.modal.comment')"
        >
            <Textarea
                id="drvComment"
                v-model="state.comment"
                rows="3"
                auto-resize
                :placeholder="$t('objects.drivers.modal.commentPlaceholder')"
                fluid
            />
        </SharedAppFormField>
    </div>
</template>

<script setup lang="ts">
import { useDriverFormContext } from '~/composables/useDriverForm';

const { state, r$, statusOptions, vehicleOptions, employmentTypes, onAvatarSelect } =
    useDriverFormContext();
</script>
