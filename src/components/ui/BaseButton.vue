<template>
  <button
    class="inline-flex min-h-10 items-center justify-center rounded-md text-base font-semibold tracking-wide transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
    :class="[variantClasses, sizeClasses, fontClasses]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'ghost'
    font?: 'condensed' | 'label' | 'sans'
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    font: 'condensed',
    size: 'md',
    disabled: false,
  },
)

const variantClasses = {
  primary: 'bg-(--color-brand-red) text-white hover:bg-(--color-brand-red-bright)',
  secondary:
    'border border-(--color-brand-gray) bg-(--color-app-surface) text-(--color-app-text) hover:bg-(--color-app-muted)',
  ghost: 'bg-transparent text-(--color-app-text) hover:bg-(--color-app-muted)',
}[props.variant]

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3',
}[props.size]

const fontClasses = {
  condensed: 'font-condensed',
  label: 'font-label',
  sans: 'font-sans',
}[props.font]
</script>
