<template>
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
      <div class="flex gap-2">
        <BaseInput
          v-model="password"
          class="flex-1"
          :type="passwordInputType"
          :autocomplete="authMode === 'login' ? 'current-password' : 'new-password'"
          required
        />

        <button
          class="cursor-pointer rounded border border-(--color-border) px-3 text-sm font-medium text-(--color-app-text-muted)"
          type="button"
          :aria-label="passwordToggleLabel"
          @click="togglePasswordVisibility"
        >
          {{ passwordToggleLabel }}
        </button>
      </div>
    </label>

    <ul v-if="authMode === 'signup'" class="space-y-1 text-xs text-(--color-app-text-muted)">
      <li>Password must be at least 8 characters.</li>
      <li>Password must include at least one letter.</li>
      <li>Password must include at least one number.</li>
    </ul>

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
      :disabled="isSubmitDisabled"
    >
      {{ submitLabel }}
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'

type AuthMode = 'login' | 'signup'
type PasswordInputType = 'text' | 'password'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const authMode = ref<AuthMode>('login')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isPasswordVisible = ref(false)

const isPasswordValid = computed(() => {
  return password.value.length >= 8 && /[A-Za-z]/.test(password.value) && /\d/.test(password.value)
})

const isSubmitDisabled = computed(() => {
  return authStore.isLoading || (authMode.value === 'signup' && !isPasswordValid.value)
})

const submitLabel = computed(() => {
  if (authStore.isLoading) {
    return authMode.value === 'login' ? 'Logging in...' : 'Creating account...'
  }

  return authMode.value === 'login' ? 'Log in' : 'Create account'
})

const passwordInputType = computed<PasswordInputType>(() => {
  return isPasswordVisible.value ? 'text' : 'password'
})

const passwordToggleLabel = computed(() => {
  return isPasswordVisible.value ? 'Hide' : 'Show'
})

function setAuthMode(nextAuthMode: AuthMode) {
  authMode.value = nextAuthMode
  errorMessage.value = ''
  successMessage.value = ''
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
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

    if (!isPasswordValid.value) {
      errorMessage.value = 'Password does not meet the requirements.'

      return
    }

    await authStore.signUp(email.value, password.value)

    password.value = ''
    authMode.value = 'login'
    successMessage.value = 'Account created. Check your email to confirm your account, then log in.'
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
