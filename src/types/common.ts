export interface AccurateDetails {
  fields?: AccurateDetailItem[]
}

export interface CreativeDetails {
  fields?: DetailItem[]
}

export interface DetailItem {
  label: string
  value: string
  id: string
}

export interface AccurateDetailItem extends DetailItem {
  label: string
  value: string
  placeholder?: string
  section?: string
  autocomplete?: string
}

export interface ExtractInputDataResponseItem {
  dataId: string
  value: string
}

// From content script
export interface TextInputContext {
  dataId?: string
  tagName?: string
  type?: string
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

export enum DETAIL_TYPES {
  ACCURATE = "accurate",
  CREATIVE = "creative",
}

export enum ActionEvents {
  // From content script
  EXTRACT_INPUT_DATA = "EXTRACT_INPUT_DATA",

  // From background script
  EXTRACT_INPUT_DATA_RESPONSE = "EXTRACT_INPUT_DATA_RESPONSE",
}
