<script setup lang="ts">
import NewField from "../components/NewField.vue"

const optionsStore = useOptionsStore()
const { toggleDark } = optionsStore
const { isDark, profile, others } = storeToRefs(optionsStore)
const newFieldActive = ref(false)
const newFieldRef = ref<InstanceType<typeof NewField> | null>(null)

interface DetailItem {
  label: string
  value: string
  slug: string
  placeholder?: string
  section?: string
  autocomplete?: string
}

interface Details {
  basic?: DetailItem[]
}

const initialFields = [
  {
    label: "First Name",
    slug: "firstName",
    value: "",
    section: "Name",
    autocomplete: "given-name",
  },
  {
    label: "Last Name",
    value: "",
    slug: "lastName",
    section: "Name",
    autocomplete: "family-name",
  },
  {
    label: "Email",
    slug: "email",
    section: "Contact",
    autocomplete: "email",
    value: "",
  },
  {
    label: "Phone No.",
    slug: "phone",
    section: "Contact",
    autocomplete: "tel-national",
    value: "",
  },
  {
    label: "Country",
    slug: "country",
    section: "Contact",
    autocomplete: "country",
    value: "",
  },
  {
    label: "Company",
    slug: "company",
    section: "Work",
    autocomplete: "organization",
    value: "",
  },
]

const { data: detail, promise } = useBrowserSyncStorage<Details>(
  "basic-details",
  {
    basic: initialFields,
  },
)

const basicDetails = computed(() => {
  return (detail.value.basic ?? []).reduce(
    (prev, curr) => {
      const key = curr.section ?? curr.slug
      prev[key] ??= []
      prev[key].push(curr)
      return prev
    },
    {} as Record<string, DetailItem[]>,
  )
})

function saveField(event: Event, slug: string) {
  const input = event.target as HTMLInputElement
  const field = detail.value.basic?.find((field) => field.slug === slug)
  if (!field) return
  field.value = input.value
  // detail.value.basic = basicDetails.value
}

// promise
//   .then(() => {})
//   .catch((error) => {
//     console.error("Error resolving promise:", error)
//   })

function handleCancel() {
  if (!newFieldRef.value) {
    return
  }
  const { resetValues } = newFieldRef.value
  resetValues()
}

function handleDone() {
  if (!newFieldRef.value) {
    return
  }
  const { label, value, section } = newFieldRef.value

  if(!label || !value) {
    return;
  }

  detail.value.basic?.push({
    label,
    value,
    section: section ? section : label,
    slug: label,
  })
}
</script>

<template>
  <div
    class="max-w-xl w-full mx-auto rounded-xl md:my-12 p-4 md:p-8 md:border border-base-200 md:shadow-lg bg-base-100"
  >
    <RouterLinkUp />

    <h1>Options</h1>

    <div
      v-for="(detailItems, section) in basicDetails"
      :key="section"
    >
      <div class="grid grid-cols-2 gap-2">
        <fieldset
          v-for="field in detailItems"
          :key="field.slug"
          class="fieldset"
        >
          <legend class="fieldset-legend pb-0">{{ field.label }}</legend>
          <input
            :id="field.slug"
            type="text"
            class="input"
            :value="field.value"
            :autocomplete="field.autocomplete"
            @input="saveField($event, field.slug)"
          />
        </fieldset>
      </div>
    </div>

    <div v-if="!newFieldActive">
      <i-ph-plus-circle 
        @click="newFieldActive = !newFieldActive"
      />
    </div>

    <NewField
      v-if="newFieldActive"
      ref="newFieldRef"
      :groups="Object.keys(basicDetails)"
      @cancel="handleCancel"
      @done="handleDone"
    />

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
