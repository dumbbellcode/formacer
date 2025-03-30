// This import scss file is used to style the iframe that is injected into the page
import { extractContextFromAllInputs } from "./extracter/text-input-extracter"
import "./index.scss"
import svg from './bot.svg';
import { TextInputContext, TextInputContextProps } from "./types"

export type InputBag = {
  type: string
  firstLabel: any
  name: string
  value: any
  placeholder: string
  visible: any
}

const src = chrome.runtime.getURL("src/ui/content-script-iframe/index.html")

const iframe = new DOMParser().parseFromString(
  `<iframe id="fx-iframe" class="crx-iframe" src="${src}"></iframe>`,
  "text/html",
).body.firstElementChild

if (iframe) {
  // document.body?.append(iframe)
}

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}

console.info("hello world from content-script")


const calculateInputs = (populate = false) => {
  const extractedInputData: TextInputContext[] =
    extractContextFromAllInputs(document)
  const table = document.createElement("table")
  const headerRow = document.createElement("tr")
  table.style.position = "absolute"
  table.style.right = "0"
  table.style.top = "50vh"
  table.style.zIndex = "999"
  table.id = "formace-table"

  TextInputContextProps.forEach((text) => {
    const th = document.createElement("th")
    th.textContent = text
    headerRow.appendChild(th)
  })

  table.appendChild(headerRow)

  extractedInputData.forEach((inputContext) => {
    const row = document.createElement("tr")
    TextInputContextProps.forEach((key) => {
      const td = document.createElement("td")
      td.textContent = inputContext[key] ?? ""
      row.appendChild(td)
    })

    table.appendChild(row)
  })

  const existingTable = document.getElementById("formace-table")
  if (existingTable) {
    existingTable.remove()
  } else {
    document.body.appendChild(table)
  }
}

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "b") {
    calculateInputs()
  }
})

const iframeEl = document.getElementById("fx-iframe")


let isLoadingData = false;

const logo = `
<div class='logo-position'> 
<div id='logo-action'> <div> </div></div>
<div id='formacer-loading' style='display:none'>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
</div>
</div>
`

const template = document.createElement("formacer")
template.innerHTML = logo
document.body.appendChild(template);

template.addEventListener("click", () => {

  const actionComp = document.getElementById('logo-action');
  const loaderComp = document.getElementById('formacer-loading');

  if(loaderComp) {
    loaderComp.style.display = 'block';
  }

  if(actionComp) {
    actionComp.style.display  = 'none';
  }

  calculateInputs(true)
})
