<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from "vue"

const props = defineProps({
  groups: {
    type: Array<string>,
    required: true,
  },
})

const label = ref("")
const value = ref("")
const section = ref("")
const resetValues = () => {
  label.value = ""
  value.value = ""
  section.value = ""
}

const emit = defineEmits(["updateFields", "cancel", "done"])

watch([label, value, section], ([newLabel, newValue, newType]) => {
  emit("updateFields", { label: newLabel, value: newValue, type: newType })
})

defineExpose({
  label,
  value,
  section,
  resetValues,
})
</script>

<template>
  <div class="p-1 border-1">
    <div class="flex gap-x-1">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Label</legend>
        <input
          v-model="label"
          type="text"
          class="input"
          placeholder="Eg: Passport No"
        />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Value</legend>
        <input
          v-model="value"
          type="text"
          class="input"
          placeholder="Eg: V18XXXX"
        />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Type</legend>
        <select
          v-model="section"
          class="select select-bordered"
        >
          <option
            disabled
            selected
          >
            Pick one
          </option>
          <option
            v-for="group in props.groups"
            :key="group"
            :value="group"
          >
            {{ group }}
          </option>
        </select>
      </fieldset>
    </div>

    <div class="flex gap-x-2 mt-4">
      <button>
        <i-ph-x-circle
          @click="$emit('cancel')"
        />
      </button>

      <i-ph-check-circle
        @click="$emit('done')"
      >
        Done
      </i-ph-check-circle>
    </div>
  </div>
</template>
