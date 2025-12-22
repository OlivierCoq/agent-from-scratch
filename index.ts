import 'dotenv/config'
import { runLLM } from './src/llm'
import { addMessages, getMessages } from './src/memory'
const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

await addMessages([{ role: 'user', content: userMessage }])
const messages = await getMessages()

const response = await runLLM({
  messages,
})

await addMessages([{ role: 'assistant', content: response }])

console.log(response)

/* 
 Essentially what we're doing here is saving the entire conversation history to a 
 JSON file using lowdb, and then sending that entire history to the LLM with
  each request. This allows the LLM to have full context of the conversation,
    enabling it to generate more relevant and coherent responses.

*/