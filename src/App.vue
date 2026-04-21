<template>
  <div class="min-h-screen bg-(--color-app-bg)">
    <TopNav />

    <PageContainer>
      <div class="py-6">
        <h1 class="text-xl font-semibold">Page Content</h1>
      </div>
    </PageContainer>

    <BaseDrawer>
      <div class="px-4 pb-6">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-(--color-app-text)">Filters (2)</h2>
          <button class="text-sm text-(--color-brand-red)/60">Reset</button>
        </div>

        <p class="text-meta font-label text-(--color-app-text)">Placeholder content</p>
      </div>

      <template #footer>
        <div class="bg-(--color-brand-red) px-4 py-4 text-center text-sm font-semibold text-white">
          Apply Filters
        </div>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import PageContainer from '@/components/layout/PageContainer.vue'
import TopNav from '@/components/layout/TopNav.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
</script>
