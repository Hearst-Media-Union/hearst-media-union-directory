<template>
  <div class="space-y-3">
    <DirectorySearchInput v-model="model" />

    <div class="flex flex-wrap items-center gap-2">
      <DirectoryFiltersBar
        :department-filter="departmentFilter"
        :location-filter="locationFilter"
        :committee-filter="committeeFilter"
        :role-filter="roleFilter"
        @update:department-filter="emit('update:departmentFilter', $event)"
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
  departmentFilter: string
  locationFilter: string
  committeeFilter: string
  roleFilter: string
  hasActiveFilters?: boolean
}>()

const emit = defineEmits<{
  'update:searchTerm': [value: string]
  'update:departmentFilter': [value: string]
  reset: []
}>()

const model = computed({
  get: () => props.searchTerm,
  set: (value) => emit('update:searchTerm', value),
})
</script>
