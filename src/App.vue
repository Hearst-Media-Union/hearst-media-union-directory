<template>
  <div class="min-h-screen bg-(--color-app-bg)">
    <TopNav />

    <PageContainer>
      <div class="py-6">
        <h1 class="text-xl font-semibold">Page Content</h1>
      </div>
    </PageContainer>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/layout/TopNav.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
</script>
