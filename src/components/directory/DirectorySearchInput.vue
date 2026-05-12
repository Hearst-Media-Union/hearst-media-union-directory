<template>
  <div class="relative">
    <img
      src="/images/icons/search-icon-navy.png"
      alt=""
      class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
    />

    <BaseInput
      id="directory-search"
      v-model="searchValue"
      class="[&_input]:min-h-12 [&_input]:w-full [&_input]:rounded-lg [&_input]:pl-10 [&_input]:text-nav"
      placeholder="Search members by name, email, phone, brand..."
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
