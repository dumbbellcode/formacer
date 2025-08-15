import { SelectInputContext, UserInputElementContext } from "@/types/common"
import { AbstractElementExtractor } from "./abstract-element-extractor"
import { findElements } from "../utils/common"
import { extractBaseContext } from "./context-utils"

export class SelectExtractor extends AbstractElementExtractor {
  getContext(e: HTMLSelectElement): SelectInputContext {
    const optionElements = Array.from(
      e.querySelectorAll("option"),
    ) as HTMLOptionElement[]

    const options = optionElements
      .filter((o) => !o.disabled)
      .map((o) => o.innerText)

    const context = extractBaseContext(e)

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
    let index = -1
    for (let i = 0; i < elem.options.length; i++) {
      const option = elem.options[i]

      // Check if the inner text of the option matches the optionAnswer
      if (option.innerText.trim() === optionAnswer.trim()) {
        // Select the matching option
        option.selected = true // Set the select element's value
        index = i
        break // Exit the loop once the match is found
      }
    }

    elem.selectedIndex = index
    const event = new Event("change", {
      bubbles: true, // Allow event to bubble up the DOM tree
      cancelable: true, // Allow event to be cancelable
    })
    elem.dispatchEvent(event)
  }

  elementMatches(element: Element): boolean {
    return element.tagName.toLowerCase() === "select"
  }

  isElementEmpty(element: HTMLElement): boolean {
    const selectElement = element as HTMLSelectElement
    return !selectElement.value || selectElement.value.trim() === ""
  }
}
