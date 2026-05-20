<template>
  <main
    class="flex min-h-screen flex-col items-center px-(--spacing-page-mobile-x) pt-16 text-center md:px-(--spacing-page-desktop-x) md:pt-24"
  >
    <img
      src="/images/logo.png"
      class="mb-2 h-32 w-32 md:h-45 md:w-45"
      width="180"
      height="180"
      alt="logo"
    />

    <h1
      class="mb-4 max-w-3xl font-condensed text-5xl/[1.05] font-bold uppercase tracking-wide md:text-6xl/[1.1]"
    >
      Hearst Media Union
    </h1>

    <p class="mb-8 max-w-xl text-base/normal opacity-80">
      A directory of active members, committees, and union resources.
    </p>

    <form class="flex w-full max-w-sm flex-col gap-4 text-left" @submit.prevent="submitAuthForm">
      <div class="flex justify-center gap-2 text-sm">
        <button
          :class="[
            'cursor-pointer border-b-2 px-2 pb-1',
            authMode === 'login'
              ? 'border-(--color-brand-red) font-semibold text-(--color-app-text)'
              : 'border-transparent text-(--color-app-text-muted)',
          ]"
          type="button"
          @click="setAuthMode('login')"
        >
          Log in
        </button>

        <button
          :class="[
            'cursor-pointer border-b-2 px-2 pb-1',
            authMode === 'signup'
              ? 'border-(--color-brand-red) font-semibold text-(--color-app-text)'
              : 'border-transparent text-(--color-app-text-muted)',
          ]"
          type="button"
          @click="setAuthMode('signup')"
        >
          Create account
        </button>
      </div>

      <label class="flex flex-col gap-1 text-sm font-medium text-(--color-app-text)">
        Email
        <BaseInput v-model="email" type="email" autocomplete="email" required />
      </label>

      <label class="flex flex-col gap-1 text-sm font-medium text-(--color-app-text)">
        Password
        <BaseInput
          v-model="password"
          type="password"
          :autocomplete="authMode === 'login' ? 'current-password' : 'new-password'"
          required
        />
      </label>

      <p v-if="errorMessage" class="text-sm text-(--color-brand-red)">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage" class="text-sm text-(--color-app-text-muted)">
        {{ successMessage }}
      </p>

      <BaseButton
        class="w-full justify-center"
        font="label"
        type="submit"
        :disabled="authStore.isLoading"
      >
        {{ submitLabel }}
      </BaseButton>
    </form>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'

type AuthMode = 'login' | 'signup'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const authMode = ref<AuthMode>('login')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const submitLabel = computed(() => {
  return authMode.value === 'login' ? 'Log in' : 'Create account'
})

function setAuthMode(nextAuthMode: AuthMode) {
  authMode.value = nextAuthMode
  errorMessage.value = ''
  successMessage.value = ''
}

async function submitAuthForm() {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (authMode.value === 'login') {
      await authStore.signIn(email.value, password.value)
      await router.push(getRedirectPath())

      return
    }

    await authStore.signUp(email.value, password.value)

    successMessage.value = 'Account created. Check your email if confirmation is required.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.'
  }
}

function getRedirectPath() {
  const redirectPath = route.query.redirect

  if (typeof redirectPath === 'string' && redirectPath.startsWith('/')) {
    return redirectPath
  }

  return '/directory'
}
</script>
