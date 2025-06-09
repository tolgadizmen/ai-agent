/**
 * Utility function to retry a function with exponential backoff
 * @param fn The function to retry
 * @param maxRetries Maximum number of retries (default: 3)
 * @param initialDelay Initial delay in milliseconds (default: 1000)
 * @returns The result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries > maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff and jitter
      const jitter = Math.random() * 0.1 * delay;
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      delay *= 2; // Exponential backoff
    }
  }
}
