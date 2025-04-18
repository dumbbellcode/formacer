import { TextInputContext } from "@/types/common"
import {
  findClosestLabelInParentTreeWithSingleInputUnderIt,
  findClosestTextInParentTreeWithSingleInputUnderIt,
  findInputs,
  isNodeVisible,
  trimText,
} from "./common"

const allowedInputTypes = [
  "number",
  "text",
  "email",
  "tel",
  "date",
  "week",
  "month",
]

export function extractContextFromAllInputs(
  node: Element | Document,
): TextInputContext[] {
  let textInputs = findInputs(node)

  textInputs = textInputs.filter((i) => {
    if (!allowedInputTypes.includes(i.type)) return false
    if (i.value) return false
    return isNodeVisible(i)
  })

  console.info("Inputs found:", textInputs.length)

  return textInputs.map((ti) => {
    const context = extractContextFromInput(ti)

    // Add a unique data-formacer-id attribute to the input element
    const uniqueId = `formacer-${crypto.randomUUID()}`
    context.dataId = uniqueId
    ti.setAttribute("data-formacer-id", uniqueId)

    return context
  })
}

export function extractContextFromInput(
  input: HTMLInputElement,
): TextInputContext {
  const allLabels = input.labels
  let label = allLabels?.length ? allLabels[0].textContent : ""
  label = trimText(label)
  let closestLabel: string | null = null
  let closestText: string | null = null

  // If label not directly found, search closest label
  if (!label) {
    closestLabel =
      findClosestLabelInParentTreeWithSingleInputUnderIt(input)?.textContent ??
      null
    closestLabel = trimText(closestLabel)
  }

  // If closest label not found, search closest text
  if (!closestLabel) {
    closestText = findClosestTextInParentTreeWithSingleInputUnderIt(input)
    closestText = trimText(closestText)
  }

  const { tagName, placeholder, title, value, type } = input
  const data = {
    tagName,
    type,
    placeholder,
    title,
    value,
    label,
    closestLabel,
    closestText,
  }
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) => value !== null && value !== "",
    ),
  )

  return filteredData
}
