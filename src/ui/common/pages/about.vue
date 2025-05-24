<script setup lang="ts">
import { YT_PLAYLIST_LINK } from "@/utils/common"
</script>

<template>
  <div class="h-screen">
    <RouterLinkUp />

    <h1>About Us</h1>

    <p>
      Formacer is an AI-assisted Chrome autofill extension that helps you fill
      forms instantly with a single button click. You can save all your
      information in the extension once, and the extension takes care of filling
      it back in any kind of websites. Learn more about the Formacer on
      <a :href="YT_PLAYLIST_LINK">this youtube channel playlist</a>
    </p>

    <p>
      <b>Developer</b>
      : Sudheer Tripathi
      <br />
      <b>Please provide your valuable feedback here</b>
      :
      <a href="mailto:tripathisudheer604@gmail.com?subject=Feedback%20-%20">
        tripathisudheer604@gmail.com
      </a>
    </p>

    <ul class="list-disc pl-5">
      <li>
        <RouterLink
          to="/common/privacy-policy"
          class="text-blue-500 hover:underline"
        >
          Privacy Policy
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/common/terms-of-service"
          class="text-blue-500 hover:underline"
        >
          Terms
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
