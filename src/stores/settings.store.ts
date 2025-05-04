import { FormProfile, Settings } from "@/types/common"
import { defineStore } from "pinia"

interface Tokens {
  google: string
  server: string
}

export const useSettingsStore = defineStore("settings", () => {
  const { data: settings } = useBrowserSyncStorage<Settings>("settings", {
    activeProfileId: "default",
    profiles: {},
    displayActionIcon: true,
    email: "",
  })

  const { data: tokens } = useBrowserLocalStorage<Tokens>("tokens", {
    google: "",
    server: "",
  })

  function toggleDisplayActionIcon() {
    settings.value.displayActionIcon = !settings.value.displayActionIcon
  }

  function setEmail(email: string) {
    settings.value.email = email
  }

  function setGoogleToken(token: string) {
    tokens.value.google = token
  }

  function setServerToken(token: string) {
    tokens.value.server = token
  }

  return {
    toggleDisplayActionIcon,
    setEmail,
    setGoogleToken,
    setServerToken,
    displayActionIcon: computed(() => settings.value.displayActionIcon),
    activeProfileId: computed(() => settings.value.activeProfileId),
    email: computed(() => settings.value.email),
    googleToken: computed(() => tokens.value.google),
    serverToken: computed(() => tokens.value.server),
  }
})

// export const useSettingsStore = defineStore("profiles", {

//   state: (): Settings => ({
//     activeProfileId: "default",
//     profiles: {}, // Will contain all profile instances,
//     // displayActionIcon: true
//   }),

//   getters: {
//     activeProfile: (state): FormProfile | null =>
//       state.profiles[state.activeProfileId!] || null,
//     profileIds: (state): string[] => Object.keys(state.profiles),
//     profileCount: (state): number => Object.keys(state.profiles).length,
//   },

//   actions: {
//     createProfile(
//       profileId: string,
//       initialData: Partial<FormProfile> = {},
//     ): FormProfile {
//       // Don't overwrite existing profile
//       if (this.profiles[profileId]) {
//         console.warn(`Profile ${profileId} already exists!`)
//         return this.profiles[profileId]
//       }

//       // Create a new profile with default + provided data
//       this.profiles[profileId] = {
//         name: initialData.name || `Profile ${profileId}`,
//         createdAt: new Date().toISOString(),
//         ...initialData,
//         id: profileId,
//       }

//       // Set as active if it's the first profile
//       if (this.profileCount === 1) {
//         this.activeProfileId = profileId
//       }

//       return this.profiles[profileId]
//     },

//     setActiveProfile(profileId: string): boolean {
//       if (!this.profiles[profileId]) {
//         console.error(`Cannot activate non-existent profile: ${profileId}`)
//         return false
//       }

//       this.activeProfileId = profileId
//       return true
//     },

//     updateProfile(
//       profileId: string,
//       data: Partial<FormProfile>,
//     ): FormProfile | false {
//       if (!this.profiles[profileId]) {
//         console.error(`Cannot update non-existent profile: ${profileId}`)
//         return false
//       }

//       // Merge new data with existing profile
//       this.profiles[profileId] = {
//         ...this.profiles[profileId],
//         ...data,
//       }

//       return this.profiles[profileId]
//     },

//     deleteProfile(profileId: string): boolean {
//       if (!this.profiles[profileId]) {
//         return false
//       }

//       // If deleting active profile, activate another one if available
//       if (this.activeProfileId === profileId) {
//         const otherProfileIds = this.profileIds.filter((id) => id !== profileId)
//         if (otherProfileIds.length > 0) {
//           this.activeProfileId = otherProfileIds[0]
//         } else {
//           this.activeProfileId = null
//         }
//       }

//       delete this.profiles[profileId]
//       return true
//     },
//   },
// })
