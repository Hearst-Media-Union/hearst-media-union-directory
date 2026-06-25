<template>
  <main class="space-y-6 py-8 md:py-10">
    <section class="space-y-2">
      <p class="font-label text-xs tracking-wide text-(--color-brand-red)">Admin</p>
      <h1 class="font-condensed text-3xl font-semibold text-(--color-brand-navy)">
        Committee Membership
      </h1>
      <p class="max-w-2xl text-sm text-slate-600">
        Assign members to committees and review current committee membership.
      </p>
    </section>
    <AdminCommitteeMembershipForm
      :members="members"
      :committees="committees"
      :is-submitting-membership="isSubmittingMembership"
      @add-membership="addMembership"
    />

    <section v-if="successMessage" class="text-sm text-slate-700">
      {{ successMessage }}
    </section>

    <section v-if="isLoading" class="text-sm text-slate-600">Loading committee membership…</section>

    <section v-else-if="errorMessage" class="text-sm text-(--color-brand-red)">
      {{ errorMessage }}
    </section>

    <section v-else-if="committees.length === 0" class="text-sm text-slate-600">
      No committees found.
    </section>

    <section v-else class="grid gap-4 lg:grid-cols-2">
      <article
        v-for="committee in committees"
        :key="committee.id"
        class="rounded-lg border border-(--color-border) bg-white p-5 shadow-sm"
      >
        <div class="space-y-1">
          <h2 class="font-condensed text-xl font-semibold text-(--color-brand-navy)">
            {{ committee.name }}
          </h2>

          <p v-if="committee.description" class="text-sm leading-6 text-slate-600">
            {{ committee.description }}
          </p>

          <p class="text-xs font-medium text-slate-500">{{ committee.members.length }} members</p>
        </div>

        <div v-if="committee.members.length === 0" class="mt-4 text-sm text-slate-500">
          No members assigned.
        </div>

        <ul v-else class="mt-4 divide-y divide-(--color-border)">
          <li
            v-for="member in committee.members"
            :key="member.membershipId"
            class="flex items-start justify-between gap-4 py-3"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-(--color-brand-navy)">
                {{ member.name }}
              </p>

              <p class="truncate text-xs text-slate-500">
                {{ member.brand || 'No brand listed' }}
                <template v-if="member.email"> · {{ member.email }}</template>
              </p>
            </div>

            <button
              type="button"
              class="shrink-0 text-xs font-medium text-(--color-brand-red) disabled:cursor-not-allowed disabled:text-slate-400"
              :disabled="deletingMembershipId === member.membershipId"
              @click="removeMembership(member.membershipId)"
            >
              {{ deletingMembershipId === member.membershipId ? 'Removing…' : 'Remove' }}
            </button>
          </li>
        </ul>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  createCommitteeMembership,
  deleteCommitteeMembership,
  fetchCommittees,
} from '@/services/committees'
import { fetchMemberDirectory } from '@/services/memberDirectory'
import type { Committee } from '@/types/committee'
import type { MemberListItem } from '@/types/member'
import AdminCommitteeMembershipForm from '@/components/admin/AdminCommitteeMembershipForm.vue'

const committees = ref<Committee[]>([])
const members = ref<MemberListItem[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const isSubmittingMembership = ref(false)
const deletingMembershipId = ref<string | null>(null)

async function removeMembership(membershipId: string) {
  deletingMembershipId.value = membershipId
  errorMessage.value = null
  successMessage.value = null

  try {
    await deleteCommitteeMembership(membershipId)
    await loadCommitteeMembershipPage()
    successMessage.value = 'Committee membership removed.'
  } catch {
    errorMessage.value = 'Unable to remove committee membership.'
  } finally {
    deletingMembershipId.value = null
  }
}

async function addMembership(payload: { memberId: string; committeeId: string }) {
  isSubmittingMembership.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    await createCommitteeMembership(payload)
    await loadCommitteeMembershipPage()
    successMessage.value = 'Committee membership added.'
  } catch {
    errorMessage.value = 'Unable to add committee membership.'
  } finally {
    isSubmittingMembership.value = false
  }
}

async function loadCommitteeMembershipPage() {
  isLoading.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    const [nextCommittees, nextMembers] = await Promise.all([
      fetchCommittees(),
      fetchMemberDirectory(),
    ])

    committees.value = nextCommittees
    members.value = nextMembers
  } catch {
    errorMessage.value = 'Unable to load committee membership.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadCommitteeMembershipPage()
})
</script>
