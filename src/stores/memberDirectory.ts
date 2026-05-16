import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { MemberListItem } from '@/types/member'
import { fetchMemberDirectory } from '@/services/memberDirectory'

export const useMemberDirectoryStore = defineStore('memberDirectory', () => {
  const members = ref<MemberListItem[]>([])
  const isLoading = ref(false)
  const hasLoadedMembers = ref(false)
  const errorMessage = ref<string | null>(null)

  const memberCount = computed(() => members.value.length)
  const hasNoMembers = computed(() => hasLoadedMembers.value && memberCount.value === 0)

  function setMembers(nextMembers: MemberListItem[]) {
    members.value = nextMembers
  }

  function startLoading() {
    isLoading.value = true
    errorMessage.value = null
  }

  function finishLoading() {
    isLoading.value = false
    hasLoadedMembers.value = true
  }

  function setError(message: string) {
    errorMessage.value = message
  }

  function clearError() {
    errorMessage.value = null
  }

  async function loadMembers() {
    if (hasLoadedMembers.value) {
      return
    }

    startLoading()

    try {
      const nextMembers = await fetchMemberDirectory()

      setMembers(nextMembers)
    } catch {
      setError('Unable to load directory members.')
    } finally {
      finishLoading()
    }
  }

  return {
    members,
    isLoading,
    hasLoadedMembers,
    errorMessage,
    memberCount,
    hasNoMembers,
    setMembers,
    startLoading,
    finishLoading,
    setError,
    clearError,
    loadMembers,
  }
})
