import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export type UserProfileRole = 'member' | 'admin'

export type UserProfile = {
  id: string
  auth_user_id: string
  member_id: string | null
  role: UserProfileRole
}

type MemberAuthStatus = {
  member_id: string
  has_profile: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)

  const isInitialized = ref(false)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => profile.value?.role === 'admin')

  async function initializeAuth() {
    isLoading.value = true

    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession()

    session.value = currentSession
    user.value = currentSession?.user ?? null

    if (user.value) {
      await fetchOrCreateProfile()
    }

    supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      session.value = nextSession
      user.value = nextSession?.user ?? null

      if (user.value) {
        await fetchOrCreateProfile()
      } else {
        profile.value = null
      }
    })

    isInitialized.value = true
    isLoading.value = false
  }

  async function fetchOrCreateProfile() {
    if (!user.value?.email) {
      profile.value = null

      return
    }

    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, auth_user_id, member_id, role')
      .eq('auth_user_id', user.value.id)
      .maybeSingle()

    if (profileError) {
      throw new Error(profileError.message)
    }

    if (existingProfile) {
      profile.value = existingProfile as UserProfile

      return
    }

    const { data: createdProfile, error: createProfileError } = await supabase
      .rpc('create_current_user_profile')
      .single()

    if (createProfileError) {
      profile.value = null
      await supabase.auth.signOut()

      throw new Error(createProfileError.message)
    }

    profile.value = createdProfile as UserProfile
  }

  async function signIn(email: string, password: string) {
    isLoading.value = true

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    isLoading.value = false

    if (error) {
      throw new Error(error.message)
    }
  }

  async function signUp(email: string, password: string) {
    isLoading.value = true

    const normalizedEmail = email.trim().toLowerCase()
    const { data: memberAuthStatus, error: memberAuthStatusError } = await supabase
      .rpc('get_member_auth_status_by_email', {
        input_email: normalizedEmail,
      })
      .maybeSingle()

    if (memberAuthStatusError) {
      isLoading.value = false

      throw new Error(memberAuthStatusError.message)
    }

    if (!memberAuthStatus) {
      isLoading.value = false

      throw new Error('Only active directory members can create an account.')
    }

    const typedMemberAuthStatus = memberAuthStatus as MemberAuthStatus

    if (typedMemberAuthStatus.has_profile) {
      isLoading.value = false

      throw new Error('An account already exists for this member. Try logging in instead.')
    }

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    })

    isLoading.value = false

    if (error) {
      throw new Error(error.message)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()

    session.value = null
    user.value = null
    profile.value = null
  }

  return {
    session,
    user,
    profile,
    isInitialized,
    isLoading,
    isAuthenticated,
    isAdmin,
    initializeAuth,
    fetchOrCreateProfile,
    signIn,
    signUp,
    signOut,
  }
})
