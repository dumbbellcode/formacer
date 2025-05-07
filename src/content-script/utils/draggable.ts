export function makeElementDraggable(
  elmnt: HTMLElement,
  draggablePart: HTMLElement | null,
) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0
  if (draggablePart) {
    draggablePart.onmousedown = dragMouseDown
  } else {
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown(e: MouseEvent | undefined) {
    if (!e) return

    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e: MouseEvent | undefined) {
    if (!e) return
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px"
    chrome.storage.local.set({ ctaPositionTop: elmnt.style.top.toString() })
    // Disable horizontal movement
    // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}
