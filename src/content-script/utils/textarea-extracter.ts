import { TextInputContext } from "../types"
import { findElements } from "./common"
import { extractContextFromInput } from "./input-extracter"

export function extractContextFromAllTextarea(
  node: Element | Document,
): TextInputContext[] {
  const textInputs = findElements(node, "textarea") as HTMLInputElement[]

  console.info("Textareas found:", textInputs.length)

  return textInputs.map((ti) => {
    const context = extractContextFromInput(ti)

    // Add a unique data-formacer-id attribute to the input element
    const uniqueId = `formacer-${crypto.randomUUID()}`
    context.dataId = uniqueId
    ti.setAttribute("data-formacer-id", uniqueId)

    return context
  })
}
