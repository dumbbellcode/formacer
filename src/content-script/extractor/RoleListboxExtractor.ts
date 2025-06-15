import { SelectInputContext } from "@/types/common"
import { AbstractElementExtractor } from "./AbstractElementExtractor"
import { applyAriaOptions, extractAriaOptions, findElements, Roles } from "../utils/common"
import { extractContextFromAriaInput } from "./input"

export class RoleListboxExtractor extends AbstractElementExtractor {
  getContext(e: HTMLElement): SelectInputContext {
    const options = extractAriaOptions(e, Roles.OPTION)
    const context = extractContextFromAriaInput(e)

    return {
      ...context,
      options,
      tagName: 'select'
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

    applyAriaOptions(e, Roles.OPTION, [optionAnswer])
  }

  elementMatches(element: Element): boolean {
    return element.role === "listbox"
  }
}
