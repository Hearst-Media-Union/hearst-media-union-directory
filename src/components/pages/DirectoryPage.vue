<template>
  <section class="pt-3 pb-6 md:pt-4 md:pb-8">
    <div class="space-y-3">
      <header>
        <h1 class="font-condensed text-page-title font-semibold text-(--color-brand-navy)">
          Directory
        </h1>
      </header>

      <DirectoryToolbar />

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
import DirectoryToolbar from '@/components/directory/DirectoryToolbar.vue'
const memberCount = 0
</script>
