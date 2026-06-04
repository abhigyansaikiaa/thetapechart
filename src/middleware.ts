import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  // Strict Transport Security (HSTS)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  // Cross-Site Scripting (XSS) Protection
  "X-XSS-Protection": "1; mode=block",
  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Permissions Policy (limit access to device features)
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=(), browsing-topics=()",
};

export default function middleware(req: any, event: any) {
  if (!isClerkEnabled) {
    const res = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });
    return res;
  }

  return clerkMiddleware(async (auth, req) => {
    // Protect all non-public routes
    if (!isPublicRoute(req)) {
      await auth.protect();
    }

    const res = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });

    return res;
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
