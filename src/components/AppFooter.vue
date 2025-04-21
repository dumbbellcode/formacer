<template>
  <footer
    class="flex justify-between bg-base-200 text-base-content items-center p-2 text-xs"
  >
    <aside>
      <p>Copyright © {{ new Date().getFullYear() }} - All right reserved</p>
    </aside>
    <nav class="flex gap-2">
      <RouterLink to="https://github.com/dumbbellcode/formacer">
        <i-carbon-logo-github />
      </RouterLink>
      <a href="https://youtu.be/171wM23qsjk">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          class="fill-current"
        >
          <path
            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
          ></path>
        </svg>
      </a>
    </nav>
  </footer>
</template>
