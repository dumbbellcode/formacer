import { AccurateDetails, DETAIL_TYPES } from "@/types/common"
import { initialAccurateDetailFields, initialCreativeDetailFields } from "@/ui/options-page/utils"
import { useSettingsStore } from "./settings.store"

export const useLongDetailsStore = defineStore("long-details", () => {
  const settingsStore = useSettingsStore()
  const { data: longDetails } = useBrowserSyncStorage<AccurateDetails>(
    `${settingsStore.activeProfileId}-${DETAIL_TYPES.LONG}`,
    {
      fields: initialCreativeDetailFields,
    },
  )

  function editField(fieldId: string, value: string) {
    const field = longDetails.value.fields?.find(
      (field) => field.id === fieldId,
    )
    if (!field) return
    field.value = value
  }

  function deleteField(id: string) {
    const idx =
      longDetails.value.fields?.findIndex((field) => field.id === id) ?? -1
    if (idx < 0) return
    longDetails.value.fields?.splice(idx, 1)
  }

  function addNewField(label: string, value: string) {
    longDetails.value.fields?.push({
      label,
      value,
      id: crypto.randomUUID(),
    })
  }

  return {
    editField,
    deleteField,
    addNewField,
    details: computed(() => longDetails.value.fields),
  }
})
