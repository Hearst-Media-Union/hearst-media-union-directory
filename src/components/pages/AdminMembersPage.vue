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
    <AdminMemberRecordModal
      :is-open="isMemberModalOpen"
      :is-loading="isLoadingSelectedMember"
      :is-editing="isEditingMember"
      :is-saving="isSavingMember"
      :can-save="canSaveMemberChanges"
      :selected-member="selectedMember"
      :editable-member="editableMember"
      :editable-phone-raw-value="editablePhoneRawValue"
      :is-work-email-valid="isEditableWorkEmailValid"
      :is-personal-email-valid="isEditablePersonalEmailValid"
      :is-phone-valid="isEditablePhoneValid"
      @close="closeMemberModal"
      @edit="startMemberEdit"
      @cancel="cancelMemberEdit"
      @save="saveMemberChanges"
      @update-member-field="updateEditableMemberField"
      @update-phone="handleEditablePhoneInput"
      @paste-phone="handleEditablePhonePaste"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, onMounted } from 'vue'
import { formatPhoneNumber, isValidEmail, isValidOptionalPhone } from '@/utils/memberFormValidation'
import AdminMemberForm from '@/components/admin/AdminMemberForm.vue'
import { createAdminMember, fetchAdminMember, updateAdminMember } from '@/services/adminMembers'
import type { AdminEditableMember, AdminMemberPayload, MemberListItem } from '@/types/member'
import { fetchMemberDirectory } from '@/services/memberDirectory'
import AdminMemberRecordModal from '@/components/admin/AdminMemberRecordModal.vue'

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

function updateEditableMemberField(field: keyof AdminEditableMember, value: string | boolean) {
  if (!editableMember.value) {
    return
  }

  editableMember.value = {
    ...editableMember.value,
    [field]: value,
  }
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
