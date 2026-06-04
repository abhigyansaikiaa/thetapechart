import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

// Analyze chart endpoint: 10 requests per hour
export const analyzeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/analyze',
})

// News endpoint: 60 requests per minute
export const newsRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/news',
})

// General Market data endpoints: 120 requests per minute
export const marketRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/market',
})

// Auth endpoints (if handled in API routes): 5 failed attempts / 15 mins
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth',
})
