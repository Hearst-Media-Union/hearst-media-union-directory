<template>
  <label class="space-y-1 text-sm">
    <span class="font-medium text-(--color-brand-navy)">{{ label }}</span>

    <input
      v-if="isEditing"
      :value="modelValue"
      class="h-10 w-full rounded border border-(--color-border) bg-white px-3 text-sm text-(--color-brand-navy)"
      :type="type"
      @input="updateValue"
      @paste="emit('paste', $event)"
    />

    <span v-else class="block min-h-10 rounded bg-slate-100 px-3 py-2 text-sm text-slate-700">
      {{ displayValue }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue: string
    isEditing: boolean
    type?: string
    value?: string
  }>(),
  {
    type: 'text',
    value: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  paste: [event: ClipboardEvent]
}>()

const displayValue = computed(() => {
  const value = props.value || props.modelValue

  return value.trim() || 'None listed'
})

function updateValue(event: Event) {
  const target = event.target

  if (!(target instanceof HTMLInputElement)) {
    return
  }

  emit('update:modelValue', target.value)
}
</script>
