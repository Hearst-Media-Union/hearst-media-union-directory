<template>
  <main
    class="flex min-h-screen flex-col items-center px-(--spacing-page-mobile-x) pt-16 text-center md:px-(--spacing-page-desktop-x) md:pt-24"
  >
    <img
      src="/images/logo.png"
      class="mb-4 h-28 w-28 md:h-36 md:w-36"
      width="144"
      height="144"
      alt="logo"
    />

    <h1 class="mb-4 max-w-2xl font-condensed text-4xl/[1.05] font-bold uppercase tracking-wide">
      Account confirmed
    </h1>

    <p class="mb-8 max-w-md text-base/normal opacity-80">
      Your email has been confirmed. You can now log in to access the member directory.
    </p>

    <BaseButton font="label" @click="goToLogin">Log in</BaseButton>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

async function goToLogin() {
  await router.push('/')
}
</script>
