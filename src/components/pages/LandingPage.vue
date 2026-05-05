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

    <button
      type="button"
      class="font-label flex min-h-12 items-center justify-center rounded-md bg-(--color-app-primary) px-6 text-base font-semibold uppercase tracking-wide text-white hover:cursor-pointer hover:bg-(--color-app-primary-hover)"
    >
      Login
    </button>
  </main>
</template>
