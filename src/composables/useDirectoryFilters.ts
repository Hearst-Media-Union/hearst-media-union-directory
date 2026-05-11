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
  const departmentFilter = ref<DirectoryFilterValue>('')
  const locationFilter = ref<DirectoryFilterValue>('')
  const committeeFilter = ref<DirectoryFilterValue>('')
  const roleFilter = ref<DirectoryFilterValue>('')

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

      const matchesDepartment = !departmentFilter.value || member.unit === departmentFilter.value
      const matchesLocation = !locationFilter.value || member.area === locationFilter.value
      const matchesCommittee =
        !committeeFilter.value || member.committees.includes(committeeFilter.value)
      const matchesRole = !roleFilter.value || member.title === roleFilter.value

      return (
        matchesSearch && matchesDepartment && matchesLocation && matchesCommittee && matchesRole
      )
    })
  })

  const hasActiveFilters = computed(() => {
    return (
      searchTerm.value.length > 0 ||
      departmentFilter.value.length > 0 ||
      locationFilter.value.length > 0 ||
      committeeFilter.value.length > 0 ||
      roleFilter.value.length > 0
    )
  })

  function resetFilters() {
    searchTerm.value = ''
    departmentFilter.value = ''
    locationFilter.value = ''
    committeeFilter.value = ''
    roleFilter.value = ''
  }

  return {
    searchTerm,
    departmentFilter,
    locationFilter,
    committeeFilter,
    roleFilter,
    filteredMembers,
    hasActiveFilters,
    resetFilters,
  }
}
