import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'

export const dadJokeToolDefinition = {
  name: 'dad_joke',
  parameters: z.object({}),
}

// We use infer here to extract the argument types from the Zod schema
type Args = z.infer<typeof dadJokeToolDefinition.parameters>

export const dadJoke: ToolFn<Args, string> = async ({ toolArgs }) => {
  const res = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  })
  return (await res.json()).joke
}
