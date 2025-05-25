import { SelectInputContext } from "@/types/common"
import { AbstractElementExtractor } from "./AbstractElementExtractor"
import { clickAtElement, findElements, sleep } from "../utils/common"
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
    const elem = findElements<HTMLSelectElement>(
      node,
      '[role="listbox"]',
    ) as HTMLSelectElement[]

    return elem
  }
  async applyAnswer(e: HTMLElement, optionAnswer: string | null) {
    if (!optionAnswer) return

    e.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
    });

    await sleep(100)
    clickAtElement(e)
    await sleep(300)

    const options = Array.from(
      e.querySelectorAll('[role="option"]'),
    ) as HTMLElement[]
    // Iterate through the options of the select element
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      if (option.innerText.trim() === optionAnswer.trim()) {
        option.setAttribute("aria-selected", "true")
        clickAtElement(option)
      } else {  
        option.setAttribute("aria-selectted", "false")
      }
    }
    await sleep(100)
    clickAtElement(e)
  }

  elementMatches(element: Element): boolean {
    return element.role === "listbox"
  }
}
