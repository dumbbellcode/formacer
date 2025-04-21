<script setup lang="ts">
import { DETAIL_TYPES, CreativeDetails } from "@/types/common"
import NewTextareaField from "../components/NewTextareaField.vue"
import { initialCreativeDetailFields } from "../utils"

const newTextareaFieldActive = ref(false)
const newTextareaFieldRef = ref<InstanceType<typeof NewTextareaField> | null>(
  null,
)

const { data: creativeDetails } = useBrowserSyncStorage<CreativeDetails>(
  DETAIL_TYPES.CREATIVE,
  {
    fields: initialCreativeDetailFields,
  },
)

function editTextareaField(event: Event, id: string) {
  const textarea = event.target as HTMLTextAreaElement
  const field = creativeDetails.value.fields?.find((field) => field.id === id)
  if (!field) return
  field.value = textarea.value
}

function addNewTextareaField() {
  if (!newTextareaFieldRef.value) {
    return
  }
  const { label, value } = newTextareaFieldRef.value
  creativeDetails.value.fields?.push({
    label,
    value,
    id: crypto.randomUUID(),
  })
}
</script>

<template>
  <div
    v-for="detailItem in creativeDetails.fields"
    :key="detailItem.id"
  >
    <fieldset class="fieldset">
      <legend class="fieldset-legend pt-1 pb-0">
        {{ detailItem.label }}
      </legend>
      <textarea
        class="textarea w-full! rounded-lg p-2"
        :value="detailItem.value"
        rows="5"
        @input="editTextareaField($event, detailItem.id)"
      ></textarea>
    </fieldset>
  </div>

  <button
    v-if="!newTextareaFieldActive"
    class="btn btn-md btn-primary btn-outline mt-2"
    @click="newTextareaFieldActive = !newTextareaFieldActive"
  >
    <i-ph-plus-circle />
    {{ "Add New" }}
  </button>

  <NewTextareaField
    v-if="newTextareaFieldActive"
    ref="newTextareaFieldRef"
    class="mt-2"
    @cancel="newTextareaFieldActive = false"
    @done="addNewTextareaField"
  />
</template>
