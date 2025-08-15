import { TextInputContext } from "@/types/common"
import {
  findClosestLabelInParentTreeWithSingleInputUnderIt,
  findAllTextInParentTreeWithSingleUserInputUnderIt,
  trimText,
  findAllTextBetweenPreviousInputAndCurrentInputNode,
} from "../utils/common"
import {
  computeAccessibleName,
  computeAccessibleDescription,
} from "dom-accessibility-api"

export function extractBaseContext(
  input:
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | HTMLElement,
): TextInputContext {
  const hasPlaceHolder =
    input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement

  const hasLabels = hasPlaceHolder || input instanceof HTMLSelectElement

  let label: string | null = null

  if (hasLabels) {
    const allLabels = input.labels
    label = allLabels?.length ? allLabels[0].textContent : ""
    label = trimText(label)
  }

  // If label not directly found, search aria-label
  if (!label && input.getAttribute("aria-label")) {
    label = input.getAttribute("aria-label")
    label = trimText(label)
  }

  let closestLabel: string | null = null
  let closestText: string | null = null

  // If label still not found, search closest label
  if (!label) {
    closestLabel =
      findClosestLabelInParentTreeWithSingleInputUnderIt(input)?.textContent ??
      null
    closestLabel = trimText(closestLabel)
  }

  // If closest label not found, search closest text
  if (!closestLabel) {
    closestText = findAllTextInParentTreeWithSingleUserInputUnderIt(input)
  }

  if (!closestText) {
    closestText = findAllTextBetweenPreviousInputAndCurrentInputNode(input)
  }

  if (closestText) {
    closestText.substring(0, 900)
  }

  const { tagName, title } = input
  const data = {
    tagName,
    type: hasLabels ? input.type : null,
    placeholder: hasPlaceHolder ? input.placeholder : null,
    title,
    value: hasLabels ? input.value : null,
    label,
    closestLabel,
    closestText,
  }
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== null && value !== ""),
  )

  return filteredData
}

export function extractAriaContext(e: HTMLElement): TextInputContext {
  const accessibleName = computeAccessibleName(e)
  const accessibleDescription = computeAccessibleDescription(e)
  const context = extractBaseContext(e)

  if (!context.label) {
    context.label = accessibleName
  }

  if (!context.closestText) {
    context.closestText = accessibleDescription
  }
  return context
}
