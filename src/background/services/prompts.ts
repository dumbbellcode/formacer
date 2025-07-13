const OPTIONS_SEPARATOR = "|"

function wrapFormDataPoint(obj: object, tag: string): string {
  const start = `<${tag}>`
  const end = `</${tag}>`
  const dataString = Object.entries(obj)
    .map(([key, val]) => {
      if (Array.isArray(val)) {
        return `${key}: ${val.join(OPTIONS_SEPARATOR)}`
      }

      return `${key}: ${val}`
    })
    .join("\n")
  return [start, dataString, end].join("\n")
}

function wrapFormDataPoints(
  obj: object[],
  tag: string = "FormDataPoint",
): string {
  return obj.map((o) => wrapFormDataPoint(o, tag)).join("\n\n")
}

export function safeParseLLMJson(outputJson: string) {
  try {
    const json = JSON.parse(outputJson)
    return json
  } catch (err) {
    console.error(err)
    return null
  }
}

export function wrapContext(
  context: {
    label: string
    value: string
  }[],
) {
  const start = "<Context>"
  const end = "</Context>"
  const contextString = context.reduce((prev, { label, value }) => {
    return prev + `${label}:${value}\n`
  }, "")
  return [start, contextString, end].join("\n")
}

export function buildTextInputDataExtractionPrompt(
  contextPrompt: string,
  dataPoints: object[],
) {
  const dataPointText = wrapFormDataPoints(dataPoints)

  return `
You are an intelligent LLM that extracts data from context based on form input.
Strictly respond with answer or null. Do not provide explanations.

${contextPrompt}

Provided below is extracted form input data, you have to pick the correct value from context 
based on title, placeholder and label of form. If they are empty, try to find value based on
closestLabel and closestText. Convert answer in any format if it's mentioned.
If type is textarea, answer with statements. If type in input, answer accurately and precisely.


${dataPointText}
`
}

export function buildSingleSelectInputDataExtractionPrompt(
  contextPrompt: string,
  dataPoints: object[],
): string {
  const dataPointText = wrapFormDataPoints(dataPoints, "SingleChoice")

  return `
  You are an intelligent LLM that extracts data from context based on form input.
  Strictly respond with correct option or null. Do not provide explanations.

  ${contextPrompt}

  Provided below is list of single choice questions <SingleChoice>. 
  The question is present in title, placeholder, label, closestLabel or closestText. 
  The options are separated by ${OPTIONS_SEPARATOR} character. Based on provided context and question, 
  pick only one correct option, return null if the answer of question is not present 
  in context or option. 

  ${dataPointText}
  `
}

export function buildMultiSelectInputDataExtractionPrompt(
  contextPrompt: string,
  dataPoints: object[],
): string {
  const dataPointText = wrapFormDataPoints(dataPoints, "MultipleChoice")

  return `
  You are an intelligent LLM that extracts data from context based on form input.
  Strictly respond with correct option or null. Do not provide explanations.

  ${contextPrompt}

  Provided below is list of multiple choice questions <MultipleChoice>. 
  The question is present in title, placeholder, label, closestLabel or closestText. 
  The options are separated by ${OPTIONS_SEPARATOR} character.
  Based on provided context and question, return an array of options
  that are applicable for the questions, return null if no options apply for the 
  context. 

  ${dataPointText}
  `
}
