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
              class="rounded-md bg-(--color-brand-red) px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled
            >
              Run Dry Run
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
  </main>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

const selectedWorkbook = ref<File | null>(null)

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

function handleWorkbookChange(event: Event) {
  const input = event.target

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  selectedWorkbook.value = input.files?.[0] ?? null
}

function clearSelectedWorkbook() {
  selectedWorkbook.value = null
}
</script>
