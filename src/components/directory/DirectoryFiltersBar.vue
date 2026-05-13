<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="filter in filters"
      :key="filter.key"
      type="button"
      class="flex min-h-10 min-w-36 items-center justify-between gap-4 rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 font-sans text-table font-medium text-(--color-brand-navy) transition-colors hover:bg-(--color-app-hover-surface)"
      @click="handleFilterClick(filter.key)"
    >
      <span>
        {{ filter.value || filter.label }}
      </span>

      <img src="/images/icons/caret-navy.png" alt="" class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  brandFilter?: string
  locationFilter?: string
  committeeFilter?: string
  unitTitleFilter?: string
}>()

const emit = defineEmits<{
  'update:brandFilter': [value: string]
  'update:locationFilter': [value: string]
  'update:committeeFilter': [value: string]
  'update:unitTitleFilter': [value: string]
}>()

function toggleFilter(currentValue: string | undefined, nextValue: string) {
  return currentValue === nextValue ? '' : nextValue
}

function handleFilterClick(filterKey: string) {
  if (filterKey === 'brand') {
    emit('update:brandFilter', toggleFilter(props.brandFilter, 'Car & Driver'))
    return
  }

  if (filterKey === 'location') {
    emit('update:locationFilter', toggleFilter(props.locationFilter, 'Ann Arbor, MI'))
    return
  }

  if (filterKey === 'committee') {
    emit('update:committeeFilter', toggleFilter(props.committeeFilter, 'LMC'))
    return
  }

  if (filterKey === 'unitTitle') {
    emit('update:unitTitleFilter', toggleFilter(props.unitTitleFilter, 'Assistant'))
  }
}

const filters = computed(() => [
  { label: 'Brand', key: 'brand', value: props.brandFilter },
  { label: 'Location', key: 'location', value: props.locationFilter },
  { label: 'Committee', key: 'committee', value: props.committeeFilter },
  { label: 'Unit Title', key: 'unitTitle', value: props.unitTitleFilter },
])
</script>
