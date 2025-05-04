import { TextInputContext } from "../types"
import { findElements } from "./common"
import { extractContextFromInput } from "./input-extracter"

export function extractContextFromAllTextarea(
  node: Element | Document,
): TextInputContext[] {
  const textInputs = findElements(node, "textarea") as HTMLInputElement[]
  return textInputs.map((ti) => {
    const context = extractContextFromInput(ti)

    // Add a unique data-formacer-id attribute to the input element
    const uniqueId = `formacer-${crypto.randomUUID()}`
    context.dataId = uniqueId
    ti.setAttribute("data-formacer-id", uniqueId)

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
