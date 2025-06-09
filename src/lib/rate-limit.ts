interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  isRateLimited(key: string): boolean {
    this.cleanup();
    const now = Date.now();
    const record = this.store[key];

    if (!record) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return false;
    }

    if (now > record.resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return false;
    }

    if (record.count >= this.config.maxRequests) {
      return true;
    }

    record.count++;
    return false;
  }

  getRemainingRequests(key: string): number {
    this.cleanup();
    const record = this.store[key];
    if (!record) return this.config.maxRequests;
    if (Date.now() > record.resetTime) return this.config.maxRequests;
    return Math.max(0, this.config.maxRequests - record.count);
  }

  getResetTime(key: string): number {
    this.cleanup();
    const record = this.store[key];
    if (!record) return Date.now() + this.config.windowMs;
    return record.resetTime;
  }
}

// Create a rate limiter instance with default settings
// 100 requests per minute per IP
export const rateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
});
