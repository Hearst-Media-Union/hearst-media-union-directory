<template>
  <div class="space-y-3">
    <DirectorySearchInput v-model="model" />

    <div class="flex flex-wrap items-center gap-2">
      <DirectoryFiltersBar
        :brand-filter="brandFilter"
        :location-filter="locationFilter"
        :committee-filter="committeeFilter"
        :unit-title-filter="unitTitleFilter"
        @update:brand-filter="emit('update:brandFilter', $event)"
        @update:location-filter="emit('update:locationFilter', $event)"
        @update:committee-filter="emit('update:committeeFilter', $event)"
        @update:unit-title-filter="emit('update:unitTitleFilter', $event)"
      />

      <button
        v-if="hasActiveFilters"
        type="button"
        class="min-h-10 px-2 font-sans text-meta font-medium text-(--color-brand-navy) underline underline-offset-2"
        @click="emit('reset')"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DirectorySearchInput from '@/components/directory/DirectorySearchInput.vue'
import DirectoryFiltersBar from '@/components/directory/DirectoryFiltersBar.vue'

const props = defineProps<{
  searchTerm: string
  brandFilter: string
  locationFilter: string
  committeeFilter: string
  unitTitleFilter: string
  hasActiveFilters?: boolean
}>()

const emit = defineEmits<{
  'update:searchTerm': [value: string]
  'update:brandFilter': [value: string]
  'update:locationFilter': [value: string]
  'update:committeeFilter': [value: string]
  'update:unitTitleFilter': [value: string]
  reset: []
}>()

const model = computed({
  get: () => props.searchTerm,
  set: (value) => emit('update:searchTerm', value),
})
</script>
