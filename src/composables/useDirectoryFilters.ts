import { computed, ref, type Ref } from 'vue'

export type DirectoryFilterValue = string

export type DirectoryFilterableMember = {
  name: string
  email?: string
  phone?: string
  brand: string
  title: string
  unit: string
  area: string
  committees: string[]
}

export function useDirectoryFilters(members: Ref<DirectoryFilterableMember[]>) {
  const searchTerm = ref('')
  const unitFilter = ref<DirectoryFilterValue>('')
  const locationFilter = ref<DirectoryFilterValue>('')
  const brandFilter = ref<DirectoryFilterValue>('')
  const committeeFilter = ref<DirectoryFilterValue>('')

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

      const matchesUnit = !unitFilter.value || member.unit === unitFilter.value
      const matchesLocation = !locationFilter.value || member.area === locationFilter.value
      const matchesBrand = !brandFilter.value || member.brand === brandFilter.value
      const matchesCommittee =
        !committeeFilter.value || member.committees.includes(committeeFilter.value)

      return matchesSearch && matchesUnit && matchesLocation && matchesBrand && matchesCommittee
    })
  })

  function resetFilters() {
    searchTerm.value = ''
    unitFilter.value = ''
    locationFilter.value = ''
    brandFilter.value = ''
    committeeFilter.value = ''
  }

  return {
    searchTerm,
    unitFilter,
    locationFilter,
    brandFilter,
    committeeFilter,
    filteredMembers,
    resetFilters,
  }
}
