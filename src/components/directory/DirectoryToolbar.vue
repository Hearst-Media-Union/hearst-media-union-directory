<template>
  <div class="space-y-3">
    <div class="relative">
      <img
        src="/images/icons/search-icon-navy.png"
        alt=""
        class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
      />

      <BaseInput
        id="directory-search"
        v-model="searchValue"
        class="[&_input]:min-h-12 [&_input]:w-full [&_input]:rounded-lg [&_input]:pl-10 [&_input]:text-nav"
        placeholder="Search members by name, email, phone, brand..."
      />
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="flex min-h-10 min-w-36 items-center justify-between gap-4 rounded-lg border border-(--color-app-border) bg-(--color-app-surface) px-4 font-sans text-table font-medium text-(--color-brand-navy)"
      >
        <span>{{ filter }}</span>

        <img src="/images/icons/caret-navy.png" alt="" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const searchValue = ref('')

const filters = ['Department', 'Location', 'Committee', 'Role']
</script>
