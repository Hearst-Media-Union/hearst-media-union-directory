<template>
  <div class="space-y-3">
    <DirectorySearchInput v-model="searchValue" />

    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="flex min-h-10 min-w-36 items-center justify-between gap-4 rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 font-sans text-table font-medium text-(--color-brand-navy)"
      >
        <span>{{ filter }}</span>

        <img src="/images/icons/caret-navy.png" alt="" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DirectorySearchInput from '@/components/directory/DirectorySearchInput.vue'

const searchValue = ref('')

const filters = ['Department', 'Location', 'Committee', 'Role']
</script>
