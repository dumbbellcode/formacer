<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store"
const settingsStore = useSettingsStore()
</script>

<template>
  <div
    class="max-w-xl w-full mx-auto rounded-xl md:my-12 p-4 md:p-8 md:border border-base-200 md:shadow-lg bg-base-100"
  >
    <RouterLinkUp />
    <div class="h-80">
      <div
        class="flex justify-between text-sm hover-bg-primary-light rounded-lg px-1"
      >
        <div>Display autofill button on web pages</div>
        <div>
          <input
            type="checkbox"
            :checked="settingsStore.displayActionIcon"
            class="toggle toggle-primary"
            @click="settingsStore.toggleDisplayActionIcon"
          />
        </div>
      </div>
      <div>
        <GeminiApiKeyInput v-model="settingsStore.llmApiKey"/>
      </div>
    </div>
  </div>
</template>
