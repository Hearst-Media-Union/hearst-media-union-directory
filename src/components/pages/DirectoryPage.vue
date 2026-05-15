<template>
  <section class="pt-3 pb-6 md:pt-4 md:pb-8">
    <div class="space-y-3">
      <header>
        <h1 class="font-condensed text-page-title font-semibold text-(--color-brand-navy)">
          Directory
        </h1>
      </header>

      <DirectoryToolbar
        v-model:search-term="searchTerm"
        v-model:brand-filter="brandFilter"
        v-model:location-filter="locationFilter"
        v-model:committee-filter="committeeFilter"
        v-model:unit-title-filter="unitTitleFilter"
        :brand-options="brandOptions"
        :location-options="locationOptions"
        :committee-options="committeeOptions"
        :unit-title-options="unitTitleOptions"
        :has-active-filters="hasActiveFilters"
        @reset="resetFilters"
      />

      <p class="font-sans text-meta text-(--color-brand-navy)">
        Showing {{ filteredMembers.length }} members
      </p>
      <p v-if="isLoading" class="font-sans text-meta text-(--color-brand-navy)">
        Loading members...
      </p>

      <p v-else-if="errorMessage" class="font-sans text-meta text-(--color-brand-red)">
        {{ errorMessage }}
      </p>

      <p v-else-if="hasNoMembers" class="font-sans text-meta text-(--color-brand-navy)">
        No members found.
      </p>

      <DirectoryDesktopTable
        v-if="canShowDirectoryResults && isDesktopDirectory"
        :members="filteredMembers"
        @select="openMemberModal"
      />

      <DirectoryMobileList
        v-if="canShowDirectoryResults && isMobileDirectory"
        :members="filteredMembers"
        @select="openMemberModal"
      />

      <MemberDetailModal
        v-if="selectedMember"
        :is-open="isMemberModalOpen"
        :member="selectedMember"
        @close="closeMemberModal"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import DirectoryToolbar from '@/components/directory/DirectoryToolbar.vue'
import DirectoryDesktopTable from '@/components/directory/DirectoryDesktopTable.vue'
import MemberDetailModal from '@/components/directory/MemberDetailModal.vue'
import DirectoryMobileList from '@/components/directory/DirectoryMobileList.vue'
import { useResponsiveDirectory } from '@/composables/useResponsiveDirectory'
import { useDirectoryFilters } from '@/composables/useDirectoryFilters'
import { useMemberModal } from '@/composables/useMemberModal'
import { useMemberDirectoryStore } from '@/stores/memberDirectory'

const memberDirectoryStore = useMemberDirectoryStore()
const { members, isLoading, errorMessage, hasNoMembers } = storeToRefs(memberDirectoryStore)

const canShowDirectoryResults = computed(
  () => !isLoading.value && !errorMessage.value && !hasNoMembers.value,
)

onMounted(() => {
  void memberDirectoryStore.loadMembers()
})

function getUniqueSortedValues(values: string[]) {
  return [...new Set(values)].sort((firstValue, secondValue) =>
    firstValue.localeCompare(secondValue),
  )
}

const brandOptions = computed(() =>
  getUniqueSortedValues(members.value.map((member) => member.brand)),
)

const locationOptions = computed(() =>
  getUniqueSortedValues(members.value.map((member) => member.area)),
)

const committeeOptions = computed(() =>
  getUniqueSortedValues(members.value.flatMap((member) => member.committees)),
)

const unitTitleOptions = computed(() =>
  getUniqueSortedValues(members.value.map((member) => member.unit)),
)

const {
  searchTerm,
  brandFilter,
  locationFilter,
  committeeFilter,
  unitTitleFilter,
  filteredMembers,
  hasActiveFilters,
  resetFilters,
} = useDirectoryFilters(members)
const { isDesktopDirectory, isMobileDirectory } = useResponsiveDirectory()
const { selectedMember, isMemberModalOpen, openMemberModal, closeMemberModal } = useMemberModal()
</script>
