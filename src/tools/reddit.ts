import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'
import { openai } from '../ai'
import { zodResponseFormat } from 'openai/helpers/zod'

export const redditToolDefinition = {
  name: 'reddit',
  parameters: z
    .object({}) // We use an empty object since we don't need any parameters
    .describe(
      'Use this tool to get the latest posts from Reddit. It will return a JSON object with the title, link, subreddit, author, and upvotes of each post.'
    ),
}

type Args = z.infer<typeof redditToolDefinition.parameters>

async function chooseRelevantSubreddit(userMessage: string, subreddits: string[]): Promise<string> {
  const SubredditSchema = z.object({
    subreddit: z.enum(subreddits as [string, ...string[]]),
    reasoning: z.string().optional(),
  })

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a subreddit selector. Choose the most relevant subreddit for the user's message based on the topic they're asking about.`,
      },
      {
        role: 'user',
        content: `Choose the best subreddit for this message: "${userMessage}"`,
      },
    ],
    response_format: zodResponseFormat(SubredditSchema, 'subreddit_selection'),
  })

  const parsed = JSON.parse(response.choices[0].message.content || '{}')
  return parsed.subreddit || 'aww'
}

export const reddit: ToolFn<Args, string> = async ({
  toolArgs,
  userMessage,
}) => {

  let subreddits = ['nfl', 'nba', 'soccer', 'baseball', 'hockey', 'sports', 'aww', 'technology', 'science', 'movies', 'books', 'music', 'gaming', 'worldnews', 'news', 'funny', 'pics', 'health', 'AskReddit']

  const relevantSubredit = await chooseRelevantSubreddit(userMessage, subreddits)

  const { data } = await fetch(`https://www.reddit.com/r/${relevantSubredit}/.json`).then((res) =>
    res.json()
  )

  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }))

  return JSON.stringify(relevantInfo, null, 2)
}
