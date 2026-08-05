<template>
  <main class="space-y-6 py-8">
    <section class="space-y-2">
      <p class="font-label text-xs tracking-wide text-(--color-brand-red)">Admin</p>
      <h1 class="font-condensed text-3xl font-semibold text-(--color-brand-navy)">
        Import Dashboard
      </h1>
      <p class="max-w-2xl text-sm text-slate-600">
        Review member import workflows, dry runs, and import history.
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article class="rounded-lg border border-(--color-border) bg-white p-5 shadow-sm">
        <p class="font-condensed text-xl font-semibold text-(--color-brand-navy)">
          Workbook Upload
        </p>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          Upload monthly HR workbooks for validation before applying changes.
        </p>

        <label
          class="mt-4 flex cursor-pointer flex-col gap-2 rounded-md border border-dashed border-(--color-border) bg-slate-50 p-4 text-sm transition-colors hover:border-(--color-brand-red)"
        >
          <span class="font-medium text-(--color-brand-navy)">Select workbook</span>
          <span class="text-xs text-slate-500">Accepted format: .xlsx</span>
          <input class="sr-only" type="file" accept=".xlsx" @change="handleWorkbookChange" />
        </label>

        <div v-if="selectedWorkbook" class="mt-4 space-y-3 rounded-md bg-slate-50 p-4">
          <div class="space-y-1 text-sm">
            <p class="font-medium text-(--color-brand-navy)">{{ selectedWorkbookName }}</p>
            <p class="text-xs text-slate-500">
              {{ selectedWorkbookSize }} · Last modified {{ selectedWorkbookLastModified }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-md bg-(--color-brand-red) px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300 hover:cursor-pointer"
              :disabled="isRunningDryRun"
              @click="runDryRun"
            >
              {{ isRunningDryRun ? 'Running Dry Run…' : 'Run Dry Run' }}
            </button>

            <button
              type="button"
              class="rounded-md border border-(--color-border) px-3 py-2 text-sm font-medium text-(--color-brand-navy) hover:border-(--color-brand-red)"
              @click="clearSelectedWorkbook"
            >
              Clear
            </button>
          </div>
        </div>

        <p v-else class="mt-3 text-xs font-medium text-slate-500">No workbook selected</p>
      </article>

      <article class="rounded-lg border border-(--color-border) bg-white p-5 shadow-sm">
        <p class="font-condensed text-xl font-semibold text-(--color-brand-navy)">Dry-Run Review</p>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          Review planned member updates, sensitive detail changes, and warnings before import.
        </p>
        <p class="mt-4 text-xs font-medium text-slate-500">Coming later</p>
      </article>

      <article class="rounded-lg border border-(--color-border) bg-white p-5 shadow-sm">
        <p class="font-condensed text-xl font-semibold text-(--color-brand-navy)">Import History</p>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          View completed import batches and past import results.
        </p>
        <p class="mt-4 text-xs font-medium text-slate-500">Coming later</p>
      </article>
    </section>
    <p
      v-if="dryRunError"
      class="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      {{ dryRunError }}
    </p>

    <section
      v-if="dryRunResult"
      class="space-y-5 rounded-lg border border-(--color-border) bg-white p-5 shadow-sm"
    >
      <div class="space-y-1">
        <p class="font-label text-xs tracking-wide text-(--color-brand-red)">Dry Run</p>
        <h2 class="font-condensed text-2xl font-semibold text-(--color-brand-navy)">
          {{ dryRunResult.workbookFile.name }}
        </h2>
        <p class="text-sm text-slate-600">
          Active sheet: {{ dryRunResult.report.workbook.matchedSheetNames.active }}
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article class="rounded-md bg-slate-50 p-4">
          <p class="text-xs font-medium text-slate-500">Create members</p>
          <p class="mt-1 font-condensed text-2xl font-semibold text-(--color-brand-navy)">
            {{ dryRunResult.report.memberActionPlan.createCount }}
          </p>
        </article>

        <article class="rounded-md bg-slate-50 p-4">
          <p class="text-xs font-medium text-slate-500">Update members</p>
          <p class="mt-1 font-condensed text-2xl font-semibold text-(--color-brand-navy)">
            {{ dryRunResult.report.memberActionPlan.updateCount }}
          </p>
        </article>

        <article class="rounded-md bg-slate-50 p-4">
          <p class="text-xs font-medium text-slate-500">Inactivate members</p>
          <p class="mt-1 font-condensed text-2xl font-semibold text-(--color-brand-navy)">
            {{ dryRunResult.report.memberActionPlan.inactivateCount }}
          </p>
        </article>

        <article class="rounded-md bg-slate-50 p-4">
          <p class="text-xs font-medium text-slate-500">History rows</p>
          <p class="mt-1 font-condensed text-2xl font-semibold text-(--color-brand-navy)">
            {{ dryRunResult.report.historyActionPlan.rowCount }}
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
                {{ dryRunResult.report.counts.raw.active }}
              </dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="text-slate-600">Leavers</dt>
              <dd class="font-medium text-(--color-brand-navy)">
                {{ dryRunResult.report.counts.raw.leavers }}
              </dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="text-slate-600">Promotions</dt>
              <dd class="font-medium text-(--color-brand-navy)">
                {{ dryRunResult.report.counts.raw.promotions }}
              </dd>
            </div>

            <div class="flex justify-between gap-4 border-t border-(--color-border) pt-2">
              <dt class="text-slate-600">Existing members matched</dt>
              <dd class="font-medium text-(--color-brand-navy)">
                {{ dryRunResult.report.counts.existingMembers }}
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
                {{ dryRunResult.report.coreMemberFieldUpdatePlan.updateCount }}
              </dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="text-slate-600">Sensitive detail updates</dt>
              <dd class="font-medium text-(--color-brand-navy)">
                {{ dryRunResult.report.sensitiveDetailPlan.updateCount }}
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
  </main>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { ImportDryRunResponse } from '@/types/import'

const selectedWorkbook = ref<File | null>(null)
const isRunningDryRun = ref(false)
const dryRunError = ref('')
const dryRunResult = ref<ImportDryRunResponse | null>(null)

const selectedWorkbookName = computed(() => selectedWorkbook.value?.name ?? '')

const selectedWorkbookSize = computed(() => {
  if (!selectedWorkbook.value) {
    return ''
  }

  return `${(selectedWorkbook.value.size / 1024 / 1024).toFixed(2)} MB`
})

const selectedWorkbookLastModified = computed(() => {
  if (!selectedWorkbook.value) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(selectedWorkbook.value.lastModified)
})

const duplicateCount = computed(() => {
  const duplicates = dryRunResult.value?.report.duplicates

  if (!duplicates) {
    return 0
  }

  return (
    duplicates.active.duplicateCount +
    duplicates.leavers.duplicateCount +
    duplicates.promotions.duplicateCount
  )
})

const overlapCount = computed(() => dryRunResult.value?.report.overlaps.totalOverlapCount ?? 0)

function handleWorkbookChange(event: Event) {
  const input = event.target

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  selectedWorkbook.value = input.files?.[0] ?? null
  dryRunError.value = ''
  dryRunResult.value = null
}

function clearSelectedWorkbook() {
  selectedWorkbook.value = null
  dryRunError.value = ''
  dryRunResult.value = null
}

async function runDryRun() {
  if (!selectedWorkbook.value || isRunningDryRun.value) {
    return
  }

  isRunningDryRun.value = true
  dryRunError.value = ''
  dryRunResult.value = null

  const formData = new FormData()
  formData.append('workbook', selectedWorkbook.value)

  try {
    const { data, error } = await supabase.functions.invoke<ImportDryRunResponse>(
      'import-dry-run',
      {
        body: formData,
      },
    )

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error('The dry run completed without returning a report.')
    }

    dryRunResult.value = data
  } catch (error: unknown) {
    dryRunError.value = error instanceof Error ? error.message : 'Unable to complete the dry run.'
  } finally {
    isRunningDryRun.value = false
  }
}
</script>
