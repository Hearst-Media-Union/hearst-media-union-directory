<template>
  <section class="pt-3 pb-6 md:pt-4 md:pb-8">
    <div class="space-y-3">
      <header>
        <h1 class="font-condensed text-page-title font-semibold text-(--color-brand-navy)">
          Directory
        </h1>
      </header>

      <DirectoryToolbar
        v-model:search-term="searchTerm"
        :has-active-filters="hasActiveFilters"
        @reset="resetFilters"
      />

      <p class="font-sans text-meta text-(--color-brand-navy)">
        Showing {{ filteredMembers.length }} members
      </p>

      <DirectoryDesktopTable />

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
import DirectoryDesktopTable from '@/components/directory/DirectoryDesktopTable.vue'
import {
  useDirectoryFilters,
  type DirectoryFilterableMember,
} from '@/composables/useDirectoryFilters'

const members = computed<DirectoryFilterableMember[]>(() => [])

const { searchTerm, filteredMembers, hasActiveFilters, resetFilters } = useDirectoryFilters(members)
</script>
