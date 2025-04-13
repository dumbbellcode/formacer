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
          <div class="flex flex-col justify-center text-left gap-y-2 mb-2">
            <div class="mt-2">
              <button
                class="btn btn-outline"
                @click="openOptionsPage"
              >
                Edit details
              </button>
            </div>
          </div>

          <br />

          <RouterLink
            to="/action-popup/coming-soon"
            class="btn btn-link"
          >
            New features
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
