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
  departmentFilter?: string
  locationFilter?: string
  committeeFilter?: string
  roleFilter?: string
}>()

const emit = defineEmits<{
  'update:departmentFilter': [value: string]
}>()

function handleFilterClick(filterKey: string) {
  if (filterKey !== 'department') {
    return
  }

  emit('update:departmentFilter', props.departmentFilter === 'Assistant' ? '' : 'Assistant')
}

const filters = computed(() => [
  { label: 'Department', key: 'department', value: props.departmentFilter },
  { label: 'Location', key: 'location', value: props.locationFilter },
  { label: 'Committee', key: 'committee', value: props.committeeFilter },
  { label: 'Role', key: 'role', value: props.roleFilter },
])
</script>
