import { SelectInputContext, UserInputElementContext } from "@/types/common"
import { AbstractElementExtractor } from "./AbstractElementExtractor"
import { findElements } from "../utils/common"
import { extractContextFromInput } from "./input"

export class RoleListboxExtractor extends AbstractElementExtractor {
  getContext(e: HTMLElement): SelectInputContext {
    const optionElements = Array.from(
      e.querySelectorAll('[role="option"]'),
    ) as HTMLElement[]

    const options = optionElements
      .filter(
        (o) =>
          !(
            o.hasAttribute("aria-disabled") &&
            o.getAttribute("aria-disabled") === "true"
          ),
      )
      .map((o) => o.getAttribute("data-value") || o.innerText?.trim())

    const context = extractContextFromInput(e)

    return {
      ...context,
      options,
    }
  }
  getAllElements(node: Element): Array<HTMLElement> {
    return findElements<HTMLSelectElement>(
      node,
      '[role="listbox"]',
    ) as HTMLSelectElement[]
  }

  applyAnswer(e: HTMLElement, optionAnswer: string | null) {
    if (!optionAnswer) return
    const options = Array.from(
      e.querySelectorAll('[role="option"]'),
    ) as HTMLElement[]
    // Iterate through the options of the select element
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      if (option.innerText.trim() === optionAnswer.trim()) {
        option.setAttribute("aria-selected", "true")
        break
      }
    }
  }
}
