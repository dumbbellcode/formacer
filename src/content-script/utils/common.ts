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

export function trimText(text: string | null) {
  if (!text) return ""
  return text.replace(/\s+/g, " ").trim()
}

export function createElementFromHTML(htmlString: string) {
  const div = document.createElement("div")
  div.innerHTML = htmlString.trim()
  // Change this to div.childNodes to support multiple top-level nodes.
  return div
}

export function findInputs(node: Element | Document): HTMLInputElement[] {
  return Array.from(node.querySelectorAll(`input`)) as HTMLInputElement[]
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

export function findClosestTextInParentTreeWithSingleInputUnderIt(
  node: HTMLElement | null,
) {
  if (!node) {
    return null
  }
  const inputCount = node.querySelectorAll('input[type="text"]').length
  if (inputCount > 1) {
    return null
  }
  const text = (node.textContent ?? "").replace(/\s+/g, " ").trim()
  if (text.length > 5) {
    return text
  }
  return findClosestTextInParentTreeWithSingleInputUnderIt(node.parentElement)
}
