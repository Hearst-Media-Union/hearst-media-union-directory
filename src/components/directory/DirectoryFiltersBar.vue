<template>
  <div class="flex flex-wrap items-center gap-2">
    <div v-for="filter in filters" :key="filter.key" class="relative">
      <button
        type="button"
        class="flex min-h-10 min-w-36 items-center justify-between gap-4 rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 font-sans text-table font-medium text-(--color-brand-navy) transition-colors hover:bg-(--color-app-hover-surface)"
        @click="toggleOpenFilter(filter.key)"
      >
        <span>
          {{ filter.value || filter.label }}
        </span>

        <img src="/images/icons/caret-navy.png" alt="" class="h-4 w-4" />
      </button>

      <div
        v-if="openFilterKey === filter.key"
        class="absolute left-0 top-11 z-20 min-w-48 rounded-lg border border-(--color-app-border) bg-(--color-app-surface) py-1 shadow-(--shadow-modal)"
      >
        <button
          v-for="option in filter.options"
          :key="option"
          type="button"
          class="block min-h-10 w-full px-4 text-left font-sans text-table text-(--color-brand-navy) hover:bg-(--color-app-hover-surface)"
          @click="selectFilterValue(filter.key, option)"
        >
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    brandFilter?: string
    locationFilter?: string
    committeeFilter?: string
    unitTitleFilter?: string
    brandOptions?: string[]
    locationOptions?: string[]
    committeeOptions?: string[]
    unitTitleOptions?: string[]
  }>(),
  {
    brandFilter: '',
    locationFilter: '',
    committeeFilter: '',
    unitTitleFilter: '',
    brandOptions: () => ['Car & Driver'],
    locationOptions: () => ['Ann Arbor, MI'],
    committeeOptions: () => ['LMC'],
    unitTitleOptions: () => ['Assistant'],
  },
)

const emit = defineEmits<{
  'update:brandFilter': [value: string]
  'update:locationFilter': [value: string]
  'update:committeeFilter': [value: string]
  'update:unitTitleFilter': [value: string]
}>()

const openFilterKey = ref('')

function toggleOpenFilter(filterKey: string) {
  openFilterKey.value = openFilterKey.value === filterKey ? '' : filterKey
}

function getNextFilterValue(currentValue: string, selectedValue: string) {
  return currentValue === selectedValue ? '' : selectedValue
}

function selectFilterValue(filterKey: string, selectedValue: string) {
  if (filterKey === 'brand') {
    emit('update:brandFilter', getNextFilterValue(props.brandFilter, selectedValue))
  }

  if (filterKey === 'location') {
    emit('update:locationFilter', getNextFilterValue(props.locationFilter, selectedValue))
  }

  if (filterKey === 'committee') {
    emit('update:committeeFilter', getNextFilterValue(props.committeeFilter, selectedValue))
  }

  if (filterKey === 'unitTitle') {
    emit('update:unitTitleFilter', getNextFilterValue(props.unitTitleFilter, selectedValue))
  }

  openFilterKey.value = ''
}

const filters = computed(() => [
  { label: 'Brand', key: 'brand', value: props.brandFilter, options: props.brandOptions },
  {
    label: 'Location',
    key: 'location',
    value: props.locationFilter,
    options: props.locationOptions,
  },
  {
    label: 'Committee',
    key: 'committee',
    value: props.committeeFilter,
    options: props.committeeOptions,
  },
  {
    label: 'Unit Title',
    key: 'unitTitle',
    value: props.unitTitleFilter,
    options: props.unitTitleOptions,
  },
])
</script>
