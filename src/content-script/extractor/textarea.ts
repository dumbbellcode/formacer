import { TextInputContext } from "../types"
import { findElements } from "../utils/common"
import { AbstractElementExtractor } from "./abstract-element-extractor"
import { extractBaseContext } from "./context-utils"

export class TextareaExtractor extends AbstractElementExtractor {
  getContext(textarea: HTMLElement): TextInputContext {
    return extractBaseContext(textarea)
  }

  getAllElements(node: Element | Document): Array<HTMLElement> {
    return findElements(node, "textarea") as HTMLTextAreaElement[]
  }

  elementMatches(element: Element): boolean {
    return element.tagName.toLowerCase() === "textarea"
  }

  isElementEmpty(element: HTMLElement): boolean {
    const textareaElement = element as HTMLTextAreaElement
    return !textareaElement.value || textareaElement.value.trim() === ""
  }
}

export function extractContextFromAllTextarea(
  node: Element | Document,
): TextInputContext[] {
  const extractor = new TextareaExtractor()
  return extractor.getContextForAll(node) as TextInputContext[]
}

export function emptyTextareaElementsCount() {
  const extractor = new TextareaExtractor()
  return extractor.getEmptyElementsCount()
}
