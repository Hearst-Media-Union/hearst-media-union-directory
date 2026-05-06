<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      @click.self="closeModal"
    >
      <section
        class="max-h-[90vh] w-full max-w-180 overflow-y-auto rounded-lg bg-(--color-app-surface) shadow-(--shadow-modal)"
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
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  labelledBy?: string
}>()

const emit = defineEmits<{
  close: []
}>()

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
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
