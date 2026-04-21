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

        <div class="flex items-center gap-6 text-sm">
          <span class="cursor-pointer">Directory</span>
          <span class="cursor-pointer">Committees</span>
          <span class="cursor-pointer">Resources</span>
        </div>
      </div>
    </PageContainer>
  </div>
</template>

<script setup lang="ts">
import PageContainer from '@/components/layout/PageContainer.vue'
</script>
