<script setup lang="ts">
const optionsStore = useOptionsStore()
// const { toggleDark } = optionsStore
const { isDark, profile, others } = storeToRefs(optionsStore)

import { useBrowserSyncStorage } from '@/composables/useBrowserStorage';
import plusCircle from '@/assets/icons/plus-circle.svg';
import NewField from '../components/NewField.vue'

interface BasicDetail {
  name?: string,
  firstName?: string, 
  lastName?: string,
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
let firstName = ref(detail.value.firstName);
let lastName = ref(detail.value.lastName);

function saveDetails(){
  detail.value.name = name.value;
  detail.value.phone = phone.value;
  detail.value.email = email.value;
  detail.value.firstName = firstName.value;
  detail.value.lastName = lastName.value
}

promise.then(() => {
  name.value = detail.value.name;
  phone.value = detail.value.phone;
  email.value = detail.value.email;
}).catch((error) => {
  console.error("Error resolving promise:", error);
});

</script>

<template>
  <div
    class="max-w-xl w-full mx-auto rounded-xl md:my-12 p-4 md:p-8 md:border border-base-200 md:shadow-lg bg-base-100"
  >
    <RouterLinkUp />

    <h1>Options</h1>

    <div class="flex flex-col text-left gap-y-1 mb-2">
      <div class="flex justify-between gap-x-1">
        <div class="w-1/2"> 
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs pb-0">First Name</legend>
            <input
              v-model="firstName"
              type="text"
              class="input input-sm"
              placeholder="Type here"
              autocomplete="given-name"
            />
          </fieldset>
        </div>
        <div class="w-1/2">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs pb-0">Last Name</legend>
            <input
              v-model="lastName"
              type="text"
              class="input input-sm"
              placeholder="Type here"
              autocomplete="family-name"
            />
          </fieldset>
        </div>
      </div>

      <div class="flex gap-x-1"> 
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs pb-0">Phone</legend>
          <input
            v-model="phone"
            type="text"
            class="input input-sm"
            placeholder="Type here"
            autocomplete="tel"
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs pb-0">Email</legend>
          <input
            v-model="email"
            type="email"
            class="input input-sm"
            placeholder="Type here"
            autocomplete="off"
          />
        </fieldset>
      </div>

      <div>
        <NewField />
      </div>

      <div>
        <img
          class="w-5 h-5 inline"
          :src="plusCircle"
          alt="Plus Circle"
        > 
        <span> Add new field </span>
      </div>

      <div class="mt-2">
        <button
          class="btn btn-primary btn-outline"
          @click="saveDetails"
        >
          Save
        </button>
      </div>
    </div>


    <p>
      You can configure various options related to this extension here. These
      options/ settings are peristent, available in all contexts, implemented
      using Pinia and useBrowserStorage composable.
    </p>

    <h3>User Interface</h3>
    <p>Change application interface settings.</p>

    <div class="form-control">
      <label>Enabel Dark Theme</label>
      <input
        v-model="isDark"
        type="checkbox"
        class="toggle"
      />
    </div>

    <div class="form-control">
      <label>Change Language</label>
      <LocaleSwitch />
    </div>

    <h3>Profile</h3>
    <p>Change your name and age.</p>

    <div class="form-control">
      <label>Name</label>
      <input
        v-model="profile.name"
        type="text"
      />
    </div>

    <div class="form-control">
      <label>Age</label>
      <input
        v-model="profile.age"
        type="number"
      />
    </div>

    <h3>Others</h3>
    <p>Some other settings related to extension usage.</p>

    <div class="form-control">
      <label>Enable Awesome Feature</label>
      <input
        v-model="others.awesome"
        type="checkbox"
        class="checkbox"
      />
    </div>

    <div class="form-control">
      <label>Some Counter</label>
      <input
        v-model="others.counter"
        type="number"
      />
    </div>

    <p>
      * You can also make this a compoenent and then able to use this in any
      context like Popup, Developer Tools UI etc
    </p>
    <p>
      Feel free to change groups, lsitings or options as per your requirements.
    </p>
  </div>
</template>
