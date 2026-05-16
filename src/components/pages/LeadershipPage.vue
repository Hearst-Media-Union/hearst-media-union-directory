<template>
  <main class="space-y-8 py-8 md:py-10">
    <header class="max-w-3xl space-y-3">
      <p class="font-label text-meta uppercase tracking-wide text-(--color-brand-red)">
        Leadership
      </p>

      <h1 class="font-heading text-page-title font-semibold text-(--color-brand-navy)">
        Leadership Contacts
      </h1>

      <p class="text-sm leading-6 text-(--color-brand-navy)">
        A quick reference for Hearst Media Union area captains, WGAE business reps, and Guild
        leadership.
      </p>
    </header>

    <p v-if="isLoadingLeadership" class="text-sm text-(--color-brand-navy)">
      Loading leadership contacts...
    </p>

    <p v-else-if="leadershipErrorMessage" class="text-sm text-(--color-brand-red)">
      {{ leadershipErrorMessage }}
    </p>

    <section class="space-y-4">
      <div class="space-y-4">
        <div class="max-w-3xl">
          <h2 class="font-heading text-2xl font-semibold text-(--color-brand-navy)">
            Union Leadership
          </h2>

          <p class="mt-1 text-sm leading-6 text-(--color-text-muted)">
            Area captains help coordinate communication, member support, and workplace
            representation across the union.
          </p>
        </div>

        <div class="overflow-x-auto rounded-xl border border-(--color-border-subtle)">
          <table class="min-w-full border-collapse text-left text-sm text-(--color-brand-navy)">
            <thead class="bg-(--color-surface-muted)">
              <tr>
                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Name
                </th>
                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Area
                </th>
                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Brand
                </th>
                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Email
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="captain in areaCaptains" :key="`${captain.name}-${captain.area}`">
                <td class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  {{ captain.name }}
                </td>
                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  {{ captain.area }}
                </td>
                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  {{ captain.brand }}
                </td>
                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  <a v-if="captain.email" :href="`mailto:${captain.email}`" class="guide-link">
                    {{ captain.email }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="space-y-6">
        <div class="max-w-3xl">
          <h2 class="font-heading text-2xl font-semibold text-(--color-brand-navy)">
            WGAE Leadership
          </h2>

          <p class="mt-1 text-sm leading-6 text-(--color-text-muted)">
            WGAE business reps and Guild leadership provide support and oversight beyond the
            internal Hearst Media Union area captain structure.
          </p>
        </div>

        <div class="space-y-4">
          <h3 class="text-base font-semibold text-(--color-brand-navy)">Business Reps</h3>

          <div class="overflow-x-auto rounded-xl border border-(--color-border-subtle)">
            <table class="min-w-full border-collapse text-left text-sm text-(--color-brand-navy)">
              <thead class="bg-(--color-surface-muted)">
                <tr>
                  <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                    Name
                  </th>
                  <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                    Title
                  </th>
                  <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                    Email
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="rep in businessReps" :key="rep.name">
                  <td class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                    {{ rep.name }}
                  </td>
                  <td class="border-b border-(--color-border-subtle) px-4 py-3">
                    {{ rep.title }}
                  </td>
                  <td class="border-b border-(--color-border-subtle) px-4 py-3">
                    <a v-if="rep.email" :href="`mailto:${rep.email}`" class="guide-link">
                      {{ rep.email }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-base font-semibold text-(--color-brand-navy)">Guild Leadership</h3>

          <div class="overflow-x-auto rounded-xl border border-(--color-border-subtle)">
            <table class="min-w-full border-collapse text-left text-sm text-(--color-brand-navy)">
              <thead class="bg-(--color-surface-muted)">
                <tr>
                  <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                    Name
                  </th>
                  <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                    Title
                  </th>
                  <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                    Email
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="leader in guildLeadership" :key="leader.name">
                  <td class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                    {{ leader.name }}
                  </td>
                  <td class="border-b border-(--color-border-subtle) px-4 py-3">
                    {{ leader.title }}
                  </td>
                  <td class="border-b border-(--color-border-subtle) px-4 py-3">
                    <a v-if="leader.email" :href="`mailto:${leader.email}`" class="guide-link">
                      {{ leader.email }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchLeadershipAssignments } from '@/services/leadership'
import type { LeadershipItem } from '@/types/leadership'

type ExternalLeadershipContact = {
  name: string
  title: string
  email: string
}

const leadershipAssignments = ref<LeadershipItem[]>([])
const isLoadingLeadership = ref(false)
const leadershipErrorMessage = ref<string | null>(null)

const areaCaptains = computed(() =>
  leadershipAssignments.value.filter((assignment) => assignment.role === 'area_captain'),
)

const businessReps: ExternalLeadershipContact[] = []

const guildLeadership: ExternalLeadershipContact[] = []

async function loadLeadershipAssignments() {
  isLoadingLeadership.value = true
  leadershipErrorMessage.value = null

  try {
    leadershipAssignments.value = await fetchLeadershipAssignments()
  } catch {
    leadershipErrorMessage.value = 'Unable to load leadership contacts.'
  } finally {
    isLoadingLeadership.value = false
  }
}

onMounted(() => {
  void loadLeadershipAssignments()
})
</script>
