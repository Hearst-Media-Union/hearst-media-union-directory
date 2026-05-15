import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { MemberListItem } from '@/types/member'

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
      committees: [],
    },
  ])
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const memberCount = computed(() => members.value.length)

  function setMembers(nextMembers: MemberListItem[]) {
    members.value = nextMembers
  }

  function clearError() {
    errorMessage.value = null
  }

  return {
    members,
    isLoading,
    errorMessage,
    memberCount,
    setMembers,
    clearError,
  }
})
