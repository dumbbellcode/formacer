<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store"
import { useDetailsStore } from "@/stores/short-details.store"
import ProfileToggle from "@/ui/options-page/components/ProfileToggle.vue"
import AuthGuard from "@/components/auth/AuthGuard.vue"

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

<!-- This guard checks if user has agreed TOS and filled a valid API key -->
<template>
  <div>
    <div class="hero">
      <AuthGuard>
        <div class="hero-content text-center">
          <div class="max-w-md">
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
                        v-for="field in detailItems.filter((f) =>
                          f.value.trim(),
                        )"
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
      </AuthGuard>
    </div>
  </div>
</template>

<style scoped></style>
