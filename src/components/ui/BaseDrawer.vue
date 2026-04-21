<template>
  <div class="fixed inset-x-0 bottom-0 z-40 md:hidden">
    <div
      class="flex max-h-[80vh] min-h-[70vh] flex-col rounded-t-3xl bg-(--color-app-surface) shadow-[0_-4px_24px_rgba(0,0,0,0.18)]"
    >
      <div class="flex justify-center pt-4 pb-2">
        <div class="h-1 w-10 rounded-full bg-[--color-brand-gray]" />
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </div>

      <div v-if="$slots.footer" class="shrink-0">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
