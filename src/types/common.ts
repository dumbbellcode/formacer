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
  colSpan?: number
}

export interface ExtractInputDataResponseItem {
  dataId: string
  value: string
}

// From content script
export interface UserInputElementContext {
  dataId?: string
  tagName?: string
  title?: string
  value?: string
  type?: string
  label?: string
  closestLabel?: string
  closestText?: string
}

export interface SelectInputContext extends UserInputElementContext {
  options: string[]
}

export interface TextInputContext extends UserInputElementContext {
  placeholder?: string
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

export interface FormProfile {
  id: string
  name: string
  createdAt?: string
}

export interface Settings {
  activeProfileId: string
  profiles: FormProfile[]
  displayActionIcon: boolean
  email: string
  isTosAgreed: boolean
}

export enum DETAIL_TYPES {
  SHORT = "short",
  LONG = "long",
}

export enum ActionEvents {
  // From content script
  EXTRACT_INPUT_DATA = "EXTRACT_INPUT_DATA",

  // From background script
  EXTRACT_INPUT_DATA_RESPONSE = "EXTRACT_INPUT_DATA_RESPONSE",
}
