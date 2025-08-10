<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store"
import { computed } from "vue"

const settingsStore = useSettingsStore()

const isTosAgreed = computed(() => settingsStore.isTosAgreed)
const hasLlmApiKey = computed(
  () => settingsStore.llmApiKey && settingsStore.llmApiKeyIsValid,
)

function openOptionsPage() {
  chrome.runtime.sendMessage({ action: "openOptionsPage" })
}
</script>

<template>
  <div>
    <div
      v-if="!isTosAgreed"
      class="my-20 text-center"
    >
      Please complete the setup
      <RouterLink
        to="/setup/install"
        class="text-blue-500 hover:underline"
      >
        here
      </RouterLink>
    </div>
    <div
      v-else-if="!hasLlmApiKey"
      class="text-center my-20"
    >
      <p>
        Please add your Gemini API key in the settings to enable AI autofill.
      </p>
      <RouterLink
        to="/options-page/settings"
        class="text-blue-500 hover:underline"
      >
        Go to Settings
      </RouterLink>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
