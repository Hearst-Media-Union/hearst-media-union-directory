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
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchCommittees } from '@/services/committees'
import { fetchMemberDirectory } from '@/services/memberDirectory'
import type { Committee } from '@/types/committee'
import type { MemberListItem } from '@/types/member'

const committees = ref<Committee[]>([])
const members = ref<MemberListItem[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

async function loadCommitteeMembershipPage() {
  isLoading.value = true
  errorMessage.value = null

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
