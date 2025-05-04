import { extractContextFromAllInputs } from "./utils/input-extracter"
import { ActionEvents, DETAIL_TYPES, Settings } from "@/types/common"
import { exit } from "process"
import ctaHtml from "./cta-container.html?raw"
import { simulateTyping } from "./utils/typing"
import { makeElementDraggable } from "./utils/draggable"
import { displayForSeconds } from "./utils/common"
import { extractContextFromAllTextarea } from "./utils/textarea-extracter"

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

const container = document.createElement("div")
container.style = "position: absolute; top: 0; left: 0"

getValueFromStorage<Settings>("settings", "sync").then((setting) => {
  if (setting && !setting.displayActionIcon) {
    container.style.display = "none"
  } else {
    container.style.display = "block"
  }
})

const shadowRoot = container.attachShadow({ mode: "open" })
shadowRoot.innerHTML = ctaHtml
document.body.appendChild(container)

const contentElement = shadowRoot.getElementById("formacer-cta-container")
const logoElement = shadowRoot.getElementById("formacer-icons-section")
const ctaElement = shadowRoot.getElementById("icon-default")
const loadingElement = shadowRoot.getElementById("icon-loading")
const successElement = shadowRoot.getElementById("icon-success")
const errorElement = shadowRoot.getElementById("icon-error")

function displayMessageForSeconds(message: string) {
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

if (!contentElement) {
  console.info("Content element not found")
  exit(1)
}
if (
  !ctaElement ||
  !loadingElement ||
  !successElement ||
  !errorElement ||
  !logoElement
) {
  console.info("CTA elements not found")
  exit(1)
}

makeElementDraggable(
  contentElement as HTMLElement,
  shadowRoot.getElementById("formacer-cta-container-drag"),
)

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

logoElement.addEventListener("click", async () => {
  if (ctaState === CTA_STATE.LOADING) {
    return
  }
  setCTAState(CTA_STATE.LOADING)

  const extractedInputData = extractContextFromAllInputs(document).concat(
    extractContextFromAllTextarea(document),
  )
  if (!extractedInputData || extractedInputData.length < 1) {
    displayMessageForSeconds("No empty inputs found to fill!")
    setCTAState(CTA_STATE.ERROR)
    return
  }

  chrome.runtime.sendMessage({
    action: ActionEvents.EXTRACT_INPUT_DATA,
    data: extractedInputData,
  })
})

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
    if ((item.value ?? null) === null) {
      return
    }
    const element = document.querySelector(
      `[data-formacer-id="${item.dataId}"]`,
    )
    if (element instanceof HTMLInputElement && typeof item.value === "string") {
      await simulateTyping(element, item.value as string)
    } else if (
      element instanceof HTMLInputElement &&
      typeof item.value === "number"
    ) {
      element.value = (item.value as number).toString()
    } else if (
      element instanceof HTMLTextAreaElement &&
      item.value !== "null"
    ) {
      await simulateTyping(element, item.value as string)
    }
  }
}
