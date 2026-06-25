<template>
  <section class="space-y-4 rounded-md bg-slate-50 p-5">
    <div class="space-y-1">
      <h2 class="font-condensed text-xl font-semibold text-(--color-brand-navy)">Assign Member</h2>
    </div>

    <form class="grid gap-4 md:grid-cols-[1fr_auto]" @submit.prevent="submitMembership">
      <div class="md:col-span-2">
        <AdminMemberSearch v-model:selected-member-id="selectedMemberId" :members="members" />
      </div>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Committee</span>
        <select
          v-model="selectedCommitteeId"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
        >
          <option value="">Select committee</option>
          <option v-for="committee in committees" :key="committee.id" :value="committee.id">
            {{ committee.name }}
          </option>
        </select>
      </label>

      <button
        type="submit"
        class="h-10 self-end rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        :disabled="!canSubmitMembership"
      >
        {{ isSubmittingMembership ? 'Adding…' : 'Add' }}
      </button>

      <p
        v-if="selectedMembershipAlreadyExists"
        class="text-sm text-(--color-brand-red) md:col-span-2"
      >
        This committee membership already exists.
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminMemberSearch from '@/components/admin/AdminMemberSearch.vue'
import type { Committee, CommitteeMembershipPayload } from '@/types/committee'
import type { MemberListItem } from '@/types/member'

const props = defineProps<{
  members: MemberListItem[]
  committees: Committee[]
  isSubmittingMembership: boolean
}>()

const emit = defineEmits<{
  addMembership: [payload: CommitteeMembershipPayload]
}>()

const selectedMemberId = ref('')
const selectedCommitteeId = ref('')

const selectedMembershipAlreadyExists = computed(() => {
  const selectedCommittee = props.committees.find(
    (committee) => committee.id === selectedCommitteeId.value,
  )

  if (!selectedCommittee) {
    return false
  }

  return selectedCommittee.members.some((member) => member.id === selectedMemberId.value)
})

const canSubmitMembership = computed(
  () =>
    selectedMemberId.value.length > 0 &&
    selectedCommitteeId.value.length > 0 &&
    !selectedMembershipAlreadyExists.value &&
    !props.isSubmittingMembership,
)

function submitMembership() {
  if (!canSubmitMembership.value) {
    return
  }

  emit('addMembership', {
    memberId: selectedMemberId.value,
    committeeId: selectedCommitteeId.value,
  })

  selectedMemberId.value = ''
  selectedCommitteeId.value = ''
}
</script>
