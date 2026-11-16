import { GoogleGenAI, ThinkingLevel } from "@google/genai"
import { Logger } from "src/utils/logger"

const MODEL = "gemini-3.8-flash"
// Form filling is mostly matching saved details to field labels, so deep
// reasoning isn't needed; minimal thinking keeps responses fast.
const THINKING_CONFIG = { thinkingLevel: ThinkingLevel.MINIMAL }
export default class Llmservice {
  private genAI: GoogleGenAI

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({
      apiKey,
      // SDK default is 5 attempts with up to 60s backoff, which can leave the
      // user waiting for minutes. Keep retries short so failures surface fast.
      httpOptions: {
        timeout: 60_000,
        retryOptions: { attempts: 3, initialDelay: 1, maxDelay: 5 },
      },
    })
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const genAI = new GoogleGenAI({
        apiKey,
        httpOptions: { timeout: 10_000, retryOptions: { attempts: 1 } },
      })
      // Fetching model metadata authenticates the key (and confirms the model
      // is available) without running a generation, so it returns quickly.
      await genAI.models.get({ model: MODEL })
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
      const response = await this.genAI.models.generateContent({
        model: MODEL,
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
          thinkingConfig: THINKING_CONFIG,
        },
      })
      let text = (response.text ?? "").trim()
      // Defensive: strip a markdown code block if the model still adds one
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
      const response = await this.genAI.models.generateContent({
        model: MODEL,
        contents: message,
        config: { thinkingConfig: THINKING_CONFIG },
      })
      const text = response.text ?? ""

      Logger.debug("llm-interation", {
        question: message,
        response: text,
      })
      return text
    } catch (error) {
      Logger.error("Failed to generate text from model:", error)
      return ""
    }
  }
}
