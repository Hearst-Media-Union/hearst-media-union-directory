<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      @click.self="closeModal"
    >
      <section
        class="w-full overflow-y-auto bg-(--color-app-surface) shadow-(--shadow-modal)"
        :class="modalClasses"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="labelledBy"
      >
        <div v-if="$slots.header" class="border-b border-(--color-app-border) px-6 py-4">
          <slot name="header" />
        </div>

        <div class="px-6 py-5">
          <slot />
        </div>

        <div v-if="$slots.footer" class="border-t border-(--color-app-border) px-6 py-4">
          <slot name="footer" />
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    labelledBy?: string
    variant?: 'default' | 'mobile-fullscreen'
  }>(),
  {
    variant: 'default',
  },
)

const emit = defineEmits<{
  close: []
}>()

const modalClasses = computed(() => {
  if (props.variant === 'mobile-fullscreen') {
    return 'h-screen max-h-screen rounded-none md:h-auto md:max-h-[90vh] md:max-w-180 md:rounded-lg'
  }

  return 'max-h-[90vh] max-w-180 rounded-lg'
})

function closeModal() {
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeModal()
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
      return
    }

    window.removeEventListener('keydown', handleKeydown)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
