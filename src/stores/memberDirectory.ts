import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { MemberListItem } from '@/types/member'
import { fetchMemberDirectory } from '@/services/memberDirectory'

export const useMemberDirectoryStore = defineStore('memberDirectory', () => {
  const members = ref<MemberListItem[]>([
    {
      name: 'Andrew Berry',
      email: 'andrew.berry@example.com',
      phone: '618-555-0100',
      brand: 'Car & Driver',
      title: 'Online Production Assistant',
      unit: 'Assistant',
      area: 'Ann Arbor, MI',
      committees: ['A', 'LMC', 'SOC', 'BS'],
    },
    {
      name: 'Anna Logan',
      email: 'anna.logan@example.com',
      phone: '618-555-0101',
      brand: 'Country Living',
      title: 'Senior Homes & Style Editor',
      unit: 'Senior Editor',
      area: 'Birmingham, AL',
      committees: ['LMC', 'SOC', 'NMC', 'COMM'],
    },
    {
      name: 'Cinzia Reale-Castello',
      email: 'cinzia.reale-castello@example.com',
      phone: '618-555-0102',
      brand: 'Good Housekeeping Institute',
      title: 'Copy & Research Chief, Discoveries and Product Testing',
      unit: 'Senior Photo Editor',
      area: 'Tower - Floor 24',
      committees: ['EQ', 'CHA'],
    },
    {
      name: 'Ashleigh Macdonald-Bennett',
      email: 'ashleigh.macdonald-bennett@example.com',
      phone: '618-555-0103',
      brand: 'Town & Country',
      title: 'Deputy Managing Editor',
      unit: 'Deputy Editor',
      area: 'Easton, PA',
      committees: ['CHA', 'BS'],
    },
  ])
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
