export interface TextInputContext {
  dataId?: string
  tagName?: string
  placeholder?: string
  title?: string
  value?: string
  label?: string
  closestLabel?: string
  closestText?: string
}

export const TextInputContextProps: Array<keyof TextInputContext> = [
  "dataId",
  "tagName",
  "placeholder",
  "title",
  "value",
  "label",
  "closestLabel",
  "closestText",
]
