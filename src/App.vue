<template>
  <div class="min-h-screen bg-(--color-app-bg)">
    <!-- Full-width region -->
    <div class="w-full bg-(--color-brand-navy) text-white p-4">Full-width Nav Bar</div>

    <!-- Constrained content -->
    <PageContainer>
      <div class="py-6">
        <h1 class="text-xl font-semibold">Page Content</h1>
        <p>This content is constrained to the container.</p>
      </div>
    </PageContainer>
  </div>
</template>

<script setup lang="ts">
import PageContainer from '@/components/layout/PageContainer.vue'
</script>
