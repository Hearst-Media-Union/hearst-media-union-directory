<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="filter in filters"
      :key="filter.key"
      type="button"
      class="flex min-h-10 min-w-36 items-center justify-between gap-4 rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 font-sans text-table font-medium text-(--color-brand-navy) transition-colors hover:bg-(--color-app-hover-surface)"
    >
      <span>{{ filter.label }}</span>

      <img src="/images/icons/caret-navy.png" alt="" class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
const filters = [
  { label: 'Department', key: 'department' },
  { label: 'Location', key: 'location' },
  { label: 'Committee', key: 'committee' },
  { label: 'Role', key: 'role' },
]
</script>
