<template>
  <main class="space-y-6 py-8 md:py-10">
    <section class="space-y-2">
      <p class="font-label text-xs tracking-wide text-(--color-brand-red)">Admin</p>
      <h1 class="font-condensed text-3xl font-semibold text-(--color-brand-navy)">
        Member Management
      </h1>
      <p class="max-w-2xl text-sm text-slate-600">
        Create member profiles for WGAE staff and manage member records.
      </p>
    </section>

    <AdminMemberForm
      ref="memberForm"
      :existing-work-emails="existingWorkEmails"
      :is-submitting-member="isSubmittingMember"
      @create-member="addMember"
    />

    <section v-if="successMessage" class="text-sm text-slate-700">
      {{ successMessage }}
    </section>

    <section v-if="errorMessage" class="text-sm text-(--color-brand-red)">
      {{ errorMessage }}
    </section>

    <section class="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div class="space-y-1">
          <h2 class="font-condensed text-2xl font-semibold text-(--color-brand-navy)">
            Existing Members
          </h2>
          <p class="text-sm text-slate-600">
            Browse current member records before editing workflows are added.
          </p>
        </div>

        <label class="space-y-1 text-sm text-slate-700">
          <span class="font-medium">Search members</span>
          <input
            v-model="memberSearchTerm"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:w-72 ml-2"
            type="search"
            placeholder="Search by name, email, brand, or title"
          />
        </label>
      </div>

      <p class="text-xs text-slate-500">
        Showing {{ filteredMembers.length }} of {{ members.length }} members
      </p>

      <div v-if="filteredMembers.length > 0" class="divide-y divide-slate-200">
        <button
          v-for="member in filteredMembers"
          :key="member.id"
          type="button"
          class="grid w-full gap-1 py-3 text-left text-sm hover:bg-slate-50 md:grid-cols-[1.5fr_1fr_1fr]"
          @click="selectMember(member.id)"
        >
          <div>
            <p class="font-semibold text-(--color-brand-navy)">{{ member.name }}</p>
            <p class="text-slate-600">{{ member.email }}</p>
          </div>

          <div class="text-slate-700">
            <p>{{ member.brand }}</p>
            <p class="text-slate-500">{{ member.unit }}</p>
          </div>

          <div class="text-slate-700">
            <p>{{ member.title }}</p>
            <p class="text-slate-500">{{ member.area }}</p>
          </div>
        </button>
      </div>

      <p v-else class="text-sm text-slate-600">No members match the current search.</p>
    </section>
    <BaseModal
      :is-open="isMemberModalOpen"
      labelled-by="admin-member-modal-title"
      @close="closeMemberModal"
    >
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2
              id="admin-member-modal-title"
              class="font-condensed text-2xl font-semibold text-(--color-brand-navy)"
            >
              {{ isEditingMember ? 'Edit Member' : 'Member Record' }}
            </h2>
            <p class="text-sm text-slate-600">Review this member record before editing.</p>
          </div>

          <button
            type="button"
            class="text-sm font-medium text-slate-600 hover:cursor-pointer hover:text-(--color-brand-navy)"
            @click="closeMemberModal"
          >
            Close
          </button>
        </div>
      </template>

      <p v-if="isLoadingSelectedMember" class="text-sm text-slate-600">Loading member details…</p>

      <div v-else-if="selectedMember && editableMember" class="space-y-6 text-sm">
        <section class="space-y-3">
          <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">Identity</h3>

          <div class="grid gap-3 md:grid-cols-2">
            <AdminMemberRecordField
              v-model="editableMember.legalFirstName"
              label="Legal First Name"
              :value="selectedMember.legalFirstName"
              :is-editing="isEditingMember"
            />

            <AdminMemberRecordField
              v-model="editableMember.legalLastName"
              label="Legal Last Name"
              :value="selectedMember.legalLastName"
              :is-editing="isEditingMember"
            />

            <AdminMemberRecordField
              v-model="editableMember.preferredName"
              label="Preferred Name"
              :value="selectedMember.preferredName"
              :is-editing="isEditingMember"
            />

            <AdminMemberRecordField
              v-model="editableMember.employeeNumber"
              label="Employee Number"
              :value="selectedMember.employeeNumber"
              :is-editing="isEditingMember"
            />

            <AdminMemberRecordField
              v-model="editableMember.unionId"
              label="Union ID"
              :value="selectedMember.unionId"
              :is-editing="isEditingMember"
            />
          </div>
        </section>

        <section class="space-y-3 border-t border-(--color-app-border) pt-5">
          <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">Contact</h3>

          <div class="grid gap-3 md:grid-cols-2">
            <div class="space-y-1">
              <AdminMemberRecordField
                v-model="editableMember.workEmail"
                label="Work Email"
                :value="selectedMember.workEmail"
                :is-editing="isEditingMember"
                type="email"
              />
              <p
                v-if="
                  isEditingMember &&
                  editableMember.workEmail.length > 0 &&
                  !isEditableWorkEmailValid
                "
                class="text-xs text-(--color-brand-red)"
              >
                Enter a valid email address.
              </p>
            </div>

            <div class="space-y-1">
              <AdminMemberRecordField
                v-model="editableMember.personalEmail"
                label="Personal Email"
                :value="selectedMember.personalEmail"
                :is-editing="isEditingMember"
                type="email"
              />
              <p
                v-if="
                  isEditingMember &&
                  editableMember.personalEmail.length > 0 &&
                  !isEditablePersonalEmailValid
                "
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
                :is-editing="isEditingMember"
                type="tel"
                @update:model-value="handleEditablePhoneInput"
                @paste="handleEditablePhonePaste"
              />
              <p
                v-if="isEditingMember && editableMember.phone.length > 0 && !isEditablePhoneValid"
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
              v-model="editableMember.brand"
              label="Brand"
              :value="selectedMember.brand"
              :is-editing="isEditingMember"
            />

            <AdminMemberRecordField
              v-model="editableMember.title"
              label="Job Title"
              :value="selectedMember.title"
              :is-editing="isEditingMember"
            />

            <AdminMemberRecordField
              v-model="editableMember.unit"
              label="Unit Title"
              :value="selectedMember.unit"
              :is-editing="isEditingMember"
            />

            <AdminMemberRecordField
              v-model="editableMember.location"
              label="Location"
              :value="selectedMember.location"
              :is-editing="isEditingMember"
            />

            <AdminMemberRecordField
              v-model="editableMember.unitTier"
              label="Unit Tier"
              :value="selectedMember.unitTier"
              :is-editing="isEditingMember"
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
                v-if="isEditingMember"
                v-model="editableMember.isActive"
                class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
              >
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
              <span v-else class="block rounded bg-slate-100 px-2 py-2 text-sm text-slate-700">
                {{ selectedMember.isActive ? 'Active' : 'Inactive' }}
              </span>
            </label>

            <AdminMemberRecordField
              v-if="!selectedMember.isActive || !editableMember.isActive"
              v-model="editableMember.inactiveReason"
              label="Inactive Reason"
              :value="selectedMember.inactiveReason"
              :is-editing="isEditingMember"
            />
          </div>
        </section>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            v-if="isEditingMember"
            type="button"
            class="h-10 rounded border border-(--color-app-border) px-4 text-sm hover:cursor-pointer"
            @click="cancelMemberEdit"
          >
            Cancel
          </button>

          <button
            v-if="!isEditingMember"
            type="button"
            class="h-10 rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white hover:cursor-pointer"
            @click="startMemberEdit"
          >
            Edit
          </button>

          <button
            v-else
            type="button"
            class="h-10 rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            :disabled="!canSaveMemberChanges"
            @click="saveMemberChanges"
          >
            {{ isSavingMember ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, onMounted } from 'vue'
import { formatPhoneNumber, isValidEmail, isValidOptionalPhone } from '@/utils/memberFormValidation'
import AdminMemberForm from '@/components/admin/AdminMemberForm.vue'
import { createAdminMember, fetchAdminMember, updateAdminMember } from '@/services/adminMembers'
import type { AdminEditableMember, AdminMemberPayload, MemberListItem } from '@/types/member'
import { fetchMemberDirectory } from '@/services/memberDirectory'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminMemberRecordField from '@/components/admin/AdminMemberRecordField.vue'

const isSubmittingMember = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const existingWorkEmails = ref<string[]>([])
const members = ref<MemberListItem[]>([])
const memberSearchTerm = ref('')
const selectedMember = ref<AdminEditableMember | null>(null)
const editableMember = ref<AdminEditableMember | null>(null)
const editablePhoneRawValue = ref('')
const isLoadingSelectedMember = ref(false)
const isMemberModalOpen = ref(false)
const isEditingMember = ref(false)
const isSavingMember = ref(false)
const memberForm = useTemplateRef<{ resetForm: () => void }>('memberForm')

const filteredMembers = computed(() => {
  const normalizedSearchTerm = memberSearchTerm.value.trim().toLowerCase()

  if (!normalizedSearchTerm) {
    return members.value
  }

  return members.value.filter((member) => {
    const searchableFields = [
      member.name,
      member.email,
      member.brand,
      member.title,
      member.unit,
      member.area,
    ]

    return searchableFields.some((field) => field.toLowerCase().includes(normalizedSearchTerm))
  })
})

const isEditableWorkEmailValid = computed(() =>
  editableMember.value ? isValidEmail(editableMember.value.workEmail) : true,
)

const isEditablePersonalEmailValid = computed(() =>
  editableMember.value ? isValidEmail(editableMember.value.personalEmail) : true,
)

const isEditablePhoneValid = computed(() => isValidOptionalPhone(editablePhoneRawValue.value))

const canSaveMemberChanges = computed(
  () =>
    isEditableWorkEmailValid.value &&
    isEditablePersonalEmailValid.value &&
    isEditablePhoneValid.value &&
    !isSavingMember.value,
)

async function addMember(payload: AdminMemberPayload) {
  isSubmittingMember.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    await createAdminMember(payload)
    successMessage.value = 'Member profile created.'
    memberForm.value?.resetForm()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to create member profile.'
  } finally {
    isSubmittingMember.value = false
  }

  try {
    await loadMembers()
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Member was created, but the member list did not reload.'
  }
}

