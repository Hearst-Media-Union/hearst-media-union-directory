import { h } from 'vue'
import type { Component } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/pages/LandingPage.vue'

const DirectoryPage: Component = {
  render() {
    return h('div', 'Directory Page')
  },
}

const LeadershipPage: Component = {
  render() {
    return h('div', 'Leadership Page')
  },
}

const CommitteesPage: Component = {
  render() {
    return h('div', 'Committees Page')
  },
}

const ResourcesPage: Component = {
  render() {
    return h('div', 'Resources Page')
  },
}

const NewMembersPage: Component = {
  render() {
    return h('div', 'New Members Page')
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
    },
    {
      path: '/directory',
      name: 'directory',
      component: DirectoryPage,
    },
    {
      path: '/leadership',
      name: 'leadership',
      component: LeadershipPage,
    },
    {
      path: '/committees',
      name: 'committees',
      component: CommitteesPage,
    },
    {
      path: '/resources',
      name: 'resources',
      component: ResourcesPage,
    },
    {
      path: '/new-members',
      name: 'new-members',
      component: NewMembersPage,
    },
    {
      path: '/help',
      name: 'help',
      component: HelpPage,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactPage,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
  ],
})

export default router
