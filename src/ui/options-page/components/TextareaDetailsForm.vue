<script setup lang="ts">
import NewTextareaField from "../components/NewTextareaField.vue"
import { useLongDetailsStore } from "@/stores/long-details.store"
const longDetailsStore = useLongDetailsStore()

const newTextareaFieldActive = ref(false)
const newTextareaFieldRef = ref<InstanceType<typeof NewTextareaField> | null>(
  null,
)

function editTextareaField(event: Event, id: string) {
  const textarea = event.target as HTMLTextAreaElement
  longDetailsStore.editField(id, textarea.value)
}

function addNewTextareaField() {
  if (!newTextareaFieldRef.value) {
    return
  }
  const { label, value } = newTextareaFieldRef.value
  longDetailsStore.addNewField(label, value)
}
</script>

<template>
  <div
    v-for="detailItem in longDetailsStore.details"
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
    class="btn btn-md btn-primary btn-outline mt-3"
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
