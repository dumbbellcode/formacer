// Simulate typing function
export function simulateTyping(
  inputElement: HTMLInputElement | HTMLTextAreaElement,
  text: string,
  delay = 10,
) {
  return new Promise((resolve) => {
    // Focus on the input element first
    inputElement.focus()

    let i = 0
    const typeNextCharacter = () => {
      if (i < text.length) {
        const char = text.charAt(i)

        // Create and dispatch keydown event
        const keydownEvent = new KeyboardEvent("keydown", {
          key: char,
          code: getKeyCode(char),
          bubbles: true,
          cancelable: true,
        })
        inputElement.dispatchEvent(keydownEvent)

        // Create and dispatch keypress event
        const keypressEvent = new KeyboardEvent("keypress", {
          key: char,
          code: getKeyCode(char),
          bubbles: true,
          cancelable: true,
        })
        inputElement.dispatchEvent(keypressEvent)

        // Update the input value manually by appending the character
        inputElement.value += char

        // Create and dispatch input event
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        })
        inputElement.dispatchEvent(inputEvent)

        // Create and dispatch keyup event
        const keyupEvent = new KeyboardEvent("keyup", {
          key: char,
          code: getKeyCode(char),
          bubbles: true,
          cancelable: true,
        })
        inputElement.dispatchEvent(keyupEvent)

        // Move to the next character after delay
        i++
        setTimeout(typeNextCharacter, delay)
      } else {
        // Typing complete, trigger change event and resolve promise
        const changeEvent = new Event("change", {
          bubbles: true,
          cancelable: true,
        })
        inputElement.dispatchEvent(changeEvent)
        resolve("done")
      }
    }

    // Start typing
    typeNextCharacter()
  })
}

// Helper function to get the appropriate key code
function getKeyCode(char: string) {
  if (/[a-zA-Z]/.test(char)) {
    return "Key" + char.toUpperCase()
  } else if (/[0-9]/.test(char)) {
    return "Digit" + char
  } else {
    // Map special characters to their key codes
    const specialChars: Record<string, string> = {
      " ": "Space",
      ",": "Comma",
      ".": "Period",
      "!": "Digit1", // Shift + 1
      "@": "Digit2", // Shift + 2
      "#": "Digit3",
      $: "Digit4",
      "%": "Digit5",
      "^": "Digit6",
      "&": "Digit7",
      "*": "Digit8",
      "(": "Digit9",
      ")": "Digit0",
      "-": "Minus",
      _: "Minus",
      "=": "Equal",
      "+": "Equal",
      ";": "Semicolon",
      ":": "Semicolon",
      "'": "Quote",
      '"': "Quote",
      "/": "Slash",
      "?": "Slash",
      "\\": "Backslash",
      "|": "Backslash",
    }

    return specialChars[char] || "Unidentified"
  }
}
