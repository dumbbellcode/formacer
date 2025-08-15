import { TextInputContext } from "@/types/common"
import { findElements } from "../utils/common"
import { AbstractElementExtractor } from "./abstract-element-extractor"
import { extractBaseContext, extractAriaContext } from "./context-utils"

const allowedInputTypes = [
  "number",
  "text",
  "email",
  "tel",
  "date",
  "week",
  "month",
]

export class InputExtractor extends AbstractElementExtractor {
  getContext(input: HTMLElement): TextInputContext {
    return extractContextFromInput(input)
  }

  getAllElements(node: Element | Document): Array<HTMLElement> {
    const textInputs = findElements(node, "input", (i: HTMLInputElement) =>
      allowedInputTypes.includes(i.type),
    ) as HTMLInputElement[]

    console.info("Inputs found:", textInputs.length)
    return textInputs
  }

  elementMatches(element: Element): boolean {
    const inputElement = element as HTMLInputElement
    return (
      element.tagName.toLowerCase() === "input" &&
      allowedInputTypes.includes(inputElement.type)
    )
  }

  isElementEmpty(element: HTMLElement): boolean {
    const inputElement = element as HTMLInputElement
    return !inputElement.value || inputElement.value.trim() === ""
  }
}

export function extractContextFromAllInputs(
  node: Element | Document,
): TextInputContext[] {
  const extractor = new InputExtractor()
  return extractor.getContextForAll(node) as TextInputContext[]
}

export function extractContextFromAriaInput(e: HTMLElement): TextInputContext {
  return extractAriaContext(e)
}

export function extractContextFromInput(
  input:
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | HTMLElement,
): TextInputContext {
  return extractBaseContext(input)
}

export function emptyInputElementsCount() {
  const extractor = new InputExtractor()
  return extractor.getEmptyElementsCount()
}
