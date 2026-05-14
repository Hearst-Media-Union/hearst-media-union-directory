<template>
  <TopNav />

  <PageContainer>
    <RouterView />
  </PageContainer>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import PageContainer from './components/layout/PageContainer.vue'
import TopNav from './components/layout/TopNav.vue'
</script>
