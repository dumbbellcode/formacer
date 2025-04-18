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
  // TODO: add memoization optimization, max search limit
  // The first if check is to save some iterations
  if (text.length > 5 && getVisibleText(node).length > 5) {
    return text
  }
  return findClosestTextInParentTreeWithSingleInputUnderIt(node.parentElement)
}

function getVisibleText(node: Element): string {
  if (!isNodeVisible(node)) return '';

  let text = '';
  // Handle text nodes directly under this element
  for (const childNode of Array.from(node.childNodes)) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      text += childNode.textContent ?? '';
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      // Recursively get text from visible child elements
      text += getVisibleText(childNode as Element);
    }
  }
  
  return text.replace(/\s+/g, ' ').trim();
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
