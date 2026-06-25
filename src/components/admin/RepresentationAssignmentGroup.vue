<template>
  <section class="space-y-4">
    <div>
      <h2 class="font-condensed text-2xl font-semibold text-(--color-brand-navy)">
        {{ title }}
      </h2>
      <p class="text-sm text-slate-600">{{ description }}</p>
    </div>

    <div v-if="groups.length === 0" class="text-sm text-slate-600">
      {{ emptyMessage }}
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="group in groups"
        :key="group.scopeValue"
        class="space-y-3 rounded-md bg-slate-50 px-4 py-3"
      >
        <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">
          {{ group.scopeValue }}
        </h3>

        <ul class="space-y-2">
          <li
            v-for="assignment in group.assignments"
            :key="assignment.id"
            class="flex items-start justify-between gap-3"
          >
            <div>
              <p class="text-sm font-medium text-slate-800">{{ assignment.name }}</p>
              <p class="text-xs text-slate-500">{{ assignment.email || 'No email listed' }}</p>
            </div>

            <button
              type="button"
              class="text-xs font-medium text-(--color-brand-red) hover:cursor-pointer hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
              :disabled="deletingAssignmentId === assignment.id"
              @click="$emit('remove-assignment', assignment.id)"
            >
              {{ deletingAssignmentId === assignment.id ? 'Removing…' : 'Remove' }}
            </button>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LeadershipItem } from '@/types/leadership'

type AssignmentGroup = {
  scopeValue: string
  assignments: LeadershipItem[]
}

defineProps<{
  title: string
  description: string
  emptyMessage: string
  groups: AssignmentGroup[]
  deletingAssignmentId: string | null
}>()

defineEmits<{
  'remove-assignment': [assignmentId: string]
}>()
</script>
