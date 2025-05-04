<script setup lang="ts">
import PageWrap from "@/components/PageWrap.vue"
import { useSettingsStore } from "@/stores/settings.store"
import DetailsForm from "@/ui/options-page/components/DetailsForm.vue"
import TextareaDetailsForm from "@/ui/options-page/components/TextareaDetailsForm.vue"

const settingsStore = useSettingsStore()
const displayName = __DISPLAY_NAME__
// const version = __VERSION__

const step = ref(1)
</script>

<template>
  <div
    class="w-full h-full items-center text-center min-h-screen"
  >
    <h3>Installed! 🚀 Let's set you up !</h3>
    <div
      v-if="!settingsStore.serverToken"
      class="text-center mt-20"
    >
      <LogYouIn />
    </div>
    <div v-else>
      <ul class="steps steps-horizontal">
        <li :class="['step',{'step-primary': step > 0}]">Details</li>
        <li :class="['step',{'step-primary': step > 1}]">Long Details</li>
        <li :class="['step',{'step-primary': step > 2}]">Done !</li>
      </ul>

      <PageWrap class="text-left">
        <div class="flex justify-between my-2">
          <div
            @click="step = step - 1"
          >
            <button
              v-if="step > 1"
              class="btn btn-sm my-4"
            >
              <i-ph-arrow-left />
              {{ "Back" }}
            </button>
          </div>
          <div
            @click="step = step + 1"
          >
            <button
              v-if="step < 3"
              class="btn btn-sm my-4"
            >
              {{ "Next" }}
              <i-ph-arrow-right />
            </button>
          </div>
        </div>
      

        <div
          v-if="step === 1"
          role="alert"
          class="alert alert-outline alert-info alert-soft mb-2"
        >
          <i-ph-info />
          <span>
            Enter short details that you want to get autofilled on websites here. 
            Click the 'Add New' button to add custom details you want to autofill. 
            Click Next to skip or proceed.
          </span>
        </div>
        <DetailsForm v-if="step === 1" />

        <div
          v-if="step === 2"
          role="alert"
          class="alert alert-outline alert-info alert-soft"
        >
          <i-ph-info />
          <span>
            Enter long details that you want to get autofilled. 
            Click Next to skip or proceed.
          </span>
        </div>
        <TextareaDetailsForm v-if="step === 2" />
        <div v-if="step === 3">
          <div class="flex flex-row items-center py-auto">
            <div> You will see a  </div>
            <div class="mx-2">
              <div class="border-1 border-primary rounded-full">
                <img
                  src="@assets/logo.svg"
                  alt="logo"
                  :width="24"
                  class="m-1!"
                />
              </div>
            </div>
            <div> icon on bottom right of web pages.</div>
          </div>
          <div class="mt-2"> You're all set. Bookmark the extension & close this page. </div>
        </div>
      </PageWrap>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
