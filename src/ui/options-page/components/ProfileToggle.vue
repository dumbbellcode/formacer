<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings.store"
import { useDetailsStore } from "@/stores/short-details.store"
import { useLongDetailsStore } from "@/stores/long-details.store"

const props = defineProps({
    displayAddNewButton: {
        type: Boolean,
        default: true,
    },
})

const store = useSettingsStore()
const detailsStore = useDetailsStore()
const longDetailsStore = useLongDetailsStore()

const selectedProfileId = ref("")
const addingNewProfile = ref(false)
const newProfileName = ref("")

store.resolveActiveProfileId().then((id) => {
  selectedProfileId.value = id
  detailsStore.setActiveProfile(id)
  longDetailsStore.setActiveProfile(id)
})

function setSelectedProfileAsActive() {
  store.setActiveProfileId(selectedProfileId.value)
  detailsStore.setActiveProfile(selectedProfileId.value)
  longDetailsStore.setActiveProfile(selectedProfileId.value)
}

</script>

<template>
  <div class="flex flex-row gap-x-2 items-center">
    <div class="w-1/2">
      <select
        v-model="selectedProfileId"
        class="select select-md"
        @change="setSelectedProfileAsActive"
      >
        <option
          v-for="profile in store.profiles"
          :key="profile.id"
          :value="profile.id"
          :selected="profile.id === store.activeProfileId ? true : false"
        >
          {{ profile.name }}
        </option>
      </select>
    </div>
    <div
      v-if="!addingNewProfile && props.displayAddNewButton"
      class="text-primary text-lg hover:text-xl hover:text-secondary tooltip"
      data-tip="Add new profile"
    >
      <i-ph-plus-circle @click="addingNewProfile = true" />
    </div>
  </div>

  <div
    v-if="addingNewProfile"
    class="mt-2 p-2 border-primary rounded-lg bg-base-200"
  >
    <div class="flex gap-x-2 items-center">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">New Profile Name</legend>
        <input
          v-model="newProfileName"
          type="text"
          class="input"
          placeholder="New Profile Name"
        />
      </fieldset>
    </div>
    <div class="flex gap-x-2 mt-4">
      <button
        class="btn btn-md border-1"
        @click="
          () => {
            addingNewProfile = false
            newProfileName = ''
          }
        "
      >
        <i-ph-x-circle />
        {{ "Cancel" }}
      </button>

      <button
        class="btn btn-md bg-primary"
        :class="{
          'btn-disabled': !newProfileName,
        }"
        @click="
          () => {
            store.addNewProfile(newProfileName)
            addingNewProfile = false
            newProfileName = ''
          }
        "
      >
        <i-ph-check-circle />
        {{ "Add" }}
      </button>
    </div>
  </div>
</template>
