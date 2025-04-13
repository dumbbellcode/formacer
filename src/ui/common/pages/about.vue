<template>
  <div>
    <RouterLinkUp />

    <h1>About Us</h1>

    <p>
      Formacer is an Open Source project that helps you fill forms automatically
      with the help of AI.
    </p>

    <div class="flex gap-2">
      <RouterLink
        to="/common/privacy-policy"
        class="btn btn-primary"
      >
        Privacy Policy
      </RouterLink>

      <RouterLink
        to="/common/terms-of-service"
        class="btn btn-primary"
      >
        Terms
      </RouterLink>

      <RouterLink
        to="/common/change-log"
        class="btn btn-primary"
      >
        Change Log
      </RouterLink>
    </div>
  </div>
</template>
