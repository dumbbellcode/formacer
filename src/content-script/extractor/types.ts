import { UserInputElementContext } from "@/types/common"

export interface IExtractor {
  getAll(): any[]
}

export interface ElementExtractor {
  getContext(element: HTMLElement): UserInputElementContext
  getAllElements(node: Element | Document): Array<HTMLElement>
  elementMatches(element: Element): boolean
  isElementEmpty(element: HTMLElement): boolean
  getContextForAll(node: Element | Document): Array<UserInputElementContext>
  getEmptyElementsCount(): number
}
