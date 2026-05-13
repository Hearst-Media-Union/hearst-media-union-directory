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

      <DirectoryDesktopTable :members="filteredMembers" @select="openMemberModal" />

      <MemberDetailModal
        v-if="selectedMember"
        :is-open="isMemberModalOpen"
        :member="selectedMember"
        @close="closeMemberModal"
      />

      <div class="space-y-3 md:hidden">
        <div
          class="min-h-28 rounded-lg border border-(--color-app-border) bg-(--color-app-surface)"
        ></div>

        <div
          class="min-h-28 rounded-lg border border-(--color-app-border) bg-(--color-app-surface)"
        ></div>

        <div
          class="min-h-28 rounded-lg border border-(--color-app-border) bg-(--color-app-surface)"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DirectoryToolbar from '@/components/directory/DirectoryToolbar.vue'
import DirectoryDesktopTable from '@/components/directory/DirectoryDesktopTable.vue'
import MemberDetailModal from '@/components/directory/MemberDetailModal.vue'
import {
  useDirectoryFilters,
  type DirectoryFilterableMember,
} from '@/composables/useDirectoryFilters'
import { useMemberModal } from '@/composables/useMemberModal'

const members = computed<DirectoryFilterableMember[]>(() => [
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
    phone: '555-0102',
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
const { selectedMember, isMemberModalOpen, openMemberModal, closeMemberModal } = useMemberModal()
</script>
