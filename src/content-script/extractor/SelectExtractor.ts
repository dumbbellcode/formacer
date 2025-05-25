import { SelectInputContext, UserInputElementContext } from "@/types/common"
import { AbstractElementExtractor } from "./AbstractElementExtractor"
import { findElements } from "../utils/common"
import { extractContextFromInput } from "./input"

export class SelectExtractor extends AbstractElementExtractor {
  getContext(e: HTMLSelectElement): SelectInputContext {
    const optionElements = Array.from(
      e.querySelectorAll("option"),
    ) as HTMLOptionElement[]

    const options = optionElements
      .filter((o) => !o.disabled)
      .map((o) => o.innerText)

    const context = extractContextFromInput(e)

    return {
      ...context,
      options,
    }
  }
  getAllElements(node: Element): Array<HTMLElement> {
    return findElements<HTMLSelectElement>(
      node,
      "select",
    ) as HTMLSelectElement[]
  }
  applyAnswer(elem: HTMLSelectElement, optionAnswer: string | null) {
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
}
