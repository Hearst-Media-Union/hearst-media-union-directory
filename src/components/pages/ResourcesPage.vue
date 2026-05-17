<template>
  <main class="space-y-8 py-8 md:py-10">
    <header class="max-w-3xl space-y-3">
      <p class="font-label text-meta uppercase tracking-wide text-(--color-brand-red)">Resources</p>

      <h1 class="font-heading text-page-title font-semibold text-(--color-brand-navy)">
        Union Resources
      </h1>

      <p class="text-sm leading-6 text-(--color-brand-navy)">
        Frequently used union documents, links, and member resources.
      </p>
    </header>

    <section class="space-y-8">
      <BasePageState v-if="isLoading" variant="loading" message="Loading resources..." />

      <BasePageState v-else-if="errorMessage" variant="error" :message="errorMessage" />

      <BasePageState
        v-else-if="resourceCategories.length === 0"
        variant="empty"
        message="No resources found."
      />

      <article v-for="category in resourceCategories" v-else :key="category.name" class="space-y-4">
        <div class="max-w-3xl space-y-2">
          <h2 class="font-heading text-2xl font-semibold text-(--color-brand-navy)">
            {{ category.name }}
          </h2>

          <p v-if="category.description" class="text-sm leading-6 text-(--color-text-muted)">
            {{ category.description }}
          </p>
        </div>

        <div class="overflow-hidden rounded-xl border border-(--color-border-subtle)">
          <table class="min-w-full border-collapse text-left text-sm text-(--color-brand-navy)">
            <thead class="bg-(--color-surface-muted)">
              <tr>
                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Resource
                </th>

                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Description
                </th>

                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Link
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="resource in category.resources" :key="resource.id">
                <td class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  {{ resource.title }}
                </td>

                <td
                  class="border-b border-(--color-border-subtle) px-4 py-3 text-(--color-text-muted)"
                >
                  {{ resource.description }}
                </td>

                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  <a
                    v-if="resource.url"
                    :href="resource.url"
                    target="_blank"
                    rel="noreferrer"
                    class="guide-link"
                  >
                    Open
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
import { fetchResources } from '@/services/resources'
import type { ResourceCategory } from '@/types/resource'

const resourceCategories = ref<ResourceCategory[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadResources() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    resourceCategories.value = await fetchResources()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load resources.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadResources()
})
</script>
