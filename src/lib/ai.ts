import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to create a streaming response
export async function createStreamingResponse(prompt: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125', // Latest version with better performance/cost ratio
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful AI assistant. Please provide concise and direct responses to save on token usage.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 500, // Limit response length
    temperature: 0.7, // Balance between creativity and consistency
    presence_penalty: 0.6, // Encourage diverse responses
    frequency_penalty: 0.6, // Reduce repetition
  });

  // Create a TransformStream to handle the response
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Process the stream
  (async () => {
    try {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          await writer.write(encoder.encode(content));
        }
      }
      await writer.close();
    } catch (error) {
      console.error('Stream error:', error);
      await writer.abort(error);
    }
  })();

  // Return a Response with the readable stream
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
