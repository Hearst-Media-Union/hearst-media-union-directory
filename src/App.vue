<template>
  <div class="min-h-screen bg-(--color-app-bg)">
    <TopNav />

    <PageContainer>
      <RouterView />
    </PageContainer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNav from '@/components/layout/TopNav.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
</script>
