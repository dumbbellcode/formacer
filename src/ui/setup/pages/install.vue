<script setup lang="ts">
import PageWrap from "@/components/PageWrap.vue"
import { useSettingsStore } from "@/stores/settings.store"
import DetailsForm from "@/ui/options-page/components/DetailsForm.vue"
import TextareaDetailsForm from "@/ui/options-page/components/TextareaDetailsForm.vue"
import { isDevelopmentEnv, YT_PLAYLIST_LINK } from "@/utils/common"

const settingsStore = useSettingsStore()
const displayName = __DISPLAY_NAME__
// const version = __VERSION__
const agreementDeclined = ref(false)
const step = ref(1)

if(isDevelopmentEnv()) {
  settingsStore.setDummyValuesForLocalDev()
}

function onAgreementDecline() {
  agreementDeclined.value = true
  settingsStore.clearTokens()
}
</script>

<template>
  <div class="w-full h-full items-center text-center min-h-screen">
    <h3 v-if="!agreementDeclined">Installed! 🚀 Let's set you up !</h3>
    <div
      v-if="agreementDeclined"
      class="px-20 py-4"
    >
      You've been logged out because you declined the data privacy notice.
      <br />
      The extension cannot operate without sending the data to servers
      temporarily,
      <br />
      which enables AI to fill forms smartly and correctly. You can find more
      about the extension on
      <a :href="YT_PLAYLIST_LINK">this youtube channel</a>
    </div>
    <div
      v-if="!settingsStore.serverToken"
      class="text-center mt-20"
    >
      <LogYouIn />
    </div>
    <div v-else>
      <ul class="steps steps-horizontal">
        <li :class="['step', { 'step-primary': step > 0 }]">Notice</li>
        <li :class="['step', { 'step-primary': step > 1 }]">
          Details (optional)
        </li>
        <li :class="['step', { 'step-primary': step > 2 }]">Done !</li>
      </ul>

      <PageWrap class="text-left">
        <div class="flex justify-between my-2">
          <div @click="step = step - 1">
            <button
              v-if="step > 1"
              class="btn btn-sm my-4"
            >
              <i-ph-arrow-left />
              {{ "Back" }}
            </button>
          </div>
          <div @click="step = step + 1">
            <button
              v-if="step < 3 && step != 1"
              class="btn btn-sm my-4"
            >
              {{ "Next" }}
              <i-ph-arrow-right />
            </button>
          </div>
        </div>

        <div v-if="step === 1">
          <h2 class="card-title text-center">How This Extension Works</h2>
          <div class="divider"></div>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              Temporarily sends the data you provide to our servers to enable
              the autofill functionality
            </li>
            <li>
              Does not collect or permanently store your personal information
            </li>
            <li>
              Only processes the data you explicitly provide for autofill
              purposes
            </li>
          </ul>
          <p class="mt-3">Your data is encrypted during transmission.</p>
          <p class="mt-2">
            Please read our full
            <RouterLink
              to="/common/terms-of-service"
              class="link link-primary"
            >
              Terms of Service
            </RouterLink>
            and
            <RouterLink
              to="/common/privacy-policy"
              class="link link-primary"
            >
              Privacy Policy
            </RouterLink>
            for more details.
          </p>
          <div class="card-actions justify-end mt-4">
            <button
              class="btn btn-outline"
              @click="onAgreementDecline"
            >
              Decline
            </button>
            <button
              class="btn btn-primary"
              @click="settingsStore.tosAgreed();step = step + 1"
            >
              Accept
            </button>
          </div>
        </div>

        <div v-if="step === 2">
          <div
            role="alert"
            class="alert alert-outline alert-info alert-soft mb-2"
          >
            <i-ph-info />
            <span>
              Enter short details that you want to get autofilled on websites
              here. Click the 'Add New' button to add custom details you want to
              autofill. You can skip this and add details later too. Click Next.
              All fields are optional.
            </span>
          </div>

          <p class="text-xl mb-1">Autofill Details</p>
          <DetailsForm />
          <p class="text-xl mb-1">Long Autofill Details</p>
          <TextareaDetailsForm />

          <div class="mt-6 text-center">
            <button
              class="btn btn-primary"
              @click="step = step + 1"
            >
              {{ "Continue" }}
              <i-ph-arrow-right />
            </button>
          </div>
        </div>

        <div v-if="step === 3">
          <div class="flex flex-row items-center py-auto">
            <div>You will see a</div>
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
            <div>icon on bottom right of web pages.</div>
          </div>
          <div class="mt-2">
            You're all set. Bookmark the extension & close this page.
          </div>
        </div>
      </PageWrap>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
