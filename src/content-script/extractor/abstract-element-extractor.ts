import { UserInputElementContext } from "@/types/common"
import { applyUUIDToElementAndContext } from "../utils/common"

export abstract class AbstractElementExtractor {
  public getContextForAll(
    node: Element | Document,
  ): Array<UserInputElementContext> {
    const elements = this.getAllElements(node)
    return elements.map((e) => {
      const context = this.getContext(e)
      applyUUIDToElementAndContext(e, context)
      return context
    })
  }

  public getEmptyElementsCount(): number {
    const elements = this.getAllElements(document)
    return elements.filter((element) => this.isElementEmpty(element)).length
  }

  abstract getContext(e: HTMLElement): UserInputElementContext
  abstract getAllElements(node: Element | Document): Array<HTMLElement>
  abstract elementMatches(element: Element): boolean
  abstract isElementEmpty(element: HTMLElement): boolean
}
