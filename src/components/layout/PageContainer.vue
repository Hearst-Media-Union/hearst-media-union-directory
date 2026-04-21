<template>
  <div class="page-container">
    <slot />
  </div>
</template>

<style scoped>
.page-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--spacing-page-mobile-x);
}

@media (min-width: 48rem) {
  .page-container {
    padding: 0 var(--spacing-page-desktop-x);
  }
}
</style>
