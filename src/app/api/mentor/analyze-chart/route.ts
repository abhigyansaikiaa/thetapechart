import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth, clerkClient } from '@clerk/nextjs/server';

const VISION_SYSTEM_PROMPT = `
You are an institutional Quant and elite Smart Money Concept (SMC) analyst.
The user has uploaded a screenshot of a financial chart.
Your task is to analyze this chart purely through the lens of institutional order flow.
You MUST:
1. Identify the current trend (Bullish, Bearish, or Accumulation/Distribution).
2. Spot prominent Liquidity Sweeps and Fair Value Gaps (FVG).
3. Identify strong Order Blocks (OB) and mitigation zones.
4. Calculate an actionable trade plan: Entry point, Stop Loss (Invalidation), and Take Profit (Targets) with a minimum 1:3 Risk to Reward.
5. Present this in a highly structured, professional format. Do not use retail indicators like RSI or MACD in your primary thesis.
`;

const SECURITY_PATTERNS = [
  /DROP\s+TABLE/i,
  /OR\s+1\s*=\s*1/i,
  /<script>/i,
  /javascript:/i,
  /UNION\s+SELECT/i,
  /system\(/i,
  /exec\(/i,
];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const cookieStore = await cookies();
    
    let { imageBase64, filename, prompt } = await req.json();

    // ────────────────────────────────────────────────────────────────
    // 1. SECURITY THREAT DETECTION & AUTO-BAN
    // ────────────────────────────────────────────────────────────────
    const payloadString = String(filename || "") + " " + String(prompt || "");
    const isThreat = SECURITY_PATTERNS.some(pattern => pattern.test(payloadString));

    if (isThreat) {
      if (userId) {
        console.warn(`[SECURITY] Threat detected from user ${userId}. Executing auto-ban.`);
        const client = await clerkClient();
        await client.users.banUser(userId);
      }
      return NextResponse.json({ error: "Security violation detected. Account banned." }, { status: 403 });
    }

    // ────────────────────────────────────────────────────────────────
    // 2. STRICT DEVICE-BASED RATE LIMITING (2 per day)
    // ────────────────────────────────────────────────────────────────
    let deviceId = cookieStore.get('alphaedge_device_id')?.value;
    
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      // Set a permanent 10-year cookie for device fingerprinting
      cookieStore.set('alphaedge_device_id', deviceId, { maxAge: 60 * 60 * 24 * 365 * 10, httpOnly: true });
    }

    const today = new Date().toISOString().split('T')[0];
    const usageCookieName = `chart_usage_${deviceId}_${today}`;
    const usageCount = parseInt(cookieStore.get(usageCookieName)?.value || "0");

    if (usageCount >= 2) {
      return NextResponse.json({ 
        error: "Device Limit Exceeded",
        content: [
          { text: "### DAILY LIMIT REACHED\n\nYour device has reached the maximum allowed chart analyses (2 per day). This limit is strictly enforced per device. Please come back tomorrow." }
        ]
      }, { status: 429 });
    }

    // Increment device usage counter
    cookieStore.set(usageCookieName, (usageCount + 1).toString(), { maxAge: 60 * 60 * 24, httpOnly: true });

    // ────────────────────────────────────────────────────────────────
    // 3. GEMINI VISION API INTEGRATION
    // ────────────────────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    // Clean Base64 string for Gemini (remove data:image/... prefix if exists)
    let base64Data = imageBase64;
    let mimeType = "image/jpeg";
    
    if (imageBase64.includes(";base64,")) {
      const parts = imageBase64.split(";base64,");
      mimeType = parts[0].replace("data:", "");
      base64Data = parts[1];
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: VISION_SYSTEM_PROMPT + "\n\nAnalyze this chart based on SMC principles. Give me the directional bias, key liquidity levels, and an actionable trade plan." },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Gemini API Error]:", errorText);
      throw new Error("Failed to process chart analysis.");
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis complete.";

    return NextResponse.json({
      content: [
        { text: replyText }
      ]
    });

  } catch (error: any) {
    console.error("[Chart Analysis API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
