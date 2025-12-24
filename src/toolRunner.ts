import type OpenAI from 'openai'

<<<<<<< HEAD
const getWeather = () => `hot, 90deg`
=======
const getWeather = (input: any) => `hot, 90deg`
>>>>>>> step/4

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  }

  switch (toolCall.function.name) {
    case 'get_weather':
      return getWeather(input)
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`)
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> step/4
