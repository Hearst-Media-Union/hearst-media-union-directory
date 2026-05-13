<template>
  <Teleport to="body">
    <Transition name="drawer-overlay">
      <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/30 md:hidden" @click.self="closeDrawer">
        <!-- Drawer -->
        <Transition name="drawer-sheet" appear>
          <section
            v-if="isOpen"
            class="absolute inset-x-0 bottom-0 flex max-h-[80vh] min-h-[70vh] flex-col rounded-t-3xl bg-(--color-app-surface) shadow-[0_-4px_24px_rgba(0,0,0,0.18)]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="labelledBy"
          >
            <!-- Handle -->
            <div class="flex justify-center pt-4 pb-2">
              <div class="h-1 w-10 rounded-full bg-(--color-brand-gray)" />
            </div>

            <!-- Header -->
            <div v-if="$slots.header" class="px-4 pb-4">
              <slot name="header" />
            </div>

            <!-- Body -->
            <div class="min-h-0 flex-1 overflow-y-auto px-4">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="shrink-0">
              <slot name="footer" />
            </div>
          </section>
        </Transition>
      </div>
    </Transition>
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

function closeDrawer() {
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDrawer()
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
<style scoped>
.drawer-overlay-enter-active,
.drawer-overlay-leave-active {
  transition: opacity 180ms ease;
}

.drawer-overlay-enter-from,
.drawer-overlay-leave-to {
  opacity: 0;
}

.drawer-sheet-enter-active,
.drawer-sheet-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.drawer-sheet-enter-from,
.drawer-sheet-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
