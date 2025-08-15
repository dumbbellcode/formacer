import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"
import { Logger } from "src/utils/logger"

const MODEL = "gemini-2.5-flash"
export default class Llmservice {
  private genAI: GoogleGenerativeAI
  private textModel: GenerativeModel
  private jsonModel: GenerativeModel

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    // For text-only input, use the gemini-pro model
    this.textModel = this.genAI.getGenerativeModel({ model: MODEL })
    // For JSON output, we'll use the same model and guide it with the prompt
    this.jsonModel = this.genAI.getGenerativeModel({ model: MODEL })
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: MODEL })
      // Make a simple, low-cost call to validate the key
      await model.generateContent("ping !")
      return true
    } catch (error) {
      console.error("API Key validation failed:", error)
      return false
    }
  }

  /**
   * Generates a structured JSON object based on the message and schema.
   * @param message The prompt message for the model.
   * @param schema The desired JSON schema (provided as a string hint).
   * @returns A promise that resolves to a JavaScript object.
   */
  async getResultWithSchema(
    message: string,
    schema: object,
  ): Promise<object | null> {
    const schemaHint = JSON.stringify(schema)
    const fullPrompt = `${message}. Please provide the output in the following JSON format: ${schemaHint}. Do not include any additional text or explanations, only the JSON object.`

    try {
      const result = await this.jsonModel.generateContent(fullPrompt)
      const response = await result.response
      let text = response.text()
      // Attempt to extract pure JSON by stripping markdown code block
      text = text.trim()
      if (text.startsWith("```json") && text.endsWith("```")) {
        text = text.substring("```json".length).trim()
        text = text.substring(0, text.length - "```".length).trim()
      }
      const ans = JSON.parse(text)

      Logger.debug("llm-interation", { query: message, schema, answer: ans })

      return ans
    } catch (error) {
      console.error(
        "Failed to generate or parse JSON from model output:",
        error,
      )
      return null
    }
  }

  /**
   * Generates a plain text result from a given message.
   * @param message The prompt message for the model.
   * @returns A promise that resolves to the generated text string.
   */
  async getResult(message: string): Promise<string> {
    try {
      const result = await this.textModel.generateContent(message)
      const response = await result.response

      Logger.debug("llm-interation", {
        question: message,
        response: response.text(),
      })
      return response.text()
    } catch (error) {
      Logger.error("Failed to generate text from model:", error)
      return ""
    }
  }
}
