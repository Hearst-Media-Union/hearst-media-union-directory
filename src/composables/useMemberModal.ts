import { computed, ref } from 'vue'
import type { DirectoryFilterableMember } from '@/composables/useDirectoryFilters'

export function useMemberModal() {
  const selectedMember = ref<DirectoryFilterableMember | null>(null)

  const isMemberModalOpen = computed(() => selectedMember.value !== null)

  function openMemberModal(member: DirectoryFilterableMember) {
    selectedMember.value = member
  }

  function closeMemberModal() {
    selectedMember.value = null
  }

  return {
    selectedMember,
    isMemberModalOpen,
    openMemberModal,
    closeMemberModal,
  }
}
