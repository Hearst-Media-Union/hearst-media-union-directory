<template>
  <main class="space-y-6 py-8 md:py-10">
    <section class="space-y-2">
      <p class="font-label text-xs tracking-wide text-(--color-brand-red)">Admin</p>
      <h1 class="font-condensed text-3xl font-semibold text-(--color-brand-navy)">
        Representation Management
      </h1>
      <p class="max-w-2xl text-sm text-slate-600">
        Review current Area Captain and Brand Steward assignments.
      </p>
    </section>

    <section class="rounded-md bg-slate-50 p-4">
      <form class="grid gap-4 md:grid-cols-[1fr_1fr_auto]" @submit.prevent="addAssignment">
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

    <section v-if="successMessage" class="text-sm text-slate-700">
      {{ successMessage }}
    </section>

    <section v-if="isLoading" class="text-sm text-slate-600">
      Loading representation assignments…
    </section>

    <section v-else-if="errorMessage" class="text-sm text-(--color-brand-red)">
      {{ errorMessage }}
    </section>

    <section v-else-if="assignments.length === 0" class="text-sm text-slate-600">
      No representation assignments found.
    </section>

    <section v-else class="grid gap-8 lg:grid-cols-2">
      <RepresentationAssignmentGroup
        title="Area Captains"
        description="Grouped by represented area."
        empty-message="No Area Captains listed."
        :groups="areaCaptainGroups"
        :deleting-assignment-id="deletingAssignmentId"
        @remove-assignment="removeAssignment"
      />

      <RepresentationAssignmentGroup
        title="Brand Stewards"
        description="Grouped by represented brand."
        empty-message="No Brand Stewards listed."
        :groups="brandStewardGroups"
        :deleting-assignment-id="deletingAssignmentId"
        @remove-assignment="removeAssignment"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  createLeadershipAssignment,
  deleteLeadershipAssignment,
  fetchLeadershipAssignments,
} from '@/services/leadership'
import { fetchMemberDirectory } from '@/services/memberDirectory'
import type { LeadershipItem, LeadershipRole, LeadershipScopeType } from '@/types/leadership'
import type { MemberListItem } from '@/types/member'
import AdminMemberSearch from '@/components/admin/AdminMemberSearch.vue'
import RepresentationAssignmentGroup from '@/components/admin/RepresentationAssignmentGroup.vue'

// TODO: Refactor?

type AssignmentGroup = {
  scopeValue: string
  assignments: LeadershipItem[]
}

const assignments = ref<LeadershipItem[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const deletingAssignmentId = ref<string | null>(null)
const members = ref<MemberListItem[]>([])
const selectedMemberId = ref('')
const selectedRole = ref<LeadershipRole>('area_captain')
const selectedScopeValue = ref('')
const isSubmittingAssignment = ref(false)

const assignmentOptions = computed(() => {
  const values =
    selectedRole.value === 'area_captain'
      ? members.value.map((member) => member.area)
      : members.value.map((member) => member.brand)

  return [...new Set(values.filter((value) => value.length > 0))].sort((firstValue, secondValue) =>
    firstValue.localeCompare(secondValue),
  )
})

const selectedScopeType = computed<LeadershipScopeType>(() =>
  selectedRole.value === 'area_captain' ? 'location' : 'brand',
)

const selectedAssignmentAlreadyExists = computed(() =>
  assignments.value.some(
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
    !isSubmittingAssignment.value,
)

const areaCaptainGroups = computed(() =>
  groupAssignmentsByScopeValue(
    assignments.value.filter((assignment) => assignment.role === 'area_captain'),
  ),
)

const brandStewardGroups = computed(() =>
  groupAssignmentsByScopeValue(
    assignments.value.filter((assignment) => assignment.role === 'shop_steward'),
  ),
)

function groupAssignmentsByScopeValue(nextAssignments: LeadershipItem[]): AssignmentGroup[] {
  const groups = nextAssignments.reduce<Record<string, LeadershipItem[]>>(
    (groupMap, assignment) => {
      const groupKey = assignment.scopeValue || 'Unassigned'

      return {
        ...groupMap,
        [groupKey]: [...(groupMap[groupKey] ?? []), assignment],
      }
    },
    {},
  )

  return Object.entries(groups)
    .map(([scopeValue, groupedAssignments]) => ({
      scopeValue,
      assignments: groupedAssignments,
    }))
    .sort((firstGroup, secondGroup) => firstGroup.scopeValue.localeCompare(secondGroup.scopeValue))
}

async function removeAssignment(assignmentId: string) {
  deletingAssignmentId.value = assignmentId
  errorMessage.value = null
  successMessage.value = null

  try {
    await deleteLeadershipAssignment(assignmentId)
    assignments.value = assignments.value.filter((assignment) => assignment.id !== assignmentId)
    successMessage.value = 'Representation assignment removed.'
  } catch {
    errorMessage.value = 'Unable to remove representation assignment.'
  } finally {
    deletingAssignmentId.value = null
  }
}

async function loadMembers() {
  try {
    members.value = await fetchMemberDirectory()
  } catch {
    errorMessage.value = 'Unable to load members for representation assignment.'
  }
}

async function addAssignment() {
  if (!canSubmitAssignment.value) {
    return
  }

  isSubmittingAssignment.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    await createLeadershipAssignment({
      memberId: selectedMemberId.value,
      role: selectedRole.value,
      scopeType: selectedScopeType.value,
      scopeValue: selectedScopeValue.value,
    })

    selectedMemberId.value = ''
    selectedScopeValue.value = ''

    await loadAssignments()
    successMessage.value = 'Representation assignment added.'
  } catch {
    errorMessage.value = 'Unable to add representation assignment.'
  } finally {
    isSubmittingAssignment.value = false
  }
}

async function loadAssignments() {
  isLoading.value = true
  errorMessage.value = null

  try {
    assignments.value = await fetchLeadershipAssignments()
  } catch {
    errorMessage.value = 'Unable to load representation assignments.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadMembers()
  void loadAssignments()
})
</script>
