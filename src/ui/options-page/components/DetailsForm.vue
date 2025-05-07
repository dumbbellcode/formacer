<script setup lang="ts">
import NewField from "../components/NewField.vue"
import { useDetailsStore } from "@/stores/short-details.store"

const detailsStore = useDetailsStore()
const newFieldActive = ref(false)
const newFieldRef = ref<InstanceType<typeof NewField> | null>(null)

function editField(event: Event, id: string) {
  const input = event.target as HTMLInputElement
  detailsStore.editField(id, input.value)
}

function deleteField(id: string) {
  detailsStore.deleteField(id)
}

function addNewField() {
  if (!newFieldRef.value) {
    return
  }
  const { label, value, section } = newFieldRef.value
  detailsStore.addNewField(label, value, section ? section : "Other")
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(detailItems, section) in detailsStore.detailsGroupedBySection"
      :key="section"
    >
      <span class="text-[8px] font-semibold block pt-1 text-base-400">
        {{ section.toUpperCase() }}
      </span>

      <div class="grid grid-cols-4 gap-1">
        <fieldset
          v-for="field in detailItems"
          :key="field.id"
          :class="['fieldset', `col-span-${field.colSpan ?? 2}`]"
        >
          <legend class="fieldset-legend pt-0 pb-0">
            {{ field.label }}
            <span class="delete-icon">
              <i-lucide-delete
                width="1em"
                height="1em"
                class="stroke-red-300"
                @click="deleteField(field.id)"
              />
            </span>
          </legend>
          <input
            :id="field.id"
            type="text"
            class="input w-full"
            :value="field.value"
            :autocomplete="field.autocomplete"
            @input="editField($event, field.id)"
          />
        </fieldset>
      </div>
    </div>
  </div>

  <button
    v-if="!newFieldActive"
    class="btn btn-md btn-primary btn-outline mt-3"
    @click="newFieldActive = !newFieldActive"
  >
    <i-ph-plus-circle />
    {{ "Add New" }}
  </button>

  <NewField
    v-if="newFieldActive"
    ref="newFieldRef"
    class="mt-2"
    :groups="Object.keys(detailsStore.detailsGroupedBySection)"
    @cancel="newFieldActive = false"
    @done="addNewField"
  />
</template>

<style scoped>
.delete-icon {
  display: none; /* Hide the icon by default */
}

.fieldset-legend:hover .delete-icon {
  display: inline; /* Show the icon when the legend is hovered */
}
</style>
