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
  </main>
</template>
<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'
import AdminMemberForm from '@/components/admin/AdminMemberForm.vue'
import { createAdminMember } from '@/services/adminMembers'
import type { AdminMemberPayload } from '@/types/member'
import { fetchMemberDirectory } from '@/services/memberDirectory'

const isSubmittingMember = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const existingWorkEmails = ref<string[]>([])
const memberForm = useTemplateRef<{ resetForm: () => void }>('memberForm')

async function addMember(payload: AdminMemberPayload) {
  isSubmittingMember.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    await createAdminMember(payload)
    successMessage.value = 'Member profile created.'
    isSubmittingMember.value = false
    await loadExistingWorkEmails()
    memberForm.value?.resetForm()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to create member profile.'
    isSubmittingMember.value = false
  }
}

async function loadExistingWorkEmails() {
  const members = await fetchMemberDirectory()

  existingWorkEmails.value = members
    .map((member) => member.email.trim().toLowerCase())
    .filter((email) => email.length > 0)
}

onMounted(() => {
  void loadExistingWorkEmails()
})
</script>
