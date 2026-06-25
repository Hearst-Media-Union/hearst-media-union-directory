<template>
  <section class="rounded-md bg-slate-50 p-4">
    <form class="grid gap-4 md:grid-cols-[1fr_1fr_auto]" @submit.prevent="submitAssignment">
      <div class="md:col-span-3">
        <AdminMemberSearch v-model:selected-member-id="selectedMemberId" :members="members" />
      </div>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Role</span>
        <select
          v-model="selectedRole"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
          @change="selectedScopeValue = ''"
        >
          <option value="area_captain">Area Captain</option>
          <option value="shop_steward">Brand Steward</option>
        </select>
      </label>

      <label class="space-y-1 text-sm">
        <span class="font-medium text-(--color-brand-navy)">Assignment</span>
        <select
          v-model="selectedScopeValue"
          class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
        >
          <option value="">Select assignment</option>
          <option
            v-for="assignmentValue in assignmentOptions"
            :key="assignmentValue"
            :value="assignmentValue"
          >
            {{ assignmentValue }}
          </option>
        </select>
      </label>

      <button
        type="submit"
        class="h-10 self-end rounded bg-(--color-brand-red) px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        :disabled="!canSubmitAssignment"
      >
        {{ isSubmittingAssignment ? 'Adding…' : 'Add' }}
      </button>

      <p
        v-if="selectedAssignmentAlreadyExists"
        class="text-sm text-(--color-brand-red) md:col-span-3"
      >
        This representation assignment already exists.
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AdminMemberSearch from '@/components/admin/AdminMemberSearch.vue'
import type { LeadershipItem, LeadershipRole, LeadershipScopeType } from '@/types/leadership'
import type { MemberListItem } from '@/types/member'

const props = defineProps<{
  members: MemberListItem[]
  assignments: LeadershipItem[]
  isSubmittingAssignment: boolean
}>()

const emit = defineEmits<{
  addAssignment: [
    payload: {
      memberId: string
      role: LeadershipRole
      scopeType: LeadershipScopeType
      scopeValue: string
    },
  ]
}>()

const selectedMemberId = ref('')
const selectedRole = ref<LeadershipRole>('area_captain')
const selectedScopeValue = ref('')

const assignmentOptions = computed(() => {
  const values =
    selectedRole.value === 'area_captain'
      ? props.members.map((member) => member.area)
      : props.members.map((member) => member.brand)

  return [...new Set(values.filter((value) => value.length > 0))].sort((firstValue, secondValue) =>
    firstValue.localeCompare(secondValue),
  )
})

const selectedScopeType = computed<LeadershipScopeType>(() =>
  selectedRole.value === 'area_captain' ? 'location' : 'brand',
)

const selectedAssignmentAlreadyExists = computed(() =>
  props.assignments.some(
    (assignment) =>
      assignment.memberId === selectedMemberId.value &&
      assignment.role === selectedRole.value &&
      assignment.scopeValue === selectedScopeValue.value,
  ),
)

const canSubmitAssignment = computed(
  () =>
    selectedMemberId.value.length > 0 &&
    selectedScopeValue.value.length > 0 &&
    !selectedAssignmentAlreadyExists.value &&
    !props.isSubmittingAssignment,
)

function submitAssignment() {
  if (!canSubmitAssignment.value) {
    return
  }

  emit('addAssignment', {
    memberId: selectedMemberId.value,
    role: selectedRole.value,
    scopeType: selectedScopeType.value,
    scopeValue: selectedScopeValue.value,
  })

  selectedMemberId.value = ''
  selectedScopeValue.value = ''
}
</script>