async function selectMember(memberId: string) {
  isLoadingSelectedMember.value = true
  errorMessage.value = null
  isEditingMember.value = false
  isMemberModalOpen.value = true

  try {
    selectedMember.value = await fetchAdminMember(memberId)
    editableMember.value = { ...selectedMember.value }
    editablePhoneRawValue.value = selectedMember.value.phone
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load member details.'
    isMemberModalOpen.value = false
  } finally {
    isLoadingSelectedMember.value = false
  }
}

function startMemberEdit() {
  if (!selectedMember.value) {
    return
  }

  editableMember.value = { ...selectedMember.value }
  editablePhoneRawValue.value = selectedMember.value.phone
  isEditingMember.value = true
}

function updateEditablePhone(value: string) {
  editablePhoneRawValue.value = value

  if (!editableMember.value) {
    return
  }

  editableMember.value.phone = formatPhoneNumber(value)
}

function handleEditablePhoneInput(value: string) {
  updateEditablePhone(value)
}

function handleEditablePhonePaste(event: ClipboardEvent) {
  event.preventDefault()

  const pastedValue = event.clipboardData?.getData('text') ?? ''

  updateEditablePhone(pastedValue)
}

function cancelMemberEdit() {
  if (selectedMember.value) {
    editableMember.value = { ...selectedMember.value }
    editablePhoneRawValue.value = selectedMember.value.phone
  }

  isEditingMember.value = false
}

async function saveMemberChanges() {
  if (!editableMember.value) {
    return
  }

  isSavingMember.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    await updateAdminMember(editableMember.value)
    selectedMember.value = { ...editableMember.value }
    isEditingMember.value = false
    successMessage.value = 'Member record updated.'
    await loadMembers()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to update member record.'
  } finally {
    isSavingMember.value = false
  }
}

function closeMemberModal() {
  isEditingMember.value = false
  isMemberModalOpen.value = false
  selectedMember.value = null
  editableMember.value = null
}

async function loadMembers() {
  members.value = await fetchMemberDirectory()

  existingWorkEmails.value = members.value
    .map((member) => member.email.trim().toLowerCase())
    .filter((email) => email.length > 0)
}

onMounted(() => {
  void loadMembers()
})
</script>
