<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="font-label uppercase text-xs text-(--color-app-text)">
      {{ label }}
    </label>

    <!-- Input -->
    <input
      v-if="type === 'text' || type === 'email' || type === 'password'"
      :id="id"
      :class="[baseFieldClasses, 'min-h-10']"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
    />

    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :class="[baseFieldClasses, 'min-h-24']"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
    />

    <!-- Select -->
    <select
      v-else-if="type === 'select'"
      :id="id"
      :class="[baseFieldClasses, 'min-h-10']"
      :value="modelValue"
      :disabled="disabled"
      @change="onChange"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <p v-if="error" class="text-xs text-(--color-brand-red)">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
type InputType = 'text' | 'email' | 'password' | 'textarea' | 'select'

type SelectOption = {
  label: string
  value: string
}

withDefaults(
  defineProps<{
    id?: string
    label?: string
    type?: InputType
    placeholder?: string
    modelValue?: string
    options?: SelectOption[]
    disabled?: boolean
    error?: string
  }>(),
  {
    type: 'text',
    modelValue: '',
    options: () => [],
    disabled: false,
  },
)

const baseFieldClasses =
  'rounded-md border border-(--color-app-border) bg-(--color-app-surface) px-3 text-sm text-(--color-app-text) outline-none transition focus:border-(--color-brand-navy) focus:ring-(--color-brand-navy)/20'

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
