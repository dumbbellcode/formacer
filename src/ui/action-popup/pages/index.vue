<script setup lang="ts">
import { useBrowserSyncStorage } from '@/composables/useBrowserStorage';
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
console.info("HERE", toRaw(detail.value));
promise.then(() => {
  console.info("After resolve");
  name.value = detail.value.name;
  phone.value = detail.value.phone;
  email.value = detail.value.email;
  console.info("Stage2", name.value, phone.value, email.value);
}).catch((error) => {
  console.error("Error resolving promise:", error);
});

</script>

<template>
  <div>
    <div class="hero">
      <div class="hero-content text-center">
        <div class="max-w-md">          
          <div class="flex flex-col text-left gap-y-2 mb-2">
            <div> 
              <div class="label">
                <span class="label-text">Full Name</span>
              </div>
              <input
                v-model="name"
                type="text"
                placeholder="Name"
                class="input w-full max-w-xs"
              />
            </div>

            <div> 
              <div class="label">
                <span class="label-text">Phone</span>
              </div>
              <input
                v-model="phone"
                type="tel"
                placeholder="Phone No"
                class="input w-full max-w-xs"
              />
            </div>
            
            <div>
              <div class="label">
                <span class="label-text">Email</span>
              </div>
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                class="input w-full max-w-xs"
              />
            </div>

            <div>
              <button
                class="btn btn-outline btn-primary"
                @click="saveDetails"
              >
                Save
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
