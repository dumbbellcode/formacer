import { TextInputContext } from "../types"
import { applyUUIDToElementAndContext, findElements } from "../utils/common"
import { extractContextFromInput } from "./input"

export function extractContextFromAllTextarea(
  node: Element | Document,
): TextInputContext[] {
  const textInputs = findElements(node, "textarea") as HTMLInputElement[]
  return textInputs.map((ti) => {
    const context = extractContextFromInput(ti)
    applyUUIDToElementAndContext(ti, context)
    return context
  })
}

export function emptyTextareaElementsCount() {
  const inputs = document.querySelectorAll("textarea")

  // Filter and count empty input elements of allowed types
  const emptyCount = Array.from(inputs).filter(
    (input: HTMLTextAreaElement) => input.value.trim() === "",
  ).length

  return emptyCount
}
