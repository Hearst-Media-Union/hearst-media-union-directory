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
            <RouterLink to="/directory" class="hover:underline"> Directory </RouterLink>

            <RouterLink to="/new-members" class="hover:underline"> New Members </RouterLink>

            <RouterLink to="/committees" class="hover:underline"> Committees </RouterLink>

            <RouterLink to="/resources" class="hover:underline"> Resources </RouterLink>
          </div>

          <button
            class="ml-4 flex items-center justify-center md:hidden cursor-pointer"
            @click="isOpen = true"
          >
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

  <BaseDrawer :is-open="isOpen" labelled-by="mobile-menu-title" @close="closeDrawer">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 id="mobile-menu-title" class="text-xl font-semibold text-(--color-app-text)">Menu</h2>
        <button class="text-sm text-(--color-brand-red)/60" type="button" @click="closeDrawer">
          Close
        </button>
      </div>
    </template>

    <div class="flex flex-col divide-y divide-(--color-app-border)">
      <RouterLink to="/directory" class="block py-4 text-(--color-app-text)" @click="closeDrawer">
        Directory
      </RouterLink>

      <RouterLink to="/new-members" class="block py-4 text-(--color-app-text)" @click="closeDrawer">
        New Members
      </RouterLink>

      <RouterLink to="/committees" class="block py-4 text-(--color-app-text)" @click="closeDrawer">
        Committees
      </RouterLink>

      <RouterLink to="/resources" class="block py-4 text-(--color-app-text)" @click="closeDrawer">
        Resources
      </RouterLink>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import PageContainer from '@/components/layout/PageContainer.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

const isOpen = ref(false)

function closeDrawer() {
  isOpen.value = false
}
</script>
