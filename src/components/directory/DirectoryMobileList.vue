<template>
  <div v-if="members.length > 0" class="space-y-3">
    <DirectoryMobileCard
      v-for="member in members"
      :key="member.name"
      :member="member"
      @select="emit('select', $event)"
    />
  </div>

  <div
    v-else
    class="rounded-lg border border-(--color-app-border) bg-white p-6 text-center font-sans text-sm text-(--color-app-muted-text)"
  >
    No members match the current search or filters.
  </div>
</template>

<script setup lang="ts">
import DirectoryMobileCard from '@/components/directory/DirectoryMobileCard.vue'
import type { DirectoryFilterableMember } from '@/composables/useDirectoryFilters'

defineProps<{
  members: DirectoryFilterableMember[]
}>()

const emit = defineEmits<{
  select: [member: DirectoryFilterableMember]
}>()
</script>
