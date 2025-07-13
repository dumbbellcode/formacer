import { Settings } from "@/types/common"
import { defineStore } from "pinia"
import LlmService from "@/background/services/llm"
import { debounce } from "@/utils/common"

interface Tokens {
  google?: string
}

const defaultProfile = {
  id: "default",
  name: "Default Profile",
}

function patchOldData() {
  const storageKey = "settings"
  chrome.storage.sync.get([storageKey], (result) => {
    const settings = result[storageKey] || {}
    if (
      typeof settings.profiles === "object" &&
      !Array.isArray(settings.profiles)
    ) {
      settings.profiles = []
      chrome.storage.local.set({ [storageKey]: settings })
    }
  })
}

export const useSettingsStore = defineStore("settings", () => {
  // Patch when profiles was saved as an empty object
  patchOldData()

  const { data: settings, promise } = useBrowserSyncStorage<Settings>(
    "settings",
    {
      activeProfileId: defaultProfile.id,
      profiles: [defaultProfile],
      displayActionIcon: true,
      email: "",
      isTosAgreed: false,
      llmApiKey: "",
      llmApiKeyIsValid: null
    },
  )

  const { data: tokens } = useBrowserLocalStorage<Tokens>("tokens", {
    google: "",
  })

  function toggleDisplayActionIcon() {
    settings.value.displayActionIcon = !settings.value.displayActionIcon
  }

  function setEmail(email: string) {
    settings.value.email = email
  }

  function addNewProfile(name: string) {
    const id = crypto.randomUUID()
    settings.value.profiles.push({
      id,
      name,
    })
  }

  function setActiveProfileId(id: string) {
    settings.value.activeProfileId = id
  }

  function setGoogleToken(token: string) {
    tokens.value.google = token
  }

  function clearTokens() {
    tokens.value = {}
  }

  function tosAgreed() {
    settings.value.isTosAgreed = true
  }

  const validateAndSetLlmApiKey = debounce(async (apiKey: string) => {
    if (!apiKey) {
      settings.value.llmApiKey = ""
      settings.value.llmApiKeyIsValid = null
      return
    }
    settings.value.llmApiKey = apiKey
    const isValid = await LlmService.validateApiKey(apiKey)
    if (isValid) {
      settings.value.llmApiKeyIsValid = true
    } else {
      settings.value.llmApiKeyIsValid = false
    }
  }, 300)

  function setDummyValuesForLocalDev() {
    tokens.value = {
      google: "dummy",
    }
    tosAgreed()
  }

  async function resolveActiveProfileId() {
    return promise.then(() => settings.value.activeProfileId)
  }

  return {
    toggleDisplayActionIcon,
    setEmail,
    setActiveProfileId,
    resolveActiveProfileId,
    addNewProfile,
    setGoogleToken,
    clearTokens,
    tosAgreed,
    validateAndSetLlmApiKey,
    setDummyValuesForLocalDev,
    displayActionIcon: computed(() => settings.value.displayActionIcon),
    activeProfileId: computed(() => settings.value.activeProfileId),
    activeProfileName: computed(
      () =>
        settings.value.profiles.find(
          (x) => x.id === settings.value.activeProfileId,
        )?.name,
    ),
    email: computed(() => settings.value.email),
    googleToken: computed(() => tokens.value.google),
    isTosAgreed: computed(() => settings.value.isTosAgreed),
    llmApiKey: computed(() => settings.value.llmApiKey),
    llmApiKeyIsValid: computed(() => settings.value.llmApiKeyIsValid),
    profiles: computed(() => settings.value.profiles),
  }
})
