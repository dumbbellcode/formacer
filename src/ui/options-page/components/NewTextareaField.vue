<script setup lang="ts">
import { ref, defineEmits } from "vue"

const label = ref("")
const value = ref("")

const resetValues = () => {
  label.value = ""
  value.value = ""
}

const emit = defineEmits(["cancel", "done"])

defineExpose({
  label,
  value,
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
    <div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Label</legend>
        <input
          v-model="label"
          type="text"
          class="input w-full"
          placeholder="Eg: About Me"
        />
        <legend class="fieldset-legend">Description</legend>
        <textarea
          v-model="value"
          class="textarea w-full! textarea-neutral rounded-lg p-2"
          rows="5"
        ></textarea>
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
