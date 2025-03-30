<script setup lang="ts"></script>

<template>
  <div>
    <AppHeader />

    <div class="p-4 prose">
      <RouterView />
    </div>

    <AppFooter />

    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
  </div>
</template>

<style scoped></style>
