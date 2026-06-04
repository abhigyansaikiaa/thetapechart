import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Upstash Redis only if env vars are present to prevent crashes
const isUpstashConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = isUpstashConfigured ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
}) : null;

// Global rate limit: 100 requests per minute per IP
const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: '@upstash/ratelimit/global',
}) : null;

// List of known scraper/bot user agents
const BLOCKED_USER_AGENTS = [
  "curl", "wget", "python-requests", "scrapy", "postman", "insomnia", 
  "httpie", "go-http-client", "java", "nikto", "nmap", "sqlmap"
];

function isBot(userAgent: string) {
  const ua = userAgent.toLowerCase();
  return BLOCKED_USER_AGENTS.some(bot => ua.includes(bot));
}

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/blog(.*)",
  "/tools(.*)",
  "/about",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/api/webhook/razorpay"
]);

const isClerkEnabled = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YWxwaGFlZGdl") &&
  process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("placeholder");

const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=(), browsing-topics=()",
};

// Apply security headers to response
function applySecurityHeaders(res: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
  return res;
}

export default async function middleware(req: NextRequest, event: any) {
  // 1. Basic Bot Protection
  const userAgent = req.headers.get("user-agent") || "";
  if (isBot(userAgent)) {
    return new NextResponse("Access Denied - Automated Bot Detected", { status: 403 });
  }

  // 2. Global Rate Limiting
  if (ratelimit) {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(`global_limit_${ip}`);
    
    if (!success) {
      return new NextResponse("Rate Limit Exceeded. Please try again later.", { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString()
        }
      });
    }
  }

  // 3. Clerk Authentication & Security Headers
  if (!isClerkEnabled) {
    const res = NextResponse.next();
    return applySecurityHeaders(res);
  }

  return clerkMiddleware(async (auth, request) => {
    // Protect all non-public routes
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
    const res = NextResponse.next();
    return applySecurityHeaders(res);
  })(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
