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
      // Apply on <html> so the whole viewport (not just the body's content
      // height) uses the selected theme's background.
      document.documentElement.setAttribute("data-theme", mode)
    },
  })

  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark,
  }
}
