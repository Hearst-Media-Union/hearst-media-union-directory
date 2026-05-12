<template>
  <span
    class="inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium text-(--color-app-text)"
    :class="committeeClasses"
    :title="committeeLabel"
  >
    {{ committee }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  committee: string
}>()

const committeeClasses = computed(() => {
  const normalizedCommittee = props.committee.trim().toLowerCase()

  const classMap: Record<string, string> = {
    a: 'bg-(--color-accent-yellow)',
    lmc: 'bg-(--color-accent-blue) text-white',
    bs: 'bg-(--color-accent-mint)',
    nmc: 'bg-(--color-accent-pink)',
    comm: 'bg-(--color-accent-orange)',
    cha: 'bg-(--color-accent-light-blue)',
    eq: 'bg-(--color-accent-purple)',
    soc: 'bg-(--color-accent-teal)',
  }

  return classMap[normalizedCommittee] ?? 'bg-(--color-app-muted)'
})

const committeeLabel = computed(() => {
  const normalizedCommittee = props.committee.trim().toLowerCase()

  const labelMap: Record<string, string> = {
    a: 'Admin',
    lmc: 'Labor Management Committee',
    bs: 'Brand Steward',
    nmc: 'New Member Committee',
    comm: 'Comms Committee',
    cha: 'Chaos Committee',
    eq: 'Equity Committee',
    soc: 'Social Committee',
  }

  return labelMap[normalizedCommittee] ?? props.committee
})
</script>
