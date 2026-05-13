<template>
  <BaseDrawer :is-open="isOpen" labelled-by="mobile-filter-drawer-title" @close="emit('close')">
    <template #header>
      <div class="flex items-center justify-between">
        <h2
          id="mobile-filter-drawer-title"
          class="font-condensed text-xl font-semibold text-(--color-brand-navy)"
        >
          Filters
        </h2>

        <button
          v-if="hasActiveFilters"
          type="button"
          class="min-h-10 px-2 font-sans text-meta font-medium text-(--color-brand-navy) underline underline-offset-2"
          @click="emit('reset')"
        >
          Reset
        </button>
      </div>
    </template>

    <div class="py-2">
      <p class="font-sans text-sm text-(--color-app-muted-text)">
        Filter controls will be added here.
      </p>
    </div>

    <template #footer>
      <div class="border-t border-(--color-app-border) bg-(--color-app-surface) p-4">
        <button
          type="button"
          class="min-h-12 w-full rounded-md bg-(--color-brand-red) px-4 font-sans text-sm font-semibold text-white transition-colors hover:bg-(--color-brand-red-bright)"
          @click="emit('apply')"
        >
          Apply
        </button>
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

defineProps<{
  isOpen: boolean
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  close: []
  reset: []
  apply: []
}>()
</script>
