<template>
  <div class="w-full bg-(--color-brand-navy) text-white">
    <PageContainer>
      <div class="flex items-center justify-between h-14">
        <div class="flex items-center gap-3">
          <div class="bg-white rounded">
            <img src="/images/logo.png" alt="HMU" class="h-12 w-auto" />
          </div>

          <span class="font-condensed text-lg font-semibold tracking-wide">
            Hearst Media Union
          </span>
        </div>

        <div class="flex items-center">
          <!-- Desktop nav -->
          <div class="hidden md:flex items-center gap-6 text-sm">
            <span class="cursor-pointer">Directory</span>
            <span class="cursor-pointer">Committees</span>
            <span class="cursor-pointer">Resources</span>
          </div>

          <!-- Mobile hamburger -->
          <button class="ml-4 flex md:hidden items-center justify-center" @click="isOpen = true">
            <div class="flex flex-col gap-1">
              <span class="block h-0.5 w-5 bg-white"></span>
              <span class="block h-0.5 w-5 bg-white"></span>
              <span class="block h-0.5 w-5 bg-white"></span>
            </div>
          </button>
        </div>
      </div>
    </PageContainer>
  </div>
  <BaseDrawer v-if="isOpen">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-(--color-app-text)">Menu</h2>
        <button class="text-sm text-(--color-brand-red)/60" @click="isOpen = false">Close</button>
      </div>
    </template>

    <div class="flex flex-col gap-4 py-2 text-(--color-app-text)">
      <span>Directory</span>
      <span>Committees</span>
      <span>Resources</span>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

const isOpen = ref(false)
</script>
