import { extractContextFromAllInputs } from "./utils/input-extracter"
import { ActionEvents } from "@/types/common"
import { exit } from "process"
import ctaHtml from "./cta-container.html?raw"
import { simulateTyping } from "./utils/typing"

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}

console.info("hello world from content-script")

enum CTA_STATE {
  DEFAULT = "default",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

const container = document.createElement("div")
container.style = "position: fixed; bottom: 80px; right: 20px; z-index: 9999"
const shadowRoot = container.attachShadow({ mode: "open" })
shadowRoot.innerHTML = ctaHtml
document.body.appendChild(container)

const logoElement = shadowRoot.getElementById("formacer-cta-container")
const ctaElement = shadowRoot.getElementById("formacer-cta")
const loadingElement = shadowRoot.getElementById("formacer-cta-loading")
const successElement = shadowRoot.getElementById("formacer-cta-success")
const errorElement = shadowRoot.getElementById("formacer-cta-error")

if (!logoElement) {
  console.info("Logo element not found")
  exit(1)
}
if (!ctaElement || !loadingElement || !successElement || !errorElement) {
  console.info("CTA elements not found")
  exit(1)
}

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

  const extractedInputData = extractContextFromAllInputs(document)
  if (!extractedInputData || extractedInputData.length < 1) {
    console.error("No input data found")
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

  // You can send a response back if needed
  if (message.action === ActionEvents.EXTRACT_INPUT_DATA_RESPONSE) {
    const isSuccessful = message.data.success
    const data: {
      dataId: string
      value: unknown
    }[] = message.data.data ?? []

    if (!isSuccessful) {
      setCTAState(CTA_STATE.ERROR)
      return
    }

    data.forEach((item) => {
      if ((item.value ?? null) === null) {
        return
      }
      const element = document.querySelector(
        `[data-formacer-id="${item.dataId}"]`,
      )
      if (element instanceof HTMLInputElement && typeof item.value === 'string') {
        simulateTyping(element, item.value as string)
      }
      if (element instanceof HTMLInputElement && typeof item.value === 'number') {
        element.value = (item.value as number).toString();
      }
    })

    setCTAState(CTA_STATE.SUCCESS)
  }

  sendResponse()
  return true
})
