<template>
  <BaseModal
    :is-open="isOpen"
    variant="mobile-fullscreen"
    labelled-by="member-detail-title"
    @close="emit('close')"
  >
    <div class="-mx-6 -mt-5 mb-5 hidden h-2 bg-(--color-brand-red) md:block"></div>

    <div class="space-y-6 pb-6">
      <div
        class="sticky top-0 z-10 -mx-6 -mt-5 flex items-start justify-between gap-4 border-b border-(--color-app-border) bg-(--color-app-surface) px-6 py-5 md:static md:m-0 md:border-b-0 md:bg-transparent md:p-0"
      >
        <div>
          <h2
            id="member-detail-title"
            class="font-condensed text-2xl font-semibold text-(--color-brand-navy)"
          >
            {{ member.name }}
          </h2>

          <p class="font-sans text-table text-(--color-app-text)">
            {{ member.brand }}
          </p>
        </div>

        <BaseButton variant="ghost" size="sm" font="sans" @click="emit('close')">Close</BaseButton>
      </div>

      <p v-if="isLoading" class="font-sans text-table text-(--color-app-text)">
        Loading member details...
      </p>

      <p v-else-if="errorMessage" class="font-sans text-table text-(--color-brand-red)">
        {{ errorMessage }}
      </p>

      <section class="space-y-2">
        <h3 class="mt-4 font-label text-xs tracking-wide uppercase text-(--color-brand-navy)">
          Contact
        </h3>

        <dl class="grid gap-3 font-sans text-table">
          <div>
            <dt class="text-meta text-(--color-app-text)">Work Email</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ member.email || 'Not provided' }}
            </dd>
          </div>

          <div>
            <dt class="text-meta text-(--color-app-text)">Personal Email</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ member.personalEmail || 'Not provided' }}
            </dd>
          </div>

          <div>
            <dt class="text-meta text-(--color-app-text)">Phone</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ member.phone || 'Not provided' }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="space-y-3">
        <h3 class="font-label text-xs tracking-wide uppercase text-(--color-brand-navy)">
          Position
        </h3>

        <dl class="grid gap-3 font-sans text-table">
          <div>
            <dt class="text-meta text-(--color-app-text)">Job Title</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ member.title }}
            </dd>
          </div>

          <div>
            <dt class="text-meta text-(--color-app-text)">Unit Title</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ member.unit }}
            </dd>
          </div>

          <div>
            <dt class="text-meta text-(--color-app-text)">Area/Office</dt>
            <dd class="font-medium text-(--color-brand-navy)">
              {{ member.area }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="space-y-3">
        <h3 class="font-label text-xs tracking-wide uppercase text-(--color-brand-navy)">
          Committees
        </h3>

        <div v-if="member.committees.length > 0" class="flex flex-wrap gap-2">
          <BaseTag v-for="committee in member.committees" :key="committee" :committee="committee" />
        </div>

        <p v-else class="font-sans text-table text-(--color-app-text)">None listed</p>
      </section>
      <section class="space-y-3">
        <h3 class="font-label text-xs tracking-wide uppercase text-(--color-brand-navy)">
          Representation
        </h3>

        <dl v-if="member.representation.length > 0" class="grid gap-3 font-sans text-table">
          <div v-for="contact in member.representation" :key="contact.id">
            <dt class="text-meta text-(--color-app-text)">
              {{ contact.label }}
            </dt>

            <dd class="font-medium text-(--color-brand-navy)">
              <a v-if="contact.email" :href="`mailto:${contact.email}`" class="guide-link">
                {{ contact.name }}
              </a>

              <span v-else>
                {{ contact.name }}
              </span>
            </dd>
          </div>
        </dl>

        <p v-else class="font-sans text-table text-(--color-app-text)">None listed</p>
      </section>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import type { MemberDetail } from '@/types/member'

defineProps<{
  isOpen: boolean
  member: MemberDetail
  isLoading: boolean
  errorMessage: string | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
