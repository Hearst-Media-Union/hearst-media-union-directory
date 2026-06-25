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

    <AdminRepresentationAssignmentForm
      :members="members"
      :assignments="assignments"
      :is-submitting-assignment="isSubmittingAssignment"
      @add-assignment="addAssignment"
    />

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
import RepresentationAssignmentGroup from '@/components/admin/RepresentationAssignmentGroup.vue'
import AdminRepresentationAssignmentForm from '@/components/admin/AdminRepresentationAssignmentForm.vue'

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
const isSubmittingAssignment = ref(false)

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

async function addAssignment(payload: {
  memberId: string
  role: LeadershipRole
  scopeType: LeadershipScopeType
  scopeValue: string
}) {
  isSubmittingAssignment.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    await createLeadershipAssignment(payload)

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
