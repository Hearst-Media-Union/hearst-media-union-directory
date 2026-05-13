import { ref } from 'vue'
import type { DirectoryFilterableMember } from '@/composables/useDirectoryFilters'

const MODAL_CLOSE_ANIMATION_MS = 220

export function useMemberModal() {
  const selectedMember = ref<DirectoryFilterableMember | null>(null)
  const isMemberModalOpen = ref(false)

  function openMemberModal(member: DirectoryFilterableMember) {
    selectedMember.value = member
    isMemberModalOpen.value = true
  }

  function closeMemberModal() {
    isMemberModalOpen.value = false

    window.setTimeout(() => {
      selectedMember.value = null
    }, MODAL_CLOSE_ANIMATION_MS)
  }

  return {
    selectedMember,
    isMemberModalOpen,
    openMemberModal,
    closeMemberModal,
  }
}
