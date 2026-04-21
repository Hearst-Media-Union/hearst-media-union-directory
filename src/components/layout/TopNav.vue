<template>
  <div class="w-full bg-(--color-brand-navy) text-white">
    <PageContainer>
      <div class="flex h-14 items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="rounded bg-white">
            <img src="/images/logo.png" alt="HMU" class="h-12 w-auto" />
          </div>

          <span class="font-condensed text-lg font-semibold tracking-wide">
            Hearst Media Union
          </span>
        </div>

        <div class="flex items-center">
          <div class="hidden items-center gap-6 text-sm md:flex">
            <a href="#" class="hover:underline">Directory</a>
            <a href="#" class="hover:underline">Committees</a>
            <a href="#" class="hover:underline">Resources</a>
          </div>

          <button
            class="ml-4 flex items-center justify-center md:hidden cursor-pointer"
            @click="isOpen = true"
          >
            <div class="flex flex-col gap-1">
              <span class="block h-[2px] w-5 bg-white"></span>
              <span class="block h-[2px] w-5 bg-white"></span>
              <span class="block h-[2px] w-5 bg-white"></span>
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

    <div class="flex flex-col divide-y divide-(--color-app-border)">
      <a href="#" class="block py-4 text-(--color-app-text)">Directory</a>
      <a href="#" class="block py-4 text-(--color-app-text)">Committees</a>
      <a href="#" class="block py-4 text-(--color-app-text)">Resources</a>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import PageContainer from '@/components/layout/PageContainer.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

const isOpen = ref(false)
</script>
