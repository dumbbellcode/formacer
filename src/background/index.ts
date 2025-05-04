// Sample code if using extensionpay.com
// import { extPay } from '@/utils/payment/extPay'
// extPay.startBackground()
import { ActionEvents, TextInputContext } from "@/types/common"
import { getAccurateFillData } from "./service"

chrome.runtime.onInstalled.addListener(async (opt) => {
  // Check if reason is install or update. Eg: opt.reason === 'install' // If extension is installed.
  // opt.reason === 'update' // If extension is updated.

  if (opt.reason === "install") {
    chrome.tabs.create({
      active: true,
      // Open the setup page and append `?type=install` to the URL so frontend
      // can know if we need to show the install page or update page.
      url: chrome.runtime.getURL("src/ui/setup/index.html#/setup/install"),
    })

    return
  }

  if (opt.reason === "update") {
    // Opens new tab on update
    // chrome.tabs.create({
    //   active: true,
    //   url: chrome.runtime.getURL("src/ui/options-page/index.html"),
    // })

    return
  }
})

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id

  if (msg.action === "openOptionsPage") {
    chrome.runtime.openOptionsPage()
    // sendResponse({status: "Options page opened"});
  }

  if (msg.action === ActionEvents.EXTRACT_INPUT_DATA) {
    const inputContext: TextInputContext[] = msg.data
    getAccurateFillData(inputContext).then((response) => {
      chrome.tabs.sendMessage(
        tabId as number,
        {
          action: ActionEvents.EXTRACT_INPUT_DATA_RESPONSE,
          payload: response,
        },
        {},
        (response) => {
          // eslint-disable-next-line no-console
          console.log(response)
        },
      )
    })
  }

  sendResponse()
  return true
})

export {}
