<script setup lang="ts">
import { Notivue, Notification } from "notivue"
</script>

<template>
  <div class="flex min-h-screen flex-col bg-base-100">
    <AppHeader />

    <div class="p-4 prose flex-1">
      <RouterView />
    </div>

    <AppFooter />

    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
  </div>
</template>

<style scoped></style>
