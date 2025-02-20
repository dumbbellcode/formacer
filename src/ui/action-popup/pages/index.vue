<script setup lang="ts">
import { useBrowserSyncStorage } from '@/composables/useBrowserStorage';
import plusCircle from '@/assets/icons/plus-circle.svg';
import NewField from '../../options-page/components.vue/NewField.vue';

interface BasicDetail {
  name?: string,
  phone?: string, 
  email?: string
}


const { data: detail, promise } = useBrowserSyncStorage<BasicDetail>(
  'basic-details',
  {},
)

let name = ref(detail.value.name);
let phone = ref(detail.value.phone);
let email = ref(detail.value.email);

function saveDetails(){
  detail.value.name = name.value;
  detail.value.phone = phone.value;
  detail.value.email = email.value;
  console.info(detail.value);
}

promise.then(() => {
  name.value = detail.value.name;
  phone.value = detail.value.phone;
  email.value = detail.value.email;
}).catch((error) => {
  console.error("Error resolving promise:", error);
});

function openOptionsPage() {
  chrome.runtime.sendMessage({ action: "openOptionsPage"})
}

</script>

<template>
  <div>
    <div class="hero">
      <div class="hero-content text-center">
        <div class="max-w-md">          
          <div class="flex flex-col text-left gap-y-2 mb-2">
            <div class="mt-2">
              <button
                class="btn btn-outline"
                @click="openOptionsPage"
              >
                Edit details
              </button>
            </div>
          </div>



          <div class="flex gap-2 justify-center mb-4">
            <RouterLink
              to="/common/features"
              class="btn btn-primary"
            >
              <i-ph-list-heart />
              Features
            </RouterLink>
            <RouterLink
              to="/common/pricing"
              class="btn btn-primary"
            >
              <i-ph-presentation-chart />
              Pricing
            </RouterLink>
          </div>

          <RouterLink
            to="/common/account/login"
            class="btn btn-secondary btn-lg"
          >
            <i-ph-rocket-launch />
            Get Started Now
          </RouterLink>

          <br />

          <RouterLink
            to="/action-popup/playground"
            class="btn btn-link"
          >
            Playground
          </RouterLink>

          <a
            class="btn btn-link"
            href="https://github.com/mubaidr/vite-vue3-browser-extension-v3"
          >
            Documentation
          </a>

          <a
            class="btn btn-link"
            href="https://mubaidr.js.org"
          >
            Support
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
