// This import scss file is used to style the iframe that is injected into the page
import "./index.scss"

import { InputBag } from "./types"

const src = chrome.runtime.getURL("src/ui/content-script-iframe/index.html")

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe" src="${src}"></iframe>`,
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

const allowedTypes = ["text"]

const isNameInput = (e: HTMLInputElement) => {
  const format = (text: string) => {
    return text.split(" ").join("_").toLowerCase();
  }
  const data = [
    e.name,
    e.placeholder
  ]
  const nameText = ["name","full_name"]
  return data.some((text) => {
    return nameText.includes(format(text))
  })
}

const calculateInputs = () => {
  const inputs = document.querySelectorAll("input")
  const bag: InputBag[] = []
  inputs.forEach((input) => {
    const type = input.type
    if (!allowedTypes.includes(type) || input.offsetParent === null) {
      return
    }
    const firstLabel = input.labels?.[0]?.innerText || "No label"
    const name = input.name
    const value = input.value
    const placeholder = input.placeholder

    if(isNameInput(input)) {
      input.value = "Sudheer Tripathi"
    }

    bag.push({
      type,
      firstLabel,
      name,
      value,
      placeholder,
      visible: input.checkVisibility(),
    })
  })
  const table = document.createElement("table")
  const headerRow = document.createElement("tr")
  table.style.position = "absolute"
  table.style.right = "0"
  table.style.top = "50vh"
  table.style.zIndex = "10"
  table.id = "formace-table"

  

  ;["Type", "First Label", "Name", "Value", "Placeholder", "Visible"].forEach(
    (text) => {
      const th = document.createElement("th")
      th.textContent = text
      headerRow.appendChild(th)
    },
  )

  table.appendChild(headerRow)

  bag.forEach((item) => {
    const row = document.createElement("tr")

    Object.values(item).forEach((text) => {
      const td = document.createElement("td")
      td.textContent = text ?? ""
      row.appendChild(td)
    })

    table.appendChild(row)
  })
  console.log(bag)
  const existingTable = document.getElementById("formace-table")
  if (existingTable) {
    existingTable.remove()
  }
  document.body.appendChild(table)
}

calculateInputs()

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "b") {
    event.preventDefault()
    calculateInputs()
  }
})
