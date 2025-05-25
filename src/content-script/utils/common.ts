import { emptyInputElementsCount } from "../extractor/input"
import { emptyTextareaElementsCount } from "../extractor/textarea"

function isEmpty(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0)
  )
}

export function changeVisibility(
  visibleElements: Element[],
  invisibleElements: Element[],
) {
  visibleElements.forEach((el) => {
    el.classList.remove("hidden")
  })
  invisibleElements.forEach((el) => {
    el.classList.add("hidden")
  })
}

export function isNodeVisible(e: Element): boolean {
  return e.checkVisibility({
    contentVisibilityAuto: true,
    opacityProperty: true,
    visibilityProperty: true,
  })
}

export function trimText(text: string | null, replaceWith: string = " ") {
  if (!text) return ""
  return text.replace(/\s+/g, replaceWith).trim()
}

function countWords(str: string) {
  return str.trim().split(/\s+/).length;
}

export function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div")
  div.innerHTML = htmlString.trim()
  // Change this to div.childNodes to support multiple top-level nodes.
  return div
}

export const UserInputElements = {
  nativeInputs: 'input:not([role])',
  textareas: 'textarea:not([role])',
  ariaTextbox: '[role="textbox"]',
  ariaCheckbox: '[role="checkbox"]',
  ariaRadio: '[role="radio"]',
  ariaCombobox: '[role="combobox"]',
  ariaListbox: '[role="listbox"]',
  // ariaSpinbutton: '[role="spinbutton"]',
  // ariaSlider: '[role="slider"]',
  ariaSearchbox: '[role="searchbox"]',
  // contentEditable: '[contenteditable="true"], [contenteditable=""]'
}

export function findElements<T>(
  node: Element | Document,
  type: "input" | "textarea",
  filterCallback: ((e: T) => boolean) | null = null,
  onlyVisible: boolean = true,
  onlyEmpty: boolean = true,
): T[] {
  let elements = Array.from(node.querySelectorAll(type)) as T[]
  if (filterCallback) {
    elements = elements.filter((e) => filterCallback(e))
  }
  if (onlyVisible) {
    elements = elements.filter((e) => e instanceof Element && isNodeVisible(e))
  }
  if (onlyEmpty) {
    const hasValueProp = (e: unknown) =>
      e instanceof HTMLTextAreaElement || e instanceof HTMLInputElement
    elements = elements.filter((e) => hasValueProp(e) && isEmpty(e.value))
  }
  return elements as T[]
}

// Searches label in parent tree such that only single label is found
export function findClosestLabelInParentTreeWithSingleInputUnderIt(
  node: Element | null,
): HTMLLabelElement | null {
  if (!node) {
    return null
  }

  const labels = node.querySelectorAll("label")
  if (labels.length < 1) {
    return findClosestLabelInParentTreeWithSingleInputUnderIt(
      node.parentElement,
    )
  }
  if (labels.length > 1) {
    return null
  }
  // also check if there are 2 inputs under label ?
  const label = labels[0] as HTMLLabelElement
  return label
}

export function findAllTextInParentTreeWithSingleUserInputUnderIt(
  node: HTMLElement | null,
) {
  if (!node) {
    return null
  }
  const allInputTypesSelector = Object.values(UserInputElements).join(',')
  const inputCount = node.querySelectorAll(allInputTypesSelector).length
  if (inputCount > 1) {
    return null
  }
  const text = trimText(node.innerText, ', ')
  const wordCount = countWords(text)
  // TODO: add memoization optimization, max search limit
  // The first if check is to save some iterations
  if (wordCount > 50 || !node.parentElement) {
    return text
  }
  return findAllTextInParentTreeWithSingleUserInputUnderIt(node.parentElement)
}

function getVisibleText(node: Element): string {
  if (!isNodeVisible(node)) return ""

  let text = ""
  // Handle text nodes directly under this element
  for (const childNode of Array.from(node.childNodes)) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      text += childNode.textContent ?? ""
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      // Recursively get text from visible child elements
      text += getVisibleText(childNode as Element)
    }
  }

  return text.replace(/\s+/g, " ").trim()
}

export function displayForSeconds(
  element: HTMLElement,
  duration: number,
  onMount?: () => void,
  onClear?: () => void,
): void {
  // Show the element
  element.classList.remove("hidden")

  // Run onMount callback if provided
  if (onMount) {
    onMount()
  }

  // Set timeout to hide the element
  setTimeout(() => {
    element.classList.add("hidden")

    // Run onClear callback if provided
    if (onClear) {
      onClear()
    }
  }, duration * 1000)
}

export function shouldDisplayCTA(): boolean {
  return emptyInputElementsCount() > 1 || emptyTextareaElementsCount() > 0
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
