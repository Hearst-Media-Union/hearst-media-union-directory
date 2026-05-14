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
      <article v-for="category in resourceCategories" :key="category.name" class="space-y-4">
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
              <tr v-for="resource in category.resources" :key="resource.title">
                <td class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  {{ resource.title }}
                </td>

                <td
                  class="border-b border-(--color-border-subtle) px-4 py-3 text-(--color-text-muted)"
                >
                  {{ resource.description }}
                </td>

                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  <a :href="resource.href" target="_blank" rel="noreferrer" class="guide-link">
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
type ResourceItem = {
  title: string
  description: string
  href: string
}

type ResourceCategory = {
  name: string
  description?: string
  resources: ResourceItem[]
}

// Placeholder resource data.
// Future resource content may come from Supabase or a CMS-managed resource table.
const resourceCategories: ResourceCategory[] = [
  {
    name: 'Contracts',
    description: 'Collective bargaining agreements and related contract documents.',
    resources: [
      {
        title: 'Hearst WGAE Agreement 2026–2029',
        description: 'Current Hearst Media Union collective bargaining agreement.',
        href: '#',
      },
    ],
  },
  {
    name: 'Membership',
    description: 'Membership forms and onboarding information.',
    resources: [
      {
        title: 'Membership Form',
        description: 'Official WGAE membership signup form.',
        href: '#',
      },
    ],
  },
  {
    name: 'Member Support',
    description: 'Helpful support resources and member guidance.',
    resources: [
      {
        title: 'Sexual Harassment Resource Guide',
        description: 'WGAE support and reporting resources.',
        href: '#',
      },
    ],
  },
]
</script>
