<script setup lang="ts">
import {
  AccurateDetailItem,
  AccurateDetails,
  DETAIL_TYPES,
} from "@/types/common"
import NewField from "../components/NewField.vue"
import { initialAccurateDetailFields } from "../utils"

const newFieldActive = ref(false)
const newFieldRef = ref<InstanceType<typeof NewField> | null>(null)

const { data: detail } = useBrowserSyncStorage<AccurateDetails>(
  DETAIL_TYPES.ACCURATE,
  {
    fields: initialAccurateDetailFields,
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

function editField(event: Event, id: string) {
  const input = event.target as HTMLInputElement
  const field = detail.value.fields?.find((field) => field.id === id)
  if (!field) return
  field.value = input.value
}

function addNewField() {
  if (!newFieldRef.value) {
    return
  }
  const { label, value, section } = newFieldRef.value
  detail.value.fields?.push({
    label,
    value,
    section: section ? section : label,
    id: crypto.randomUUID(),
  })
}
</script>

<template>
  <div
    v-for="(detailItems, section) in basicDetails"
    :key="section"
  >
    <div class="divider divider-end mt-4 mb-0">
      <span class="text-[8px] font-semibold">{{ section }}</span>
    </div>
    <div class="grid grid-cols-2 gap-1">
      <fieldset
        v-for="field in detailItems"
        :key="field.id"
        class="fieldset"
      >
        <legend class="fieldset-legend pt-1 pb-0">
          {{ field.label }}
        </legend>
        <input
          :id="field.id"
          type="text"
          class="input"
          :value="field.value"
          :autocomplete="field.autocomplete"
          @input="editField($event, field.id)"
        />
      </fieldset>
    </div>
  </div>

  <button
    v-if="!newFieldActive"
    class="btn btn-md btn-primary btn-outline mt-2"
    @click="newFieldActive = !newFieldActive"
  >
    <i-ph-plus-circle />
    {{ "Add New" }}
  </button>

  <NewField
    v-if="newFieldActive"
    ref="newFieldRef"
    class="mt-2"
    :groups="Object.keys(basicDetails)"
    @cancel="newFieldActive = false"
    @done="addNewField"
  />
</template>
