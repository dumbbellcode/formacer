import { UserInputElementContext } from "@/types/common"
import { applyUUIDToElementAndContext } from "../utils/common"

export abstract class AbstractElementExtractor {
  protected getContextForAll(
    node: Element | Document,
  ): Array<UserInputElementContext> {
    const elements = this.getAllElements(node)
    return elements.map((e) => {
      const context = this.getContext(e)
      applyUUIDToElementAndContext(e, context)
      return context
    })
  }
  abstract getContext(e: HTMLElement): UserInputElementContext
  abstract getAllElements(node: Element | Document): Array<HTMLElement>
}
