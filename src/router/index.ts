import { h } from 'vue'
import type { Component } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/pages/LandingPage.vue'
import NewMembersPage from '@/components/pages/NewMembersPage.vue'
import LeadershipPage from '@/components/pages/LeadershipPage.vue'
import CommitteesPage from '@/components/pages/CommitteesPage.vue'
import ResourcesPage from '@/components/pages/ResourcesPage.vue'

const DirectoryPage: Component = {
  render() {
    return h('div', 'Directory Page')
  },
}

const HelpPage: Component = {
  render() {
    return h('div', 'Help Page')
  },
}

const ContactPage: Component = {
  render() {
    return h('div', 'Contact Page')
  },
}

const AdminPage: Component = {
  render() {
    return h('div', 'Admin Dashboard Page')
  },
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/directory',
      name: 'directory',
      component: DirectoryPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/leadership',
      name: 'leadership',
      component: LeadershipPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/committees',
      name: 'committees',
      component: CommitteesPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/resources',
      name: 'resources',
      component: ResourcesPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/new-members',
      name: 'new-members',
      component: NewMembersPage,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/help',
      name: 'help',
      component: HelpPage,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactPage,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = true
  const isAdmin = false

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      path: '/',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return {
      path: '/',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  return true
})

export default router
