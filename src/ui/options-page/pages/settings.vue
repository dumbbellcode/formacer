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
      <div
        class="flex flex-col md:flex-row justify-between text-sm hover-bg-primary-light rounded-lg px-1 mt-4"
      >
        <div class="mb-2 md:mb-0">
          <div>Gemini API Key</div>
        </div>
        <div>
          <input
            type="text"
            class="input input-bordered input-sm w-full"
            :value="settingsStore.llmApiKey"
            @input="
              settingsStore.setLlmApiKey(
                ($event.target as HTMLInputElement).value,
              )
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
