<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store"
import LlmService from "@/background/services/llm"
import { debounce } from "@/utils/common"
const settingsStore = useSettingsStore()
const loading = ref(false)

const debouncedValidation = debounce(async (key: string) => {
  loading.value = true
  settingsStore.setLlmApiKeyIsValid(false)
  const isValid = await LlmService.validateApiKey(key)
  settingsStore.setLlmApiKeyIsValid(isValid)
  loading.value = false
}, 300)

function llmApiKeyChanged(event: Event) {
  const key = (event.target as HTMLInputElement).value
  settingsStore.setLlmApiKey(key) // Updates immediately
  debouncedValidation(key) // Debounced validation
}
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
        :value="settingsStore.llmApiKey"
        class="input input-bordered input-sm max-w-md"
        @input="llmApiKeyChanged"
      />
    </div>
    <div
      v-if="loading"
      class="text-xs"
    >
      Validating api key ... wait ...
    </div>
    <div
      v-else-if="settingsStore.llmApiKeyIsValid === false"
      class="text-error text-xs mt-1"
    >
      API key is invalid :(
      <div class="text-xs text-gray-500">
        Go to
        <a href="https://aistudio.google.com/apikey">
          https://aistudio.google.com/apikey
        </a>
        and click on 'Create API Key'
      </div>
    </div>
    <div
      v-else
      class="text-success text-xs mt-1"
    >
      Valid key, awesome :)
    </div>
  </div>
</template>
