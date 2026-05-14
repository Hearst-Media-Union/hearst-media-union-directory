<template>
  <main class="space-y-8 py-8 md:py-10">
    <header class="max-w-3xl space-y-3">
      <p class="font-label text-meta uppercase tracking-wide text-(--color-brand-red)">Contact</p>

      <h1 class="font-heading text-page-title font-semibold text-(--color-brand-navy)">
        Contact Information
      </h1>

      <p class="text-sm leading-6 text-(--color-brand-navy)">
        Contact information for Hearst Media Union and WGAE support resources.
      </p>
    </header>

    <section class="space-y-6">
      <article class="space-y-4">
        <div class="max-w-3xl space-y-2">
          <h2 class="font-heading text-2xl font-semibold text-(--color-brand-navy)">
            WGAE Contacts
          </h2>

          <p class="text-sm leading-6 text-(--color-text-muted)">
            Official Writers Guild of America, East support and membership contacts.
          </p>
        </div>

        <div class="overflow-hidden rounded-xl border border-(--color-border-subtle)">
          <table class="min-w-full border-collapse text-left text-sm text-(--color-brand-navy)">
            <thead class="bg-(--color-surface-muted)">
              <tr>
                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Contact
                </th>

                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Role
                </th>

                <th class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Email
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="contact in wgaeContacts" :key="contact.name">
                <td class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  {{ contact.name }}
                </td>

                <td
                  class="border-b border-(--color-border-subtle) px-4 py-3 text-(--color-text-muted)"
                >
                  {{ contact.role }}
                </td>

                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  <a :href="`mailto:${contact.email}`" class="guide-link">
                    {{ contact.email }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="space-y-4">
        <div class="max-w-3xl space-y-2">
          <h2 class="font-heading text-2xl font-semibold text-(--color-brand-navy)">
            Hearst Media Union
          </h2>

          <p class="text-sm leading-6 text-(--color-text-muted)">
            General union support and communication resources.
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
                  Details
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  Instagram
                </td>

                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  <a
                    href="https://www.instagram.com/hearstunion"
                    target="_blank"
                    rel="noreferrer"
                    class="guide-link"
                  >
                    @hearstunion
                  </a>
                </td>
              </tr>

              <tr>
                <td class="border-b border-(--color-border-subtle) px-4 py-3 font-semibold">
                  WGAE Website
                </td>

                <td class="border-b border-(--color-border-subtle) px-4 py-3">
                  <a
                    href="https://www.wgaeast.org/"
                    target="_blank"
                    rel="noreferrer"
                    class="guide-link"
                  >
                    wgaeast.org
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
type ContactItem = {
  name: string
  role: string
  email: string
}

const wgaeContacts: ContactItem[] = [
  {
    name: 'Juan Montana',
    role: 'WGAE Representative',
    email: 'jmontana@wgaeast.org',
  },
  {
    name: 'Kelly O’Brien',
    role: 'Membership Administrator',
    email: 'kobrien@wgaeast.org',
  },
  {
    name: 'Ann Burdick',
    role: 'Director of Legal Services',
    email: 'aburdick@wgaeast.org',
  },
]
</script>
