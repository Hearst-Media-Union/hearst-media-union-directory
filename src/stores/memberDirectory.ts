import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { MemberDetail, MemberListItem } from '@/types/member'
import { fetchMemberDetail, fetchMemberDirectory } from '@/services/memberDirectory'

export const useMemberDirectoryStore = defineStore('memberDirectory', () => {
  const members = ref<MemberListItem[]>([])
  const isLoading = ref(false)
  const hasLoadedMembers = ref(false)
  const errorMessage = ref<string | null>(null)
  const selectedMemberDetail = ref<MemberDetail | null>(null)
  const isLoadingMemberDetail = ref(false)
  const memberDetailErrorMessage = ref<string | null>(null)

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

  function clearMemberDetail() {
    selectedMemberDetail.value = null
    memberDetailErrorMessage.value = null
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

  async function loadMemberDetail(memberId: string) {
    isLoadingMemberDetail.value = true
    memberDetailErrorMessage.value = null

    try {
      const memberDetail = await fetchMemberDetail(memberId)

      selectedMemberDetail.value = memberDetail
    } catch {
      memberDetailErrorMessage.value = 'Unable to load member details.'
    } finally {
      isLoadingMemberDetail.value = false
    }
  }

  return {
    members,
    isLoading,
    hasLoadedMembers,
    errorMessage,
    selectedMemberDetail,
    isLoadingMemberDetail,
    memberDetailErrorMessage,
    memberCount,
    hasNoMembers,
    setMembers,
    startLoading,
    finishLoading,
    setError,
    clearError,
    clearMemberDetail,
    loadMembers,
    loadMemberDetail,
  }
})
