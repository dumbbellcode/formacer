<script setup lang="ts">
import DetailsForm from "../components/DetailsForm.vue"
import TextareaDetailsForm from "../components/TextareaDetailsForm.vue"
import ProfileToggle from "../components/ProfileToggle.vue"
</script>

<template>
  <div
    class="max-w-xl w-full mx-auto rounded-xl md:my-12 p-4 md:p-8 md:border border-base-200 md:shadow-lg bg-base-100"
  >
    <RouterLinkUp />

    <div
      role="alert"
      class="alert alert-outline alert-info alert-soft"
    >
      <i-ph-info />
      <span>
        Enter any detail you want to get autofilled here. Details entered here
        will be used to autofill your forms. Add new details using the add new
        button
      </span>
    </div>

    <div class="mt-4 mb-1">
      <ProfileToggle />
    </div>

    <h3 class="mt-4 mb-1">Autofill Details</h3>
    <DetailsForm />
    <h3 class="mt-4 mb-1">Long Autofill Details</h3>
    <TextareaDetailsForm />
  </div>
</template>
