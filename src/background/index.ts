// Sample code if using extensionpay.com
// import { extPay } from '@/utils/payment/extPay'
// extPay.startBackground()

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
    //   url: chrome.runtime.getURL("src/ui/setup/index.html#/setup/update"),
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

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  console.info("message", msg);
  if (msg.action === "openOptionsPage") { 
    chrome.runtime.openOptionsPage(); 
    // sendResponse({status: "Options page opened"}); 
  } 
  return true;
})

console.info("hello world from background")

export {}
