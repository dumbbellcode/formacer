<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store"

const settingsStore = useSettingsStore()

</script>

<template>
  <div class="flex flex-col text-sm rounded-lg px-1 mt-4 gap-y-1">
    <div class="mb-2 md:mb-0">
      <div class="flex items-center">
        <div>Gemini API Key</div>
        <div
          class="tooltip tooltip-right ml-1"
          data-tip="This is required for the extension to autofill using AI"
        >
          <i-ph-info class="w-4 h-4 text-gray-400 cursor-pointer" />
        </div>
      </div>
    </div>
    <div>
      <input
        type="text"
        class="input input-bordered input-sm max-w-md"
        :value="settingsStore.llmApiKey"
        @input="settingsStore.validateAndSetLlmApiKey(($event.target as HTMLInputElement).value)"
      />
    </div>
    <div
      v-if="settingsStore.llmApiKeyIsValid === false"
      class="text-error text-xs mt-1"
    >
      API key is invalid :(
    </div>
    <div
      v-if="settingsStore.llmApiKeyIsValid"
      class="text-success text-xs mt-1"
    >
      Valid key, awesome :)
    </div>
    <div
      v-if="!settingsStore.llmApiKeyIsValid"
      class="text-xs text-gray-500"
    >
      Go to
      <a href="https://aistudio.google.com/apikey"> https://aistudio.google.com/apikey </a>
      and click on 'Create API Key'
    </div>
  </div>
</template>
