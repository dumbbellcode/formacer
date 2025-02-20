<script setup lang="ts">
</script>
<template>
  <div class="flex gap-x-1">
    <fieldset class="fieldset">
      <legend class="fieldset-legend"> Type / Label </legend>
      <input
        type="text"
        class="input"
        placeholder="Eg: Passport No"
      />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend"> Value </legend>
      <input
        type="text"
        class="input"
        placeholder="Eg: V18XXXX"
      />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend"> Value </legend>
      <select class="select select-bordered">
        <option
          disabled
          selected
        >
          Pick one
        </option>
        <option>Phone No</option>
        <option>Harry Potter</option>
        <option>Lord of the Rings</option>
        <option>Planet of the Apes</option>
        <option>Star Trek</option>
      </select>
    </fieldset>
  </div>
</template>
