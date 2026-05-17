<template>
  <div
    class="rounded-2xl border border-(--color-border-subtle) bg-white px-6 py-10 text-sm"
    :class="textColorClass"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type PageStateVariant = 'loading' | 'empty' | 'error'

const props = defineProps<{
  variant: PageStateVariant
  message: string
}>()

const textColorClass = computed(() => {
  if (props.variant === 'error') {
    return 'text-(--color-brand-red)'
  }

  return 'text-(--color-text-muted)'
})
</script>
