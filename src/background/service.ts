import { getValueFromStorage } from "@/composables/useBrowserStorage"
import {
  AccurateDetails,
  TextInputContext,
  DETAIL_TYPES,
  CreativeDetails,
  Settings,
} from "@/types/common"
import { getMessageForStatusCode } from "@/utils/auth"

const API_URL = import.meta.env.VITE_API_URL
const FILL_ACCURATE = `${API_URL}/fill/accurate`

export async function getAccurateFillData(
  textInputContext: TextInputContext[],
) {
  const settings = await getValueFromStorage<Settings>("settings", "sync")
  const activeProfileId = settings?.activeProfileId ?? "default"
  
  const tokens = await getValueFromStorage<{server: string}>("tokens", "local")

  const userContext = await getValueFromStorage<AccurateDetails>(
    `${activeProfileId}-${DETAIL_TYPES.SHORT}`,
    "sync",
  )
  const userCreativeContext = await getValueFromStorage<CreativeDetails>(
    `${activeProfileId}-${DETAIL_TYPES.LONG}`,
    "sync",
  )
  const userContextAccurateFill =
    userContext?.fields
      ?.map(({ label, value }) => {
        return { label, value }
      })
      .filter((d) => d.value) ?? []
  const userContextCreativeFill =
    userCreativeContext?.fields
      ?.map(({ label, value }) => {
        return { label, value }
      })
      .filter((d) => d.value) ?? []

  const userTotalContext = userContextAccurateFill.concat(
    userContextCreativeFill,
  )

  //console.info("User context", userTotalContext)
  //console.info("Input context", textInputContext)

  if (!userTotalContext.length) {
    return {
      success: false,
      message: "Please fill the form inside the extension for autofill to work",
    }
  }

  try {
    const response = await fetch(FILL_ACCURATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokens?.server}`
      },
      body: JSON.stringify({
        context: userTotalContext,
        text_input_context: textInputContext,
      }),
    })

    const statusCode = response.status
    if (!response.ok) {
      if(statusCode === 401) {
        chrome.storage.local.remove('tokens')
      }

      return {
        success: false,
        message: getMessageForStatusCode(statusCode),
        error: "Network response was not ok",
      }
    }

    const data = await response.json()

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.info('fetch error', error)
    return {
      success: false,
      message: getMessageForStatusCode(503),
      error,
    }
  }
}
