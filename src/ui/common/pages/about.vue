<template>
  <div class="h-screen">
    <RouterLinkUp />

    <h1>About Us</h1>

    <p>
      Formacer is an AI-assisted Chrome autofill extension that helps you fill
      forms instantly with a single button click. You can save all your
      information in the extension once, and the extension takes care of filling
      it back in any kind of websites.
    </p>

    <p>
      <b>Developer</b>
      : Sudheer Tripathi
      <br />
      <b>Contact Email</b>
      : tripathisudheer604@gmail.com
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
