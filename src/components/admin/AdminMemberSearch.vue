<template>
  <div class="space-y-2">
    <label :for="inputId" class="block text-sm font-medium text-(--color-brand-navy)">
      Member
    </label>

    <div v-if="selectedMember" class="rounded border border-(--color-border) bg-white px-3 py-2">
      <p class="text-sm font-medium text-slate-800">{{ selectedMember.name }}</p>
      <p class="text-xs text-slate-500">{{ selectedMember.email || 'No email listed' }}</p>

      <button
        type="button"
        class="mt-2 text-xs font-medium text-(--color-brand-red) hover:underline"
        @click="clearSelectedMember"
      >
        Change
      </button>
    </div>

    <div v-else class="relative">
      <input
        :id="inputId"
        v-model="searchTerm"
        type="search"
        class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm"
        placeholder="Search by name or email"
      />

      <div
        v-if="searchTerm.length > 0"
        class="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded border border-(--color-border) bg-white shadow-sm"
      >
        <button
          v-for="member in filteredMembers"
          :key="member.id"
          type="button"
          class="block w-full px-3 py-2 text-left hover:bg-slate-50"
          @click="selectMember(member)"
        >
          <p class="text-sm font-medium text-slate-800">{{ member.name }}</p>
          <p class="text-xs text-slate-500">{{ member.email || 'No email listed' }}</p>
        </button>

        <p v-if="filteredMembers.length === 0" class="px-3 py-2 text-sm text-slate-600">
          No members found.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MemberListItem } from '@/types/member'

const props = defineProps<{
  members: MemberListItem[]
  selectedMemberId: string
}>()

const emit = defineEmits<{
  'update:selectedMemberId': [memberId: string]
}>()

const searchTerm = ref('')
const inputId = 'admin-member-search'

const selectedMember = computed(
  () => props.members.find((member) => member.id === props.selectedMemberId) ?? null,
)

const filteredMembers = computed(() => {
  const normalizedSearchTerm = searchTerm.value.trim().toLowerCase()

  if (normalizedSearchTerm.length === 0) {
    return []
  }

  return props.members
    .filter((member) => {
      const searchableText = `${member.name} ${member.email}`.toLowerCase()

      return searchableText.includes(normalizedSearchTerm)
    })
    .slice(0, 8)
})

function selectMember(member: MemberListItem) {
  emit('update:selectedMemberId', member.id)
  searchTerm.value = ''
}

function clearSelectedMember() {
  emit('update:selectedMemberId', '')
}
</script>
