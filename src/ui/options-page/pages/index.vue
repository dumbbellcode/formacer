<script setup lang="ts">
import {
  AccurateDetailItem,
  AccurateDetails,
  DETAIL_TYPES,
  CreativeDetails,
} from "@/types/common"
import NewField from "../components/NewField.vue"
import NewTextareaField from "../components/NewTextareaField.vue"
import {
  initialAccurateDetailFields,
  initialCreativeDetailFields,
} from "../utils"

const newFieldActive = ref(false)
const newFieldRef = ref<InstanceType<typeof NewField> | null>(null)

const newTextareaFieldActive = ref(false)
const newTextareaFieldRef = ref<InstanceType<typeof NewTextareaField> | null>(
  null,
)

const { data: detail } = useBrowserSyncStorage<AccurateDetails>(
  DETAIL_TYPES.ACCURATE,
  {
    fields: initialAccurateDetailFields,
  },
)

const { data: creativeDetails } = useBrowserSyncStorage<CreativeDetails>(
  DETAIL_TYPES.CREATIVE,
  {
    fields: initialCreativeDetailFields,
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

function editTextareaField(event: Event, id: string) {
  const textarea = event.target as HTMLTextAreaElement
  const field = creativeDetails.value.fields?.find((field) => field.id === id)
  if (!field) return
  field.value = textarea.value
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
    class="max-w-xl w-full mx-auto rounded-xl md:my-12 p-4 md:p-8 md:border border-base-200 md:shadow-lg bg-base-100"
  >
    <RouterLinkUp />

    <h2>Accurate Fill Details</h2>

    <div
      v-for="(detailItems, section) in basicDetails"
      :key="section"
    >
      <div class="grid grid-cols-2 gap-2">
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

    <h2 class="mt-4">Creative Fill Details</h2>

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
  </div>
</template>
