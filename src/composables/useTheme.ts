import type { BasicColorSchema } from "@vueuse/core"
import { useBrowserLocalStorage } from "./useBrowserStorage"

export function useTheme() {
  const { data: colorSchema } = useBrowserLocalStorage<BasicColorSchema>(
    "mode",
    "light",
  )

  const isDark = useDark({
    initialValue: colorSchema,
    onChanged(isDark, defaultHandler, mode) {
      // load initial value
      colorSchema.value = mode
      defaultHandler(mode)
      document.body.setAttribute("data-theme", mode)
    },
  })

  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark,
  }
}
