<script setup lang="ts">
function openOptionsPage() {
  chrome.runtime.sendMessage({ action: "openOptionsPage" })
}
</script>

<template>
  <div>
    <div class="hero">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <div class="flex flex-col text-left gap-y-2 mb-2">
            <div class="mt-2">
              <button
                class="btn btn-outline"
                @click="openOptionsPage"
              >
                Edit details
              </button>
            </div>
          </div>

          <div class="flex gap-2 justify-center mb-4">
            <RouterLink
              to="/common/features"
              class="btn btn-primary"
            >
              <i-ph-list-heart />
              Features
            </RouterLink>
            <RouterLink
              to="/common/pricing"
              class="btn btn-primary"
            >
              <i-ph-presentation-chart />
              Pricing
            </RouterLink>
          </div>

          <RouterLink
            to="/common/account/login"
            class="btn btn-secondary btn-lg"
          >
            <i-ph-rocket-launch />
            Get Started Now
          </RouterLink>

          <br />

          <RouterLink
            to="/action-popup/playground"
            class="btn btn-link"
          >
            Playground
          </RouterLink>

          <a
            class="btn btn-link"
            href="https://github.com/mubaidr/vite-vue3-browser-extension-v3"
          >
            Documentation
          </a>

          <a
            class="btn btn-link"
            href="https://mubaidr.js.org"
          >
            Support
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
