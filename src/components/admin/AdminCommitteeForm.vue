<template>
  <section class="space-y-4 rounded-md bg-slate-50 p-5">
    <div class="space-y-1">
      <h2 class="font-condensed text-xl font-semibold text-(--color-brand-navy)">
        Create Committee
      </h2>
    </div>

    <form class="grid gap-4 md:grid-cols-[1fr_2fr_auto]" @submit.prevent="submitCommittee">
      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Committee name</span>
        <input
          v-model="committeeName"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="text"
          placeholder="New Member Committee (e.g.)"
        />
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Description</span>
        <input
          v-model="committeeDescription"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          type="text"
          placeholder="Optional description"
        />
      </label>

      <button
        type="submit"
        class="h-10 self-end rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        :disabled="!canSubmitCommittee"
      >
        {{ isSubmittingCommittee ? 'Creating…' : 'Create' }}
      </button>
      <p v-if="committeeNameAlreadyExists" class="text-sm text-(--color-brand-red) md:col-span-3">
        This committee already exists.
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Committee, CommitteePayload } from '@/types/committee'

const props = defineProps<{
  committees: Committee[]
  isSubmittingCommittee: boolean
}>()

const emit = defineEmits<{
  createCommittee: [payload: CommitteePayload]
}>()

const committeeName = ref('')
const committeeDescription = ref('')

const committeeNameAlreadyExists = computed(() =>
  props.committees.some(
    (committee) => committee.name.trim().toLowerCase() === committeeName.value.trim().toLowerCase(),
  ),
)

const canSubmitCommittee = computed(
  () =>
    committeeName.value.trim().length > 0 &&
    !committeeNameAlreadyExists.value &&
    !props.isSubmittingCommittee,
)

function submitCommittee() {
  if (!canSubmitCommittee.value) {
    return
  }

  emit('createCommittee', {
    name: committeeName.value.trim(),
    description: committeeDescription.value.trim(),
  })

  committeeName.value = ''
  committeeDescription.value = ''
}
</script>
