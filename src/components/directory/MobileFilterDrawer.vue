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

    <div class="space-y-6 pb-6">
      <fieldset class="space-y-2">
        <legend class="font-label text-xs tracking-wide text-(--color-app-muted-text)">
          Brand
        </legend>

        <select
          :value="brandFilter"
          class="min-h-10 w-full rounded-md border border-(--color-app-border) bg-white px-3 font-sans text-sm text-(--color-brand-navy)"
          @change="emit('update:brandFilter', getSelectValue($event))"
        >
          <option value="">All brands</option>

          <option v-for="option in brandOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </fieldset>

      <fieldset class="space-y-2">
        <legend class="font-label text-xs tracking-wide text-(--color-app-muted-text)">
          Location
        </legend>

        <select
          :value="locationFilter"
          class="min-h-10 w-full rounded-md border border-(--color-app-border) bg-white px-3 font-sans text-sm text-(--color-brand-navy)"
          @change="emit('update:locationFilter', getSelectValue($event))"
        >
          <option value="">All locations</option>

          <option v-for="option in locationOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </fieldset>

      <fieldset class="space-y-2">
        <legend class="font-label text-xs tracking-wide text-(--color-app-muted-text)">
          Committee
        </legend>

        <select
          :value="committeeFilter"
          class="min-h-10 w-full rounded-md border border-(--color-app-border) bg-white px-3 font-sans text-sm text-(--color-brand-navy)"
          @change="emit('update:committeeFilter', getSelectValue($event))"
        >
          <option value="">All committees</option>

          <option v-for="option in committeeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </fieldset>

      <fieldset class="space-y-2">
        <legend class="font-label text-xs tracking-wide text-(--color-app-muted-text)">
          Unit Title
        </legend>

        <select
          :value="unitTitleFilter"
          class="min-h-10 w-full rounded-md border border-(--color-app-border) bg-white px-3 font-sans text-sm text-(--color-brand-navy)"
          @change="emit('update:unitTitleFilter', getSelectValue($event))"
        >
          <option value="">All unit titles</option>

          <option v-for="option in unitTitleOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </fieldset>
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

withDefaults(
  defineProps<{
    isOpen: boolean
    hasActiveFilters: boolean
    brandFilter: string
    locationFilter: string
    committeeFilter: string
    unitTitleFilter: string
    brandOptions?: string[]
    locationOptions?: string[]
    committeeOptions?: string[]
    unitTitleOptions?: string[]
  }>(),
  {
    brandOptions: () => [],
    locationOptions: () => [],
    committeeOptions: () => [],
    unitTitleOptions: () => [],
  },
)

const emit = defineEmits<{
  'update:brandFilter': [value: string]
  'update:locationFilter': [value: string]
  'update:committeeFilter': [value: string]
  'update:unitTitleFilter': [value: string]
  close: []
  reset: []
  apply: []
}>()

function getSelectValue(event: Event) {
  return event.target instanceof HTMLSelectElement ? event.target.value : ''
}
</script>
