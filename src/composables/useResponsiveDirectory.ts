import { computed, onMounted, onUnmounted, ref } from 'vue'

const DESKTOP_BREAKPOINT_PX = 768

export function useResponsiveDirectory() {
  const viewportWidth = ref(
    typeof window === 'undefined' ? DESKTOP_BREAKPOINT_PX : window.innerWidth,
  )

  const updateViewportWidth = () => {
    viewportWidth.value = window.innerWidth
  }

  onMounted(() => {
    updateViewportWidth()
    window.addEventListener('resize', updateViewportWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewportWidth)
  })

  const isDesktopDirectory = computed(() => viewportWidth.value >= DESKTOP_BREAKPOINT_PX)

  const isMobileDirectory = computed(() => !isDesktopDirectory.value)

  return {
    isDesktopDirectory,
    isMobileDirectory,
  }
}
