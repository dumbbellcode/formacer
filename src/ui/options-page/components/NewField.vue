<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue"

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

const emit = defineEmits(["cancel", "done"])

defineExpose({
  label,
  value,
  section,
  resetValues,
})

function handleDone() {
  if (label.value && value.value) {
    emit("done")
    resetValues()
  }
}
</script>

<template>
  <div class="p-1 border-1 rounded-lg bg-base-200">
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
        <legend class="fieldset-legend">Related To</legend>
        <input
          v-model="section"
          class="input"
          type="text"
          list="options"
        />
        <datalist id="options">
          <option
            v-for="group in props.groups"
            :key="group"
            :value="group"
          >
            {{ group }}
          </option>
        </datalist>
        <!-- <select
          v-model="section"
          class="select select-bordered"
        >
          <option selected>
            Other Details
          </option>
          <option
            v-for="group in props.groups"
            :key="group"
            :value="group"
          >
            {{ group }}
          </option>
        </select> -->
      </fieldset>
    </div>

    <div class="flex gap-x-2 mt-4">
      <button
        class="btn btn-md border-1"
        @click="$emit('cancel')"
      >
        <i-ph-x-circle />
        {{ "Cancel" }}
      </button>

      <button
        class="btn btn-md bg-primary"
        :class="{
          'btn-disabled': !label || !value,
        }"
        @click="handleDone"
      >
        <i-ph-check-circle />
        {{ "Add" }}
      </button>
    </div>
  </div>
</template>
