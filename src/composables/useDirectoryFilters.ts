import { computed, ref, type Ref } from 'vue'
import type { MemberListItem } from '@/types/member'

export type DirectoryFilterValue = string
export type DirectoryFilterableMember = MemberListItem

export function useDirectoryFilters(members: Ref<DirectoryFilterableMember[]>) {
  const searchTerm = ref('')
  const brandFilter = ref<DirectoryFilterValue>('')
  const locationFilter = ref<DirectoryFilterValue>('')
  const committeeFilter = ref<DirectoryFilterValue>('')
  const unitTitleFilter = ref<DirectoryFilterValue>('')

  const filteredMembers = computed(() => {
    const normalizedSearchTerm = searchTerm.value.trim().toLowerCase()

    return members.value.filter((member) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        [
          member.name,
          member.email,
          member.phone,
          member.brand,
          member.title,
          member.unit,
          member.area,
          ...member.committees,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(normalizedSearchTerm))
      const matchesBrand = !brandFilter.value || member.brand === brandFilter.value
      const matchesLocation = !locationFilter.value || member.area === locationFilter.value
      const matchesCommittee =
        !committeeFilter.value || member.committees.includes(committeeFilter.value)
      const matchesUnitTitle = !unitTitleFilter.value || member.unit === unitTitleFilter.value

      return (
        matchesSearch && matchesBrand && matchesLocation && matchesCommittee && matchesUnitTitle
      )
    })
  })

  const hasActiveFilters = computed(() => {
    return (
      searchTerm.value.length > 0 ||
      brandFilter.value.length > 0 ||
      locationFilter.value.length > 0 ||
      committeeFilter.value.length > 0 ||
      unitTitleFilter.value.length > 0
    )
  })

  function resetFilters() {
    searchTerm.value = ''
    brandFilter.value = ''
    locationFilter.value = ''
    committeeFilter.value = ''
    unitTitleFilter.value = ''
  }

  return {
    searchTerm,
    brandFilter,
    locationFilter,
    committeeFilter,
    unitTitleFilter,
    filteredMembers,
    hasActiveFilters,
    resetFilters,
  }
}
