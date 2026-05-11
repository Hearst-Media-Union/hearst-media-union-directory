<template>
  <section class="pt-3 pb-6 md:pt-4 md:pb-8">
    <div class="space-y-3">
      <header>
        <h1 class="font-condensed text-page-title font-semibold text-(--color-brand-navy)">
          Directory
        </h1>
      </header>

      <DirectoryToolbar v-model:search-term="searchTerm" />

      <p class="font-sans text-meta text-(--color-brand-navy)">
        Showing {{ filteredMembers.length }} members
      </p>

      <div class="hidden bg-(--color-app-surface) md:block">
        <div
          class="grid min-h-14 grid-cols-[1.4fr_1fr_1.4fr_1fr_1fr_1.2fr] items-center border-b border-(--color-app-border) px-4 font-condensed text-table font-semibold text-(--color-brand-navy)"
        >
          <span>Name</span>
          <span>Brand</span>
          <span>Job Title</span>
          <span>Unit Title</span>
          <span>Area/Office</span>
          <span>Committees</span>
        </div>
      </div>

      <div class="space-y-3 md:hidden">
        <div
          class="min-h-28 rounded-lg border border-(--color-app-border) bg-(--color-app-surface)"
        ></div>

        <div
          class="min-h-28 rounded-lg border border-(--color-app-border) bg-(--color-app-surface)"
        ></div>

        <div
          class="min-h-28 rounded-lg border border-(--color-app-border) bg-(--color-app-surface)"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DirectoryToolbar from '@/components/directory/DirectoryToolbar.vue'
import {
  useDirectoryFilters,
  type DirectoryFilterableMember,
} from '@/composables/useDirectoryFilters'

const members = computed<DirectoryFilterableMember[]>(() => [])

const { searchTerm, filteredMembers } = useDirectoryFilters(members)
</script>
