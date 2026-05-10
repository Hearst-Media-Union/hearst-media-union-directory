<template>
  <TopNav />

  <PageContainer>
    <DirectoryPage />
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from './components/layout/PageContainer.vue'
import TopNav from './components/layout/TopNav.vue'
import DirectoryPage from './components/pages/DirectoryPage.vue'
</script>

<style scoped></style>
