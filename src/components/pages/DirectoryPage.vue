<template>
  <section class="pt-3 pb-6 md:pt-4 md:pb-8">
    <div class="space-y-3">
      <header>
        <h1 class="font-condensed text-page-title font-semibold text-(--color-brand-navy)">
          Directory
        </h1>
      </header>

      <div
        class="flex min-h-12 items-center rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 text-table text-(--color-brand-navy)"
      >
        Search
      </div>

      <div class="flex flex-wrap gap-2">
        <div
          class="flex min-h-10 items-center rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 text-table text-(--color-brand-navy)"
        >
          Department
        </div>

        <div
          class="flex min-h-10 items-center rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 text-table text-(--color-brand-navy)"
        >
          Location
        </div>

        <div
          class="flex min-h-10 items-center rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 text-table text-(--color-brand-navy)"
        >
          Committee
        </div>

        <div
          class="flex min-h-10 items-center rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 text-table text-(--color-brand-navy)"
        >
          Role
        </div>
      </div>

      <p class="text-meta text-(--color-brand-navy)">Showing {{ memberCount }} members</p>

      <div
        class="hidden min-h-96 rounded-lg border border-(--color-app-border) bg-(--color-app-surface) md:block"
      ></div>

      <div
        class="min-h-48 rounded-lg border border-(--color-app-border) bg-(--color-app-surface) md:hidden"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const memberCount = 0
</script>
