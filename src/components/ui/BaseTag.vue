<template>
  <span
    class="inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium text-(--color-app-text)"
    :class="variantClasses"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'neutral' | 'yellow' | 'blue' | 'lightBlue' | 'mint' | 'pink' | 'orange'
  }>(),
  {
    variant: 'neutral',
  },
)

const variantClasses = {
  neutral: 'bg-(--color-app-muted)',
  yellow: 'bg-(--color-accent-yellow)',
  blue: 'bg-(--color-accent-blue) text-white',
  lightBlue: 'bg-(--color-accent-light-blue)',
  mint: 'bg-(--color-accent-mint)',
  pink: 'bg-(--color-accent-pink)',
  orange: 'bg-(--color-accent-orange)',
}[props.variant]
</script>
