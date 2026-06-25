<template>
  <section class="rounded-md bg-slate-50 p-5">
    <div class="space-y-1">
      <h2 class="font-condensed text-xl font-semibold text-(--color-brand-navy)">
        Create WGAE Member
      </h2>
      <p class="text-sm text-slate-600">
        Create a member profile that can be linked when the person creates an account.
      </p>
    </div>

    <form class="mt-4 grid gap-4 md:grid-cols-2" @submit.prevent="submitMember">
      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">First Name</span>
        <input
          v-model="legalFirstName"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="text"
        />
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Last Name</span>
        <input
          v-model="legalLastName"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="text"
        />
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Preferred Name</span>
        <input
          v-model="preferredName"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="text"
          placeholder="Defaults to first and last name"
        />
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Work Email</span>
        <input
          v-model="workEmail"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="email"
        />
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Personal Email</span>
        <input
          v-model="personalEmail"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="email"
        />
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Phone</span>
        <input
          v-model="phone"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="tel"
        />
      </label>

      <label class="space-y-1 text-sm md:col-span-2">
        <span class="font-medium text-(--color-brand-navy)">Title</span>
        <input
          v-model="title"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="text"
        />
      </label>

      <div class="md:col-span-2">
        <button
          type="submit"
          class="h-10 rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          :disabled="!canSubmitMember"
        >
          {{ isSubmittingMember ? 'Creating…' : 'Create Member' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdminMemberPayload } from '@/types/member'

const props = defineProps<{
  isSubmittingMember: boolean
}>()

const emit = defineEmits<{
  createMember: [payload: AdminMemberPayload]
}>()

const legalFirstName = ref('')
const legalLastName = ref('')
const preferredName = ref('')
const workEmail = ref('')
const personalEmail = ref('')
const phone = ref('')
const title = ref('')

const canSubmitMember = computed(
  () =>
    legalFirstName.value.trim().length > 0 &&
    legalLastName.value.trim().length > 0 &&
    workEmail.value.trim().length > 0 &&
    !props.isSubmittingMember,
)

function submitMember() {
  if (!canSubmitMember.value) {
    return
  }

  emit('createMember', {
    legalFirstName: legalFirstName.value,
    legalLastName: legalLastName.value,
    preferredName: preferredName.value,
    workEmail: workEmail.value,
    personalEmail: personalEmail.value,
    phone: phone.value,
    title: title.value,
  })

  legalFirstName.value = ''
  legalLastName.value = ''
  preferredName.value = ''
  workEmail.value = ''
  personalEmail.value = ''
  phone.value = ''
  title.value = ''
}
</script>
