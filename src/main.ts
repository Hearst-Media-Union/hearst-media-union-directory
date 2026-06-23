import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/tailwind.css'
import './styles/main.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const { useAuthStore } = await import('@/stores/auth')
const authStore = useAuthStore(pinia)

await authStore.initializeAuth()

app.use(router)

app.mount('#app')
