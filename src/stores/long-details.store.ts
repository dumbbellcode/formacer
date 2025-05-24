import { AccurateDetails, DETAIL_TYPES } from "@/types/common"
import { initialCreativeDetailFields } from "@/ui/options-page/utils"

export const useLongDetailsStore = defineStore("long-details", () => {
  const detailsCache: Record<string, Ref<AccurateDetails>> = {}
  const profileId = ref("default")

  setActiveProfile(profileId.value)

  function setActiveProfile(activeProfileId: string) {
    profileId.value = activeProfileId
    const { data } = useBrowserSyncStorage<AccurateDetails>(
      `${activeProfileId}-${DETAIL_TYPES.LONG}`,
      {
        fields: initialCreativeDetailFields,
      },
    )
    detailsCache[activeProfileId] = data
  }

  const longDetails = computed(() => detailsCache[profileId.value].value)

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
    setActiveProfile,
    editField,
    deleteField,
    addNewField,
    details: computed(() => longDetails.value.fields),
  }
})
