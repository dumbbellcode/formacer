import { SelectInputContext } from "@/types/common"
import { extractContextFromInput } from "./input"
import { findElements, applyUUIDToElementAndContext } from "../utils/common"

export function extractContextFromAll(
  node: Element | Document,
): SelectInputContext[] {
  const selects = findElements<HTMLSelectElement>(
    node,
    "select",
  ) as HTMLSelectElement[]
  return selects.map((ti) => {
    const context = extractContextFromSelect(ti)
    applyUUIDToElementAndContext(ti, context)
    return context
  })
}

export function extractContextFromSelect(
  select: HTMLSelectElement,
): SelectInputContext {
  const optionElements = Array.from(
    select.querySelectorAll("option"),
  ) as HTMLOptionElement[]

  const options = optionElements
    .filter((o) => !o.disabled)
    .map((o) => o.innerText)

  const context = extractContextFromInput(select)

  return {
    ...context,
    options,
  }
}

export function applyAnswer(
  elem: HTMLSelectElement,
  optionAnswer: string | null,
) {
  if (!optionAnswer) return
  // Iterate through the options of the select element
  for (let i = 0; i < elem.options.length; i++) {
    const option = elem.options[i]

    // Check if the inner text of the option matches the optionAnswer
    if (option.innerText.trim() === optionAnswer.trim()) {
      // Select the matching option
      option.selected = true // Set the select element's value
      break // Exit the loop once the match is found
    }
  }
}
