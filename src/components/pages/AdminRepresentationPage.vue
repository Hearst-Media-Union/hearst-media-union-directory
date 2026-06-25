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
      <section class="space-y-4">
        <div>
          <h2 class="font-condensed text-2xl font-semibold text-(--color-brand-navy)">
            Area Captains
          </h2>
          <p class="text-sm text-slate-600">Grouped by represented area.</p>
        </div>

        <div v-if="areaCaptainGroups.length === 0" class="text-sm text-slate-600">
          No Area Captains listed.
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="group in areaCaptainGroups"
            :key="group.scopeValue"
            class="space-y-3 rounded-md bg-slate-50 px-4 py-3"
          >
            <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">
              {{ group.scopeValue }}
            </h3>

            <ul class="space-y-2">
              <li v-for="assignment in group.assignments" :key="assignment.id">
                <p class="text-sm font-medium text-slate-800">{{ assignment.name }}</p>
                <p class="text-xs text-slate-500">{{ assignment.email || 'No email listed' }}</p>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section class="space-y-4">
        <div>
          <h2 class="font-condensed text-2xl font-semibold text-(--color-brand-navy)">
            Brand Stewards
          </h2>
          <p class="text-sm text-slate-600">Grouped by represented brand.</p>
        </div>

        <div v-if="brandStewardGroups.length === 0" class="text-sm text-slate-600">
          No Brand Stewards listed.
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="group in brandStewardGroups"
            :key="group.scopeValue"
            class="space-y-3 rounded-md bg-slate-50 px-4 py-3"
          >
            <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">
              {{ group.scopeValue }}
            </h3>

            <ul class="space-y-2">
              <li v-for="assignment in group.assignments" :key="assignment.id">
                <p class="text-sm font-medium text-slate-800">{{ assignment.name }}</p>
                <p class="text-xs text-slate-500">{{ assignment.email || 'No email listed' }}</p>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchLeadershipAssignments } from '@/services/leadership'
import type { LeadershipItem } from '@/types/leadership'

type AssignmentGroup = {
  scopeValue: string
  assignments: LeadershipItem[]
}

const assignments = ref<LeadershipItem[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

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
  void loadAssignments()
})
</script>
