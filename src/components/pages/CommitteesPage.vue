<template>
  <main class="space-y-8 py-8 md:py-10">
    <header class="max-w-3xl space-y-3">
      <p class="font-label text-meta uppercase tracking-wide text-(--color-brand-red)">
        Committees
      </p>

      <h1 class="font-heading text-page-title font-semibold text-(--color-brand-navy)">
        Committees
      </h1>

      <p class="text-sm leading-6 text-(--color-brand-navy)">
        Committees are a way for members to support union work, meet other members, and help keep
        the shop organized.
      </p>
    </header>

    <section class="space-y-5">
      <BasePageState v-if="isLoading" variant="loading" message="Loading committees..." />

      <BasePageState v-else-if="errorMessage" variant="error" :message="errorMessage" />

      <BasePageState
        v-else-if="committees.length === 0"
        variant="empty"
        message="No committees found."
      />

      <article
        v-for="committee in committees"
        v-else
        :key="committee.id"
        class="space-y-4 rounded-2xl bg-white"
      >
        <div class="max-w-3xl space-y-2">
          <h2 class="font-heading text-2xl font-semibold text-(--color-brand-navy)">
            {{ committee.name }}
          </h2>

          <p class="text-sm leading-6 text-(--color-text-muted)">
            {{ committee.description }}
          </p>
        </div>

        <div class="overflow-x-auto rounded-xl border border-(--color-border-subtle)">
          <table class="min-w-full border-collapse text-left text-sm text-(--color-brand-navy)">
            <thead class="bg-(--color-surface-muted)">
              <tr>
                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Member
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
              <tr v-for="member in committee.members" :key="`${committee.id}-${member.id}`">
                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">
                      {{ member.name }}
                    </span>

                    <span
                      v-if="member.isChair"
                      class="text-meta font-semibold uppercase tracking-wide text-(--color-brand-red)"
                    >
                      Chair
                    </span>
                  </div>
                </td>

                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  {{ member.brand }}
                </td>

                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  <a v-if="member.email" :href="`mailto:${member.email}`" class="guide-link">
                    {{ member.email }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BasePageState from '@/components/ui/BasePageState.vue'
import { fetchCommittees } from '@/services/committees'
import type { Committee } from '@/types/committee'

const committees = ref<Committee[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadCommittees() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    committees.value = await fetchCommittees()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load committees.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadCommittees()
})
</script>
