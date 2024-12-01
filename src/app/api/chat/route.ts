import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-3.5-turbo-0125'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}
