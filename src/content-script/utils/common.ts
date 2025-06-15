import { UserInputElementContext } from "@/types/common"
import { emptyInputElementsCount } from "../extractor/input"
import { emptyTextareaElementsCount } from "../extractor/textarea"
import { clickAtPosition } from "./typing"
import { computeAccessibleDescription, computeAccessibleName } from "dom-accessibility-api"

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
  return str.trim().split(/\s+/).length
}

export function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div")
  div.innerHTML = htmlString.trim()
  // Change this to div.childNodes to support multiple top-level nodes.
  return div
}

export function clickAtElement(e: Element) {
  const r = e.getBoundingClientRect()
  const x = r.left + r.width / 2
  const y = r.top + r.height / 2
  clickAtPosition(x, y)
}


export const UserInputElements = {
  nativeInputs: "input:not([role])",
  textareas: "textarea:not([role])",
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

export function applyUUIDToElementAndContext(
  e: HTMLElement,
  context: UserInputElementContext,
) {
  // Add a unique data-formacer-id attribute to the input element
  const uniqueId = `formacer-${crypto.randomUUID()}`
  context.dataId = uniqueId
  e.setAttribute("data-formacer-id", uniqueId)
}

export function findElements<T>(
  node: Element | Document,
  type: "input" | "textarea" | "select" | '[role="listbox"]',
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
  const hasValueProp = (e: unknown) =>
    e instanceof HTMLTextAreaElement || e instanceof HTMLInputElement
  if (onlyEmpty && hasValueProp) {
    elements = elements.filter(
      (e) => !hasValueProp(e) || (hasValueProp(e) && isEmpty(e.value)),
    )
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
  sourceInputNode?: Element,
): string | null {
  if (!node) {
    return null
  }

  // At level 0 in DFS call
  if (!sourceInputNode) {
    sourceInputNode = node
  }

  const allInputTypesSelector = Object.values(UserInputElements).join(",")
  const inputCount = node.querySelectorAll(allInputTypesSelector).length
  if (inputCount > 1) {
    return null
  }
  const text = trimText(getVisibleText(node, sourceInputNode), " ")
  const wordCount = countWords(text)
  // TODO: add memoization optimization, max search limit
  // The first if check is to save some iterations
  if (wordCount > 50) {
    return text
  }
  const answerFromParent = findAllTextInParentTreeWithSingleUserInputUnderIt(
    node.parentElement,
    sourceInputNode,
  )
  return answerFromParent ? answerFromParent : text
}

function getVisibleText(node: Element, sourceInputNode: Element): string {
  if (!isNodeVisible(node)) return ""
  if (node.isSameNode(sourceInputNode)) return ""

  let text = ""
  // Handle text nodes directly under this element
  for (const childNode of Array.from(node.childNodes)) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      const value = childNode.textContent
      text = value ? text + ` ${value},` : ""
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      // Recursively get text from visible child elements
      text += getVisibleText(childNode as Element, sourceInputNode)
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

export const OptionRoles = {
  OPTION: '[role="option"]',
  CHECKBOX: '[role="checkbox"]',
  RADIO: '[role="radio"]'
}

export const Roles = {
  ...OptionRoles
}

const OptionTypeSelectionAttributeMap: Record<string,string> = {
  [OptionRoles.OPTION]: "aria-selected",
  [OptionRoles.CHECKBOX]: "aria-checked",
  [OptionRoles.RADIO]: "aria-checked"
}

export function extractAriaOptions (
  e: Element, 
  optionsSelector: keyof typeof OptionTypeSelectionAttributeMap,
): string[] {
  const optionElements = Array.from(e.querySelectorAll(optionsSelector)) as HTMLElement[]

  return optionElements
    .filter((o) => !(o.getAttribute("aria-disabled") === "true"))
    .map((o) => { 
      const accessibleName = computeAccessibleName(o)
      const accessibleDescription = computeAccessibleDescription(o)
      return o.innerText?.trim() || 
      accessibleName || 
      accessibleDescription
    })
}

export async function applyAriaOptions (
  e: Element, 
  optionsSelector: keyof typeof OptionTypeSelectionAttributeMap, 
  answers: string[]
) {
  await sleep(100)
  clickAtElement(e)
  await sleep(300)

  const options = Array.from(e.querySelectorAll(optionsSelector)) as HTMLElement[]
  const selectionAttribute = OptionTypeSelectionAttributeMap[optionsSelector]
  // Iterate through the options of the select element
  for (let i = 0; i < options.length; i++) {
    const option = options[i]
    const accessibleName = computeAccessibleName(option)
    const accessibleDescription = computeAccessibleDescription(option)

    const optionText = option.innerText?.trim() || 
    accessibleName || 
    accessibleDescription

    const selectionAttributeVal = 
      option.getAttribute(selectionAttribute) ?? ''
    const selectionAttributeIsAlreadyTrue = [true, 'true'].includes(selectionAttributeVal)

    console.log({
      optionText, 
      answers, 
      selectionAttribute,
      selectionAttributeVal, selectionAttributeIsAlreadyTrue,
      includes: answers.includes(optionText)
     })
    if (answers.includes(optionText) && !selectionAttributeIsAlreadyTrue) {
      option.setAttribute(selectionAttribute, "true")
      console.info('clicking on', option)
      clickAtElement(option)
    }
    
    if(!answers.includes(optionText)){  
      option.setAttribute(selectionAttribute, "false")
    }
  }
  await sleep(100)
  clickAtElement(e)
}