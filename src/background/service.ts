import { getValueFromStorage } from "@/composables/useBrowserStorage"
import {
  AccurateDetails,
  TextInputContext,
  DETAIL_TYPES,
  CreativeDetails,
  Settings,
  SelectInputContext,
} from "@/types/common"
import {
  buildMultiSelectInputDataExtractionPrompt,
  buildSingleSelectInputDataExtractionPrompt,
  buildTextInputDataExtractionPrompt,
  wrapContext,
} from "./services/prompts"
import { AccurateExtractResult } from "./services/types"
import Llmservice from "./services/llm"

const API_URL = import.meta.env.VITE_API_URL
const FILL_ACCURATE = `${API_URL}/fill/accurate`

export async function getAccurateFillData(
  textInputContext: TextInputContext[],
  selectContext: SelectInputContext[],
) {
  const settings = await getValueFromStorage<Settings>("settings", "sync")
  const activeProfileId = settings?.activeProfileId ?? "default"
  const llmApiKey = settings.llmApiKey
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

  if (!llmApiKey) {
    return {
      success: false,
      message: "Please add your Gemini API key from settings",
    }
  }

  if (!userTotalContext.length) {
    return {
      success: false,
      message: "Please fill the form inside the extension for autofill to work",
    }
  }


  const llmService = new Llmservice(llmApiKey)
  const extractedData = await passContextAndGetAnswers(
    llmService,
    userTotalContext,
    textInputContext,
    selectContext,
  )

  return {
    success: true,
    data: extractedData,
  }
}

// LLMs cooking
async function passContextAndGetAnswers(
  llmService: Llmservice,
  userContext: { label: string; value: string }[],
  textInputContext: TextInputContext[],
  selectContext: SelectInputContext[],
) {
  const contextPrompt = wrapContext(userContext)
  let result: AccurateExtractResult[] = []

  if (textInputContext.length) {
    const textPrompt = buildTextInputDataExtractionPrompt(
      contextPrompt,
      textInputContext,
    )
    const schema: object = [
      {
        dataId: "abc-uuid",
        value: "answer or null",
      },
    ]
    const promptResult =
      (await llmService.getResultWithSchema(textPrompt, schema)) ?? []
    result = result.concat(promptResult as AccurateExtractResult[])
  }

  const singleSelectContext = []
  const multiSelectContext = []
  const singleSelectTags = ["option", "radio"]
  for (const ctx of selectContext) {
    if (singleSelectTags.includes(ctx.tagName ?? "")) {
      singleSelectContext.push(ctx)
    } else {
      multiSelectContext.push(ctx)
    }
  }

  if (singleSelectContext.length) {
    const selectPrompt = buildSingleSelectInputDataExtractionPrompt(
      contextPrompt,
      singleSelectContext,
    )
    const schema: object = [
      {
        dataId: "abc-uuid",
        value: "correct option",
      },
    ]
    const promptResult =
      (await llmService.getResultWithSchema(selectPrompt, schema)) ?? []
    result = result.concat(promptResult as AccurateExtractResult[])
  }

  if (multiSelectContext.length) {
    const selectPrompt = buildMultiSelectInputDataExtractionPrompt(
      contextPrompt,
      multiSelectContext,
    )
    const schema: object = [
      {
        dataId: "abc-uuid",
        value: "correct option 1 | correct option 2",
      },
    ]

    const promptResult =
      (await llmService.getResultWithSchema(selectPrompt, schema)) ?? []
    result = result.concat(promptResult as AccurateExtractResult[])
  }

  return result.filter((v) => v)
}
