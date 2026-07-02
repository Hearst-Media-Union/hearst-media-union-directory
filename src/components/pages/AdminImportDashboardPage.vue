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
        <p class="mt-4 text-xs font-medium text-slate-500">Coming later</p>
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
