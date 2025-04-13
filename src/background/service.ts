import { getValueFromStorage } from "@/composables/useBrowserStorage"
import { AccurateDetails, TextInputContext, DETAIL_TYPES } from "@/types/common"

const API_URL = "http://localhost:3333"
const FILL_ACCURATE = `${API_URL}/fill/accurate`

export async function getAccurateFillData(
  textInputContext: TextInputContext[],
) {
  const userContext = await getValueFromStorage<AccurateDetails>(
    DETAIL_TYPES.ACCURATE,
    "sync",
  )
  const userContextAccurateFill =
    userContext?.fields
      ?.map(({ label, value }) => {
        return { label, value }
      })
      .filter((d) => d.value) ?? []

  console.info("User context", userContextAccurateFill)
  console.info("Input context", textInputContext)

  if (!userContextAccurateFill.length) {
    return {
      success: false,
      message: "No user context found",
    }
  }

  try {
    const response = await fetch(FILL_ACCURATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context: userContextAccurateFill,
        text_input_context: textInputContext,
      }),
    })

    if (!response.ok) {
      return {
        success: false,
        message: "Network response was not ok",
      }
    }

    const data = await response.json()
    console.info("Response Data:", data)

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "Something went wrong",
      error,
    }
  }
}
