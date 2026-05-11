<template>
  <div class="space-y-3">
    <DirectorySearchInput v-model="model" />

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
import { computed } from 'vue'
import DirectorySearchInput from '@/components/directory/DirectorySearchInput.vue'

const props = defineProps<{
  searchTerm: string
}>()

const emit = defineEmits<{
  'update:searchTerm': [value: string]
}>()

const model = computed({
  get: () => props.searchTerm,
  set: (value) => emit('update:searchTerm', value),
})

const filters = ['Department', 'Location', 'Committee', 'Role']
</script>
