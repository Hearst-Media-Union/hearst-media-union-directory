<template>
  <div class="w-full bg-(--color-brand-navy) text-white">
    <PageContainer>
      <div class="flex h-14 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-3">
          <div class="rounded bg-white">
            <img src="/images/logo.png" alt="HMU" class="h-12 w-auto" />
          </div>

          <span class="font-condensed text-lg font-semibold tracking-wide">
            Hearst Media Union
          </span>
        </RouterLink>

        <div class="flex items-center">
          <div class="hidden items-center gap-6 text-sm md:flex">
            <RouterLink
              v-for="link in visibleNavLinks"
              :key="link.to"
              :to="link.to"
              class="hover:underline"
            >
              {{ link.label }}
            </RouterLink>
          </div>

          <button
            v-if="authStore.isAuthenticated"
            class="ml-6 hidden cursor-pointer text-sm hover:underline md:block"
            type="button"
            @click="signOut"
          >
            Log out
          </button>

          <button
            class="ml-4 flex cursor-pointer items-center justify-center md:hidden"
            type="button"
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
      <RouterLink
        v-for="link in visibleNavLinks"
        :key="link.to"
        :to="link.to"
        class="block py-4 text-(--color-app-text)"
        @click="closeDrawer"
      >
        {{ link.label }}
      </RouterLink>
      <button
        v-if="authStore.isAuthenticated"
        class="block py-4 text-left text-(--color-app-text)"
        type="button"
        @click="signOut"
      >
        Log out
      </button>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import PageContainer from '@/components/layout/PageContainer.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

type NavLink = {
  label: string
  to: string
}

const router = useRouter()
const authStore = useAuthStore()

const isOpen = ref(false)

const publicNavLinks: NavLink[] = [
  {
    label: 'New Members',
    to: '/new-members',
  },
  {
    label: 'Help',
    to: '/help',
  },
  {
    label: 'Contact',
    to: '/contact',
  },
]

const authenticatedNavLinks: NavLink[] = [
  {
    label: 'Directory',
    to: '/directory',
  },
  {
    label: 'Leadership',
    to: '/leadership',
  },
  {
    label: 'Committees',
    to: '/committees',
  },
  {
    label: 'Resources',
    to: '/resources',
  },
  {
    label: 'Help',
    to: '/help',
  },
  {
    label: 'Contact',
    to: '/contact',
  },
]

const visibleNavLinks = computed(() => {
  return authStore.isAuthenticated ? authenticatedNavLinks : publicNavLinks
})

async function signOut() {
  await authStore.signOut()
  closeDrawer()
  await router.push('/')
}

function closeDrawer() {
  isOpen.value = false
}
</script>
