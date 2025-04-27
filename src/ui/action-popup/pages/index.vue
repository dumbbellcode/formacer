<script setup lang="ts">
import {
  AccurateDetailItem,
  AccurateDetails,
  DETAIL_TYPES,
} from "@/types/common"

function openOptionsPage() {
  chrome.runtime.sendMessage({ action: "openOptionsPage" })
}
const { data: detail } = useBrowserSyncStorage<AccurateDetails>(
  `default-${DETAIL_TYPES.ACCURATE}`,
  {
    fields: [],
  },
)

const basicDetails = computed(() => {
  return (detail.value.fields ?? []).reduce(
    (prev, curr) => {
      const key = curr.section ?? curr.id
      prev[key] ??= []
      prev[key].push(curr)
      return prev
    },
    {} as Record<string, AccurateDetailItem[]>,
  )
})

const needMoreDetails = computed(() => {
  const count = detail.value.fields?.filter((field) => field.value)?.length ?? 0
  return count < 3
})
</script>

<template>
  <div>
    <div class="hero">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <div
            class="card bg-base-100 card-sm shadow-sm"
            style="min-width: 20rem !important"
          >
            <div class="card-body text-left">
              <div class="min-h-20 max-h-60 overflow-auto">
                <div
                  v-for="(detailItems, section) in basicDetails"
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
