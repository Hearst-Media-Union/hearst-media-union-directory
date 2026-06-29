<template>
  <BaseModal :is-open="isOpen" labelled-by="admin-member-modal-title" @close="emit('close')">
    <template #header>
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2
            id="admin-member-modal-title"
            class="font-condensed text-2xl font-semibold text-(--color-brand-navy)"
          >
            {{ isEditing ? 'Edit Member' : 'Member Record' }}
          </h2>
          <p class="text-sm text-slate-600">Review this member record before editing.</p>
        </div>

        <button
          type="button"
          class="text-sm font-medium text-slate-600 hover:cursor-pointer hover:text-(--color-brand-navy)"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </template>

    <p v-if="isLoading" class="text-sm text-slate-600">Loading member details…</p>

    <div v-else-if="selectedMember && editableMember" class="space-y-6 text-sm">
      <section class="space-y-3">
        <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">Identity</h3>

        <div class="grid gap-3 md:grid-cols-2">
          <AdminMemberRecordField
            :model-value="editableMember.legalFirstName"
            label="Legal First Name"
            :value="selectedMember.legalFirstName"
            :is-editing="isEditing"
            @update:model-value="updateField('legalFirstName', $event)"
          />

          <AdminMemberRecordField
            :model-value="editableMember.legalLastName"
            label="Legal Last Name"
            :value="selectedMember.legalLastName"
            :is-editing="isEditing"
            @update:model-value="updateField('legalLastName', $event)"
          />

          <AdminMemberRecordField
            :model-value="editableMember.preferredName"
            label="Preferred Name"
            :value="selectedMember.preferredName"
            :is-editing="isEditing"
            @update:model-value="updateField('preferredName', $event)"
          />

          <AdminMemberRecordField
            :model-value="editableMember.employeeNumber"
            label="Employee Number"
            :value="selectedMember.employeeNumber"
            :is-editing="isEditing"
            @update:model-value="updateField('employeeNumber', $event)"
          />

          <AdminMemberRecordField
            :model-value="editableMember.unionId"
            label="Union ID"
            :value="selectedMember.unionId"
            :is-editing="isEditing"
            @update:model-value="updateField('unionId', $event)"
          />
        </div>
      </section>

      <section class="space-y-3 border-t border-(--color-app-border) pt-5">
        <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">Contact</h3>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="space-y-1">
            <AdminMemberRecordField
              :model-value="editableMember.workEmail"
              label="Work Email"
              :value="selectedMember.workEmail"
              :is-editing="isEditing"
              type="email"
              @update:model-value="updateField('workEmail', $event)"
            />
            <p
              v-if="isEditing && editableMember.workEmail.length > 0 && !isWorkEmailValid"
              class="text-xs text-(--color-brand-red)"
            >
              Enter a valid email address.
            </p>
          </div>

          <div class="space-y-1">
            <AdminMemberRecordField
              :model-value="editableMember.personalEmail"
              label="Personal Email"
              :value="selectedMember.personalEmail"
              :is-editing="isEditing"
              type="email"
              @update:model-value="updateField('personalEmail', $event)"
            />
            <p
              v-if="isEditing && editableMember.personalEmail.length > 0 && !isPersonalEmailValid"
              class="text-xs text-(--color-brand-red)"
            >
              Enter a valid email address.
            </p>
          </div>

          <div class="space-y-1">
            <AdminMemberRecordField
              :model-value="editableMember.phone"
              label="Phone"
              :value="selectedMember.phone"
              :is-editing="isEditing"
              type="tel"
              @update:model-value="emit('update-phone', $event)"
              @paste="emit('paste-phone', $event)"
            />
            <p
              v-if="isEditing && editablePhoneRawValue.length > 0 && !isPhoneValid"
              class="text-xs text-(--color-brand-red)"
            >
              Enter a valid 10-digit U.S. phone number.
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-3 border-t border-(--color-app-border) pt-5">
        <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">Employment</h3>

        <div class="grid gap-3 md:grid-cols-2">
          <AdminMemberRecordField
            :model-value="editableMember.brand"
            label="Brand"
            :value="selectedMember.brand"
            :is-editing="isEditing"
            @update:model-value="updateField('brand', $event)"
          />

          <AdminMemberRecordField
            :model-value="editableMember.title"
            label="Job Title"
            :value="selectedMember.title"
            :is-editing="isEditing"
            @update:model-value="updateField('title', $event)"
          />

          <AdminMemberRecordField
            :model-value="editableMember.unit"
            label="Unit Title"
            :value="selectedMember.unit"
            :is-editing="isEditing"
            @update:model-value="updateField('unit', $event)"
          />

          <AdminMemberRecordField
            :model-value="editableMember.location"
            label="Location"
            :value="selectedMember.location"
            :is-editing="isEditing"
            @update:model-value="updateField('location', $event)"
          />

          <AdminMemberRecordField
            :model-value="editableMember.unitTier"
            label="Unit Tier"
            :value="selectedMember.unitTier"
            :is-editing="isEditing"
            @update:model-value="updateField('unitTier', $event)"
          />
        </div>
      </section>

      <section class="space-y-3 border-t border-(--color-app-border) pt-5">
        <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">Status</h3>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="space-y-1">
            <span class="font-medium text-(--color-brand-navy)">Source</span>
            <span class="block rounded bg-slate-100 px-2 py-2 text-sm text-slate-700">
              {{ selectedMember.memberSource }}
            </span>
          </div>

          <label class="space-y-1">
            <span class="font-medium text-(--color-brand-navy)">Status</span>
            <select
              v-if="isEditing"
              :value="String(editableMember.isActive)"
              class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
              @change="handleStatusChange"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <span v-else class="block rounded bg-slate-100 px-2 py-2 text-sm text-slate-700">
              {{ selectedMember.isActive ? 'Active' : 'Inactive' }}
            </span>
          </label>

          <AdminMemberRecordField
            v-if="!selectedMember.isActive || !editableMember.isActive"
            :model-value="editableMember.inactiveReason"
            label="Inactive Reason"
            :value="selectedMember.inactiveReason"
            :is-editing="isEditing"
            @update:model-value="updateField('inactiveReason', $event)"
          />
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          v-if="isEditing"
          type="button"
          class="h-10 rounded border border-(--color-app-border) px-4 text-sm hover:cursor-pointer"
          @click="emit('cancel')"
        >
          Cancel
        </button>

        <button
          v-if="!isEditing"
          type="button"
          class="h-10 rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white hover:cursor-pointer"
          @click="emit('edit')"
        >
          Edit
        </button>

        <button
          v-else
          type="button"
          class="h-10 rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          :disabled="!canSave"
          @click="emit('save')"
        >
          {{ isSaving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminMemberRecordField from '@/components/admin/AdminMemberRecordField.vue'
import type { AdminEditableMember } from '@/types/member'

defineProps<{
  isOpen: boolean
  isLoading: boolean
  isEditing: boolean
  isSaving: boolean
  canSave: boolean
  selectedMember: AdminEditableMember | null
  editableMember: AdminEditableMember | null
  editablePhoneRawValue: string
  isWorkEmailValid: boolean
  isPersonalEmailValid: boolean
  isPhoneValid: boolean
}>()

const emit = defineEmits<{
  close: []
  edit: []
  cancel: []
  save: []
  'update-member-field': [field: keyof AdminEditableMember, value: string | boolean]
  'update-phone': [value: string]
  'paste-phone': [event: ClipboardEvent]
}>()

function updateField(field: keyof AdminEditableMember, value: string) {
  emit('update-member-field', field, value)
}

function handleStatusChange(event: Event) {
  const target = event.target

  if (!(target instanceof HTMLSelectElement)) {
    return
  }

  emit('update-member-field', 'isActive', target.value === 'true')
}
</script>
