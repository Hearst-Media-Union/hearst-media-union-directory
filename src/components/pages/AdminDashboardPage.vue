<template>
  <main class="space-y-6">
    <section class="space-y-2">
      <p class="font-label text-xs tracking-wide text-(--color-brand-red)">Admin</p>
      <h1 class="font-condensed text-3xl font-semibold text-(--color-brand-navy)">Dashboard</h1>
      <p class="max-w-2xl text-sm text-slate-600">
        Manage directory data and future admin tools from one place.
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="section in adminSections"
        :key="section.title"
        class="rounded-lg border border-(--color-border) bg-white p-5 shadow-sm"
      >
        <p class="font-condensed text-xl font-semibold text-(--color-brand-navy)">
          {{ section.title }}
        </p>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          {{ section.description }}
        </p>
        <p class="mt-4 text-xs font-medium text-slate-500">Coming later</p>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
const adminSections = [
  {
    title: 'Members',
    description: 'Future tools for reviewing and managing member directory records.',
  },
  {
    title: 'Leadership',
    description: 'Future tools for managing leadership and representation assignments.',
  },
  {
    title: 'Committees',
    description: 'Future tools for managing committee visibility and membership.',
  },
  {
    title: 'Resources',
    description: 'Future tools for managing union resource links and documents.',
  },
  {
    title: 'Imports',
    description: 'Future tools for reviewing import runs and related history.',
  },
]
</script>
