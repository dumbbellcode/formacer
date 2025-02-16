// This import scss file is used to style the iframe that is injected into the page
import "./index.scss"
import { InputBag } from "./types"

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

const allowedTypes = ["text"]

const isNameInput = ({name, placeholder, firstLabel}: InputBag) => {
  const format = (text: string) => {
    return text.split(" ").join("_").toLowerCase();
  }
  const data = [name, placeholder, firstLabel]
  const nameText = ["name","full_name"]
  return data.some((text) => {
    return nameText.includes(format(text))
  })
}

const calculateInputs = (populate = false) => {
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

    const item = {
      type,
      firstLabel,
      name,
      value,
      placeholder,
      visible: input.checkVisibility(),
    }
    if(populate && isNameInput(item)) {
      input.value = "Sudheer Tripathi"
    }
    bag.push(item);
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

  const existingTable = document.getElementById("formace-table")
  if (existingTable) {
    existingTable.remove()
  } else { 
    document.body.appendChild(table)
  }
}

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "b") {
    calculateInputs();
  }
});

const iframeEl = document.getElementById("fx-iframe");

const logo = `
<div class='logo-action'> 
<div> </div>
</div>
`
const template = document.createElement('div');
template.innerHTML = logo;
document.body.appendChild(template)
template.addEventListener('click', () => {
  console.log("Clicked");
  calculateInputs(true)
})