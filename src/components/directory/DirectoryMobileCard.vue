<template>
  <button
    type="button"
    class="w-full border-b border-(--color-app-border) px-0 py-5 text-left font-sans text-(--color-app-text) transition-colors hover:bg-(--color-app-row-hover)"
    @click="emit('select', member)"
  >
    <span class="block text-base font-semibold text-(--color-brand-navy)">
      {{ member.name }}
    </span>

    <span class="mt-1 block text-sm text-(--color-app-text)">
      {{ member.brand }}
    </span>

    <span class="mt-1 block text-sm text-(--color-app-text)">
      {{ member.title }}
    </span>

    <span class="mt-2 block text-sm text-(--color-app-muted-text)">
      {{ member.unit }} • {{ member.area }}
    </span>

    <div v-if="member.committees.length > 0" class="mt-3 flex flex-wrap gap-1">
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

const emit = defineEmits<{
  select: [member: DirectoryFilterableMember]
}>()
</script>
