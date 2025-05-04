<script setup lang="ts">
document.body.style.fontFamily = 'Poppins'
</script>

<template>
  <div class="navbar p-2">
    <div class="flex-1 pl-2">
      <RouterLink
        to="/"
        class="flex gap-2 items-center"
      >
        <img
          src="@assets/logo.svg"
          alt="logo"
          class="h-8 w-auto"
        />
        <div class="text-base font-semibold">Formacer</div>
      </RouterLink>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal menu-xs">
        <li>
          <RouterLink to="/options-page/settings">
            <i-ph-gear />
          </RouterLink>
        </li>
        <li>
          <div class="dropdown dropdown-bottom dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="flex gap-1"
            >
              <i-ph-dots-three-vertical />
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-white rounded-box z-[1] shadow-lg"
            >
              <li><ThemeSwitch /></li>
              <li>
                <RouterLink
                  to="/common/about"
                  class="text-primary"
                >
                  <i-ph-question />
                  About
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/action-popup/coming-soon"
                  class="text-primary"
                >
                  <i-ph-clock-countdown />
                  New !
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
