import { extractContextFromAllInputs } from "./extractor/input"
import { ActionEvents, DETAIL_TYPES, Settings } from "@/types/common"
import ctaHtml from "./cta-container.html?raw"
import { simulateTyping } from "./utils/typing"
import { makeElementDraggable } from "./utils/draggable"
import { displayForSeconds, shouldDisplayCTA, sleep } from "./utils/common"
import { extractContextFromAllTextarea } from "./extractor/textarea"
import { SelectExtractor } from "./extractor/SelectExtractor"
import {
  applyGroupNodeAnswer,
  extractAllGroupContext,
  isRoleGroupNode,
} from "./extractor/RoleGroupExtractor"

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}

enum CTA_STATE {
  DEFAULT = "default",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

const selectExtractor = new SelectExtractor()
// TODO: split it into multiple classes
// Globals
let shadowRoot: ShadowRoot | null = null
// let contentElement: HTMLElement
// let logoElement: HTMLElement | null = null
let ctaElement: HTMLElement | null = null
let loadingElement: HTMLElement | null = null
let successElement: HTMLElement | null = null
let errorElement: HTMLElement | null
let ctaState: CTA_STATE = CTA_STATE.DEFAULT

function setCTAState(state: CTA_STATE) {
  ctaState = state
  const elementMap = {
    [CTA_STATE.DEFAULT]: ctaElement,
    [CTA_STATE.LOADING]: loadingElement,
    [CTA_STATE.ERROR]: errorElement,
    [CTA_STATE.SUCCESS]: successElement,
  }

  Object.entries(elementMap).forEach(([key, el]) => {
    if (!el) return
    if (key === state) {
      el.classList.remove("hidden")
    } else {
      el.classList.add("hidden")
    }
  })
}

function displayMessageForSeconds(message: string) {
  if (!shadowRoot) return
  const boxSection = shadowRoot.getElementById("box-section")
  const messageSection = shadowRoot.getElementById("message-section")
  if (!messageSection || !boxSection || message == null) {
    return
  }
  displayForSeconds(
    boxSection,
    2,
    () => (messageSection.innerText = message),
    () => (messageSection.innerText = ""),
  )
}

function main() {
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.top = "0"
  container.style.left = "0"

  getValueFromStorage<Settings>("settings", "sync").then((setting) => {
    if (setting && !setting.displayActionIcon) {
      container.style.display = "none"
    } else {
      container.style.display = "block"
    }
  })

  // if (!shouldDisplayCTA()) {
  //   return
  // }

  shadowRoot = container.attachShadow({ mode: "open" })
  shadowRoot.innerHTML = ctaHtml
  document.body.appendChild(container)

  const contentElement = shadowRoot.getElementById("formacer-cta-container")
  const logoElement = shadowRoot.getElementById("formacer-icons-section")
  ctaElement = shadowRoot.getElementById("icon-default")
  loadingElement = shadowRoot.getElementById("icon-loading")
  successElement = shadowRoot.getElementById("icon-success")
  errorElement = shadowRoot.getElementById("icon-error")

  if (!contentElement) {
    console.info("Content element not found")
    return
  }
  if (
    !ctaElement ||
    !loadingElement ||
    !successElement ||
    !errorElement ||
    !logoElement
  ) {
    console.info("CTA elements not found")
    return
  }

  //console.log(extractAllGroupContext(document))

  chrome.storage.local.get(["ctaPositionTop"]).then((data) => {
    contentElement.style.top = data.ctaPositionTop
  })

  makeElementDraggable(
    contentElement as HTMLElement,
    shadowRoot.getElementById("formacer-cta-container-drag"),
  )

  logoElement.addEventListener("click", async () => {
    if (ctaState === CTA_STATE.LOADING) {
      return
    }
    setCTAState(CTA_STATE.LOADING)

    const extractedInputData =
      extractContextFromAllInputs(document).concat(
        extractContextFromAllTextarea(document),
      ) ?? []

    const extractedSelectData = selectExtractor
      .getContextForAll(document)
      .concat(extractAllGroupContext(document))

    if (extractedInputData.length < 1 && extractedSelectData.length < 1) {
      displayMessageForSeconds("No empty inputs found to fill!")
      setCTAState(CTA_STATE.ERROR)
      return
    }

    chrome.runtime.sendMessage({
      action: ActionEvents.EXTRACT_INPUT_DATA,
      data: {
        textInputContext: extractedInputData,
        selectContext: extractedSelectData,
      },
    })
  })
}

// Entry point
main()

// In content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log("Received message:", request.message);
  const { action, payload } = message

  // You can send a response back if needed
  if (action === ActionEvents.EXTRACT_INPUT_DATA_RESPONSE) {
    const isSuccessful = message.payload.success
    const data: {
      dataId: string
      value: unknown
      message?: string
      error?: unknown
    }[] = payload.data ?? []

    if (!isSuccessful) {
      displayMessageForSeconds(payload.message)
      setCTAState(CTA_STATE.ERROR)
      sendResponse()
      return true
    }

    fillInputInForm(data).then(() => setCTAState(CTA_STATE.SUCCESS))
  }

  sendResponse()
  return true
})

async function fillInputInForm(
  data: {
    dataId: string
    value: unknown
    message?: string
    error?: unknown
  }[],
) {
  for (const item of data) {
    if ((item.value ?? null) === null || item.value === "null") {
      continue
    }
    const element = document.querySelector(
      `[data-formacer-id="${item.dataId}"]`,
    )
    if (!element) {
      continue
    }
    const isRoleGroup = isRoleGroupNode(element)

    console.log({
      isRoleGroup,
      element,
    })

    if (isRoleGroup && typeof item.value === "string") {
      const options = item.value.split("|")
      applyGroupNodeAnswer(element, options)
    } else if (
      element instanceof HTMLInputElement &&
      typeof item.value === "string"
    ) {
      await simulateTyping(element, item.value as string)
    } else if (
      element instanceof HTMLInputElement &&
      typeof item.value === "number"
    ) {
      element.value = (item.value as number).toString()
    } else if (element instanceof HTMLTextAreaElement) {
      await simulateTyping(element, item.value as string)
    } else if (selectExtractor.elementMatches(element)) {
      selectExtractor.applyAnswer(
        element as HTMLSelectElement,
        item.value as string,
      )
    }
    await sleep(300)
  }
}
