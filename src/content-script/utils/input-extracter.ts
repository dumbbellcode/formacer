import { TextInputContext } from "@/types/common"
import {
  findClosestLabelInParentTreeWithSingleInputUnderIt,
  findAllTextInParentTreeWithSingleUserInputUnderIt,
  findElements,
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
  const textInputs = findElements(node, "input", (i: HTMLInputElement) =>
    allowedInputTypes.includes(i.type),
  ) as HTMLInputElement[]

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
  input: HTMLInputElement | HTMLTextAreaElement,
  elementType: "input" | "textarea" = "input",
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
    closestText = findAllTextInParentTreeWithSingleUserInputUnderIt(input)
  }

  if(closestText) {
    closestText.substring(0, 900)
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

export function emptyInputElementsCount() {
  const inputs = document.querySelectorAll("input")

  // Filter and count empty input elements of allowed types
  const emptyCount = Array.from(inputs).filter(
    (input) =>
      allowedInputTypes.includes(input.type) && input.value.trim() === "",
  ).length

  return emptyCount
}
