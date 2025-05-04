import {
  AccurateDetailItem,
  AccurateDetails,
  DETAIL_TYPES,
} from "@/types/common"
import { initialAccurateDetailFields } from "@/ui/options-page/utils"
import { useSettingsStore } from "./settings.store"

export const useDetailsStore = defineStore("short-details", () => {
  const settingsStore = useSettingsStore()
  const { data: shortDetails } = useBrowserSyncStorage<AccurateDetails>(
    `${settingsStore.activeProfileId}-${DETAIL_TYPES.SHORT}`,
    {
      fields: initialAccurateDetailFields,
    },
  )

  function editField(fieldId: string, value: string) {
    const field = shortDetails.value.fields?.find(
      (field) => field.id === fieldId,
    )
    if (!field) return
    field.value = value
  }

  function deleteField(id: string) {
    const idx =
      shortDetails.value.fields?.findIndex((field) => field.id === id) ?? -1
    if (idx < 0) return
    shortDetails.value.fields?.splice(idx, 1)
  }

  function addNewField(label: string, value: string, section: string) {
    shortDetails.value.fields?.push({
      label,
      value,
      section: section ? section : "Other",
      id: crypto.randomUUID(),
    })
  }

  return {
    editField,
    deleteField,
    addNewField,
    detailsGroupedBySection: computed(() => {
      return (shortDetails.value.fields ?? []).reduce(
        (prev, curr) => {
          const key = curr.section ?? curr.id
          prev[key] ??= []
          prev[key].push(curr)
          return prev
        },
        {} as Record<string, AccurateDetailItem[]>,
      )
    }),
  }
})
