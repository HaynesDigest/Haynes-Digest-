import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  const { linkList } = await request.json()

  const prompt = `You are writing a friendly, engaging weekly newsletter digest for a small group of friends who share interesting links with each other. The newsletter has a culture focus — links span art, music, literature, poetry, film, design, games, science, and tech.

Here are this week's submitted links:

${linkList}

Write a warm, conversational weekly digest email. Include:
- A brief intro (2 sentences, make it feel personal and fun)
- Each link as its own short section: title as a header, the URL, a 2-3 sentence write-up expanding on why it's interesting, and credit to who shared it
- A short sign-off

Keep the tone curious and enthusiastic, like a letter from a well-read friend. Do not use markdown headers with #, use plain text formatting instead.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  })

  const digest = message.content[0].text

  return Response.json({ digest })
}
