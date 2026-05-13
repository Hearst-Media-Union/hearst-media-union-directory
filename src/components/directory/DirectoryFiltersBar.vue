<template>
  <div ref="filtersBarElement" class="flex flex-wrap items-center gap-2">
    <div v-for="filter in filters" :key="filter.key" class="relative">
      <button
        type="button"
        class="flex min-h-10 min-w-36 items-center justify-between gap-4 rounded-lg border px-4 font-sans text-table font-medium transition-colors"
        :class="
          filter.value
            ? 'border-(--color-brand-navy) bg-(--color-app-hover-surface) text-(--color-brand-navy)'
            : 'border-(--color-app-border) bg-(--color-app-surface) text-(--color-brand-navy) hover:bg-(--color-app-hover-surface)'
        "
        :aria-expanded="openFilterKey === filter.key"
        @click="toggleOpenFilter(filter.key)"
      >
        <span>
          {{ filter.value || filter.label }}
        </span>

        <img
          src="/images/icons/caret-navy.png"
          alt=""
          class="h-4 w-4 transition-transform duration-150"
          :class="{ 'rotate-180': openFilterKey === filter.key }"
        />
      </button>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div
          v-if="openFilterKey === filter.key"
          class="absolute left-0 top-11 z-20 min-w-48 overflow-hidden rounded-lg border border-(--color-app-border) bg-(--color-app-surface) py-1 shadow-(--shadow-modal)"
        >
          <button
            v-for="option in filter.options"
            :key="option"
            type="button"
            class="block min-h-10 w-full px-4 text-left font-sans text-table text-(--color-brand-navy) transition-colors hover:bg-(--color-app-hover-surface)"
            :class="{
              'bg-(--color-app-hover-surface) font-semibold': filter.value === option,
            }"
            @click="selectFilterValue(filter.key, option)"
          >
            {{ option }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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

const filtersBarElement = ref<HTMLElement | null>(null)
const openFilterKey = ref('')

function closeOpenFilter() {
  openFilterKey.value = ''
}

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

  closeOpenFilter()
}

function handleDocumentClick(event: MouseEvent) {
  if (!filtersBarElement.value) {
    return
  }

  if (event.target instanceof Node && !filtersBarElement.value.contains(event.target)) {
    closeOpenFilter()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeOpenFilter()
  }
}

watch(
  () => [props.brandFilter, props.locationFilter, props.committeeFilter, props.unitTitleFilter],
  ([brandFilter, locationFilter, committeeFilter, unitTitleFilter]) => {
    const hasActiveFilter = [brandFilter, locationFilter, committeeFilter, unitTitleFilter].some(
      (filterValue) => (filterValue ?? '').length > 0,
    )

    if (!hasActiveFilter) {
      closeOpenFilter()
    }
  },
)

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('keydown', handleKeydown)
})

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
