<template>
  <section class="space-y-5 rounded-lg border border-(--color-border) bg-white p-5 shadow-sm">
    <div class="space-y-1">
      <p class="font-label text-xs tracking-wide text-(--color-brand-red)">Dry Run</p>

      <h2 class="font-condensed text-2xl font-semibold text-(--color-brand-navy)">
        {{ result.workbookFile.name }}
      </h2>

      <p class="text-sm text-slate-600">
        Active sheet: {{ result.report.workbook.matchedSheetNames.active }}
      </p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article class="rounded-md bg-slate-50 p-4">
        <p class="text-xs font-medium text-slate-500">Create members</p>
        <p class="mt-1 font-condensed text-2xl font-semibold text-(--color-brand-navy)">
          {{ result.report.memberActionPlan.createCount }}
        </p>
      </article>

      <article class="rounded-md bg-slate-50 p-4">
        <p class="text-xs font-medium text-slate-500">Update members</p>
        <p class="mt-1 font-condensed text-2xl font-semibold text-(--color-brand-navy)">
          {{ result.report.memberActionPlan.updateCount }}
        </p>
      </article>

      <article class="rounded-md bg-slate-50 p-4">
        <p class="text-xs font-medium text-slate-500">Inactivate members</p>
        <p class="mt-1 font-condensed text-2xl font-semibold text-(--color-brand-navy)">
          {{ result.report.memberActionPlan.inactivateCount }}
        </p>
      </article>

      <article class="rounded-md bg-slate-50 p-4">
        <p class="text-xs font-medium text-slate-500">History rows</p>
        <p class="mt-1 font-condensed text-2xl font-semibold text-(--color-brand-navy)">
          {{ result.report.historyActionPlan.rowCount }}
        </p>
      </article>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <article class="rounded-md border border-(--color-border) p-4">
        <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">
          Workbook rows
        </h3>

        <dl class="mt-3 space-y-2 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-slate-600">Active</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ result.report.counts.raw.active }}
            </dd>
          </div>

          <div class="flex justify-between gap-4">
            <dt class="text-slate-600">Leavers</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ result.report.counts.raw.leavers }}
            </dd>
          </div>

          <div class="flex justify-between gap-4">
            <dt class="text-slate-600">Promotions</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ result.report.counts.raw.promotions }}
            </dd>
          </div>

          <div class="flex justify-between gap-4 border-t border-(--color-border) pt-2">
            <dt class="text-slate-600">Existing members matched</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ result.report.counts.existingMembers }}
            </dd>
          </div>
        </dl>
      </article>

      <article class="rounded-md border border-(--color-border) p-4">
        <h3 class="font-condensed text-lg font-semibold text-(--color-brand-navy)">
          Planned changes
        </h3>

        <dl class="mt-3 space-y-2 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-slate-600">Core field updates</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ result.report.coreMemberFieldUpdatePlan.updateCount }}
            </dd>
          </div>

          <div class="flex justify-between gap-4">
            <dt class="text-slate-600">Sensitive detail updates</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ result.report.sensitiveDetailPlan.updateCount }}
            </dd>
          </div>

          <div class="flex justify-between gap-4">
            <dt class="text-slate-600">Duplicate employee numbers</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ duplicateCount }}
            </dd>
          </div>

          <div class="flex justify-between gap-4">
            <dt class="text-slate-600">Cross-sheet overlaps</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ overlapCount }}
            </dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ImportDryRunResponse } from '@/types/import'

const props = defineProps<{
  result: ImportDryRunResponse
}>()

const duplicateCount = computed(() => {
  const duplicates = props.result.report.duplicates

  return (
    duplicates.active.duplicateCount +
    duplicates.leavers.duplicateCount +
    duplicates.promotions.duplicateCount
  )
})

const overlapCount = computed(() => props.result.report.overlaps.totalOverlapCount)
</script>
