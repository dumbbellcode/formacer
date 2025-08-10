<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store"
import { useDetailsStore } from "@/stores/short-details.store"
import ProfileToggle from "@/ui/options-page/components/ProfileToggle.vue"
const settingsStore = useSettingsStore()
const detailsStore = useDetailsStore()

settingsStore.resolveActiveProfileId().then((id) => {
  detailsStore.setActiveProfile(id)
})

function openOptionsPage() {
  chrome.runtime.sendMessage({ action: "openOptionsPage" })
}

const needMoreDetails = computed(() => {
  const count = detailsStore.fields.filter((field) => field.value)?.length ?? 0
  return count < 3
})
</script>

<template>
  <div>
    <div class="hero">
      <div
        v-if="!settingsStore.isTosAgreed"
        class="my-20"
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
        v-if="settingsStore.isTosAgreed"
        class="hero-content text-center"
      >
        <div v-if="!settingsStore?.googleToken">
          <LogYouIn />
        </div>
        <div
          v-else-if="
            !settingsStore.llmApiKey || !settingsStore.llmApiKeyIsValid
          "
          class="text-center my-20"
        >
          <p>
            Please add your Gemini API key in the settings to enable AI
            autofill.
          </p>
          <RouterLink
            to="/options-page/settings"
            class="text-blue-500 hover:underline"
          >
            Go to Settings
          </RouterLink>
        </div>
        <div
          v-else
          class="max-w-md"
        >
          <div
            class="card bg-base-100 card-sm shadow-sm"
            style="min-width: 20rem !important"
          >
            <div class="card-body text-left">
              <div class="min-h-20 max-h-60 overflow-auto">
                <ProfileToggle
                  class="mt-2 mb-4"
                  :display-add-new-button="false"
                />
                <div
                  v-for="(
                    detailItems, section
                  ) in detailsStore.detailsGroupedBySection"
                  :key="section"
                >
                  <span class="text-[8px] font-semibold">{{ section }}</span>
                  <div>
                    <span
                      v-for="field in detailItems.filter((f) => f.value.trim())"
                      :key="field.id"
                      class="block"
                    >
                      {{ field.label }}: {{ field.value }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                v-if="needMoreDetails"
                role="alert"
                class="alert alert-outline alert-info alert-soft"
              >
                <i-ph-info />
                <span>
                  Please add more details using the edit button to expand
                  autofill capabilities
                </span>
              </div>

              <div class="justify-end card-actions">
                <button
                  class="btn btn-outline btn-primary btn-sm"
                  @click="openOptionsPage"
                >
                  <i-ph-pencil />
                  Edit
                </button>
              </div>
            </div>
          </div>

          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
