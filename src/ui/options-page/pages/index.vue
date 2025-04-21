<script setup lang="ts">
import DetailsForm from "../components/DetailsForm.vue"
import TextareaDetailsForm from "../components/TextareaDetailsForm.vue"
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
        will be used to autofill your forms
      </span>
    </div>

    <h2 class="mt-4">Autofill Details</h2>

    <DetailsForm />

    <h2 class="mt-4 mb-1">Long Details</h2>

    <TextareaDetailsForm />
  </div>
</template>
