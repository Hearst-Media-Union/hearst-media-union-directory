<template>
  <section class="rounded-md bg-slate-50 p-5">
    <div class="space-y-1">
      <h2 class="font-condensed text-xl font-semibold text-(--color-brand-navy)">
        {{ heading }}
      </h2>
      <p class="text-sm text-slate-600">
        {{ description }}
      </p>
    </div>

    <form class="mt-4 grid gap-4 md:grid-cols-2" @submit.prevent="submitMember">
      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">First Name *</span>
        <input
          v-model="legalFirstName"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="text"
        />
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Last Name *</span>
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
        <span class="font-medium text-(--color-brand-navy)">Work Email *</span>
        <span class="flex h-10 overflow-hidden rounded border border-(--color-border) bg-white">
          <input
            :value="workEmailLocalPart"
            class="min-w-0 flex-1 px-3 text-sm outline-none"
            type="text"
            @input="handleWorkEmailInput"
          />
          <span
            class="flex items-center border-l border-(--color-border) bg-slate-100 px-3 text-sm text-slate-600"
          >
            @wgaeast.org
          </span>
        </span>
        <p
          v-if="workEmailLocalPart.length > 0 && !isWorkEmailLocalPartValid"
          class="text-xs text-(--color-brand-red)"
        >
          Use only letters, numbers, periods, underscores, or hyphens.
        </p>
        <p v-if="workEmailAlreadyExists" class="text-xs text-(--color-brand-red)">
          A member with this work email already exists.
        </p>
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Personal Email</span>
        <input
          v-model="personalEmail"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="email"
        />
        <p
          v-if="personalEmail.length > 0 && !isPersonalEmailValid"
          class="text-xs text-(--color-brand-red)"
        >
          Enter a valid email address.
        </p>
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Phone</span>
        <input
          :value="phone"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="tel"
          placeholder="1-555-555-5555"
          @input="handlePhoneInput"
          @paste="handlePhonePaste"
        />
        <p v-if="phone.length > 0 && !isPhoneValid" class="text-xs text-(--color-brand-red)">
          Enter a valid 10-digit U.S. phone number.
        </p>
      </label>

      <label class="space-y-1 text-sm md:col-span-2">
        <span class="font-medium text-(--color-brand-navy)">Title</span>
        <input
          v-model="title"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="text"
        />
      </label>

      <p class="text-xs text-slate-500 md:col-span-2">* Required fields</p>

      <div class="md:col-span-2">
        <button
          type="submit"
          class="h-10 rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          :disabled="!canSubmitMember"
        >
          {{ isSubmittingMember ? submittingLabel : submitLabel }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  formatPhoneNumber,
  getPhoneDigits,
  getSuggestedWorkEmailLocalPart,
  hasInvalidPhoneCharacters,
  isValidEmail,
  isValidWorkEmailLocalPart,
} from '@/utils/memberFormValidation'
import type { AdminMemberPayload } from '@/types/member'

const props = withDefaults(
  defineProps<{
    isSubmittingMember: boolean
    existingWorkEmails: string[]
    heading?: string
    description?: string
    submitLabel?: string
    submittingLabel?: string
    ignoredWorkEmail?: string | null
  }>(),
  {
    heading: 'Create WGAE Member',
    description: 'Create a member profile that can be linked when the person creates an account.',
    submitLabel: 'Create Member',
    submittingLabel: 'Creating…',
    ignoredWorkEmail: null,
  },
)

const emit = defineEmits<{
  createMember: [payload: AdminMemberPayload]
}>()

const legalFirstName = ref('')
const legalLastName = ref('')
const preferredName = ref('')
const workEmailLocalPart = ref('')
const personalEmail = ref('')
const phone = ref('')
const title = ref('')
const phoneRawValue = ref('')

const workEmail = computed(() => `${workEmailLocalPart.value.trim()}@wgaeast.org`)

const isWorkEmailLocalPartValid = computed(() =>
  isValidWorkEmailLocalPart(workEmailLocalPart.value),
)

const isPersonalEmailValid = computed(() => isValidEmail(personalEmail.value))

const phoneHasInvalidCharacters = computed(() => hasInvalidPhoneCharacters(phoneRawValue.value))

const phoneDigits = computed(() => getPhoneDigits(phoneRawValue.value))

const isPhoneValid = computed(
  () =>
    phoneRawValue.value.trim().length === 0 ||
    (!phoneHasInvalidCharacters.value && phoneDigits.value.length === 10),
)

const workEmailAlreadyExists = computed(() => {
  const normalizedWorkEmail = workEmail.value.trim().toLowerCase()
  const normalizedIgnoredWorkEmail = props.ignoredWorkEmail?.trim().toLowerCase() ?? null

  return (
    normalizedWorkEmail !== normalizedIgnoredWorkEmail &&
    props.existingWorkEmails.includes(normalizedWorkEmail)
  )
})

const hasEditedWorkEmail = ref(false)

const canSubmitMember = computed(
  () =>
    legalFirstName.value.trim().length > 0 &&
    legalLastName.value.trim().length > 0 &&
    isWorkEmailLocalPartValid.value &&
    !workEmailAlreadyExists.value &&
    isPersonalEmailValid.value &&
    isPhoneValid.value &&
    !props.isSubmittingMember,
)

function handleWorkEmailInput(event: Event) {
  const target = event.target

  if (!(target instanceof HTMLInputElement)) {
    return
  }

  hasEditedWorkEmail.value = true
  workEmailLocalPart.value = target.value.trim().toLowerCase().replace(/\s/g, '')
}

watch([legalFirstName, legalLastName], () => {
  if (hasEditedWorkEmail.value) {
    return
  }

  workEmailLocalPart.value = getSuggestedWorkEmailLocalPart(
    legalFirstName.value,
    legalLastName.value,
  )
})

function handlePhoneInput(event: Event) {
  const target = event.target

  if (!(target instanceof HTMLInputElement)) {
    return
  }

  phoneRawValue.value = target.value
  phone.value = formatPhoneNumber(target.value)
}

function handlePhonePaste(event: ClipboardEvent) {
  event.preventDefault()

  const pastedValue = event.clipboardData?.getData('text') ?? ''

  phoneRawValue.value = pastedValue
  phone.value = formatPhoneNumber(pastedValue)
}

function resetForm() {
  legalFirstName.value = ''
  legalLastName.value = ''
  preferredName.value = ''
  workEmailLocalPart.value = ''
  hasEditedWorkEmail.value = false
  personalEmail.value = ''
  phone.value = ''
  phoneRawValue.value = ''
  title.value = ''
}

function populateForm(payload: AdminMemberPayload) {
  legalFirstName.value = payload.legalFirstName
  legalLastName.value = payload.legalLastName
  preferredName.value = payload.preferredName
  workEmailLocalPart.value = payload.workEmail.replace(/@wgaeast\.org$/i, '')
  hasEditedWorkEmail.value = true
  personalEmail.value = payload.personalEmail
  phone.value = payload.phone
  phoneRawValue.value = payload.phone
  title.value = payload.title
}

defineExpose({
  resetForm,
  populateForm,
})

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
}
</script>
