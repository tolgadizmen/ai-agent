import { createStreamingResponse } from '@/lib/ai';
import { retryWithBackoff } from '@/lib/utils';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (rateLimiter.isRateLimited(ip)) {
      const resetTime = rateLimiter.getResetTime(ip);
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          resetTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage?.content) {
      return new Response('No message content provided', { status: 400 });
    }

    // Use retry logic for the streaming response
    return await retryWithBackoff(
      () => createStreamingResponse(lastMessage.content),
      3, // max retries
      1000 // initial delay in ms
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
