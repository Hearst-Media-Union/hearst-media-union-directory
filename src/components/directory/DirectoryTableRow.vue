<template>
  <button
    type="button"
    class="directory-table-grid grid min-h-14 w-full items-center border-b border-(--color-app-border) px-4 text-left font-sans text-table text-(--color-app-text) transition-colors hover:bg-(--color-app-row-hover)"
  >
    <span class="font-semibold text-(--color-brand-navy)">
      {{ member.name }}
    </span>

    <span class="min-w-0 truncate pr-3">{{ member.brand }}</span>

    <span class="min-w-0 truncate pr-3">{{ member.title }}</span>

    <span>{{ member.unit }}</span>

    <span>{{ member.area }}</span>

    <div class="flex flex-wrap gap-1">
      <BaseTag v-for="committee in member.committees" :key="committee" :committee="committee" />
    </div>
  </button>
</template>

<script setup lang="ts">
import BaseTag from '@/components/ui/BaseTag.vue'
import type { DirectoryFilterableMember } from '@/composables/useDirectoryFilters'

defineProps<{
  member: DirectoryFilterableMember
}>()
</script>
