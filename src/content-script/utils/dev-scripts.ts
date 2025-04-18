import { TextInputContext, TextInputContextProps } from "../types"

export const viewExtractedInputs = (extractedInputData: TextInputContext[]) => {
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
