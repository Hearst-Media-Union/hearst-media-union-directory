<template>
  <div class="space-y-3">
    <DirectorySearchInput v-model="model" />

    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="min-h-10 rounded-md border border-(--color-app-border) bg-white px-3 font-sans text-sm font-medium text-(--color-brand-navy) md:hidden"
        @click="openMobileFilterDrawer"
      >
        Filters
      </button>
      <DirectoryFiltersBar
        class="hidden md:flex"
        :brand-filter="brandFilter"
        :location-filter="locationFilter"
        :committee-filter="committeeFilter"
        :unit-title-filter="unitTitleFilter"
        :brand-options="brandOptions"
        :location-options="locationOptions"
        :committee-options="committeeOptions"
        :unit-title-options="unitTitleOptions"
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
    <MobileFilterDrawer
      :is-open="isMobileFilterDrawerOpen"
      :brand-filter="brandFilter"
      :location-filter="locationFilter"
      :committee-filter="committeeFilter"
      :unit-title-filter="unitTitleFilter"
      :brand-options="brandOptions"
      :location-options="locationOptions"
      :committee-options="committeeOptions"
      :unit-title-options="unitTitleOptions"
      :has-active-filters="hasActiveFilters"
      @update:brand-filter="emit('update:brandFilter', $event)"
      @update:location-filter="emit('update:locationFilter', $event)"
      @update:committee-filter="emit('update:committeeFilter', $event)"
      @update:unit-title-filter="emit('update:unitTitleFilter', $event)"
      @reset="emit('reset')"
      @apply="applyMobileFilters"
      @close="closeMobileFilterDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MobileFilterDrawer from '@/components/directory/MobileFilterDrawer.vue'
import DirectorySearchInput from '@/components/directory/DirectorySearchInput.vue'
import DirectoryFiltersBar from '@/components/directory/DirectoryFiltersBar.vue'

const props = withDefaults(
  defineProps<{
    searchTerm: string
    brandFilter: string
    locationFilter: string
    committeeFilter: string
    unitTitleFilter: string
    brandOptions?: string[]
    locationOptions?: string[]
    committeeOptions?: string[]
    unitTitleOptions?: string[]
    hasActiveFilters?: boolean
  }>(),
  {
    brandOptions: () => [],
    locationOptions: () => [],
    committeeOptions: () => [],
    unitTitleOptions: () => [],
    hasActiveFilters: false,
  },
)

const emit = defineEmits<{
  'update:searchTerm': [value: string]
  'update:brandFilter': [value: string]
  'update:locationFilter': [value: string]
  'update:committeeFilter': [value: string]
  'update:unitTitleFilter': [value: string]
  reset: []
}>()

const isMobileFilterDrawerOpen = ref(false)

function openMobileFilterDrawer() {
  isMobileFilterDrawerOpen.value = true
}

function closeMobileFilterDrawer() {
  isMobileFilterDrawerOpen.value = false
}

function applyMobileFilters() {
  closeMobileFilterDrawer()
}

const model = computed({
  get: () => props.searchTerm,
  set: (value) => emit('update:searchTerm', value),
})
</script>
