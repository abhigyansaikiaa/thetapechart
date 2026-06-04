import { NextResponse } from "next/server";

import { MOCK_SUGGESTIONS } from "@/lib/dashboardData";

// Turn off caching for this API route to ensure fresh suggestions
export const revalidate = 0;

export async function GET() {
  try {
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const projectGroupId = process.env.NEXT_PUBLIC_PROJECT_GROUP_ID || "4100f401-5f7c-4fb8-a905-78979711cb3b";

    // ────────────────────────────────────────────────────────────────
    // Context Setup (Static fallbacks for Indian market context)
    // ────────────────────────────────────────────────────────────────
    const marketContext = `
Current market data (NSE India, ${new Date().toLocaleDateString("en-IN")}):
- NIFTY 50: ~24,850 (+0.76%)
- BANKNIFTY: ~53,400 (-0.46%)
- India VIX: ~13-15 (moderate volatility)
- FII Trend: Net buyers this week
- Market Session: Regular trading hours
`;

    const prompt = `${marketContext}

Based on current market conditions, provide 4 specific high-probability trade setups for Indian markets. Return ONLY valid JSON matching this schema:
{
  "market_bias": "Bullish or Bearish or Neutral",
  "vix_reading": "Low or Moderate or High",
  "suggestions": [
    {
      "id": "1",
      "symbol": "NIFTY or stock symbol",
      "instrument": "Futures or Options (CE/PE) or Equity",
      "direction": "Long or Short",
      "strategy": "SMC or ICT or Breakout or Reversal or Swing",
      "setup": "setup name e.g. Order Block Long, Demand Zone Bounce",
      "entry": 24350,
      "stop_loss": 24200,
      "target1": 24650,
      "rr_ratio": 2.5,
      "timeframe": "Intraday or Swing or Positional",
      "confidence": 78,
      "rationale": "2-3 sentence explanation of the setup and why it's high probability",
      "key_level": "critical price level to watch",
      "validity": "Today only or 2-3 days or This week"
    }
  ],
  "market_summary": "2-3 sentence overview of current market structure and bias",
  "avoid": "What NOT to trade today and why"
}`;

    // ────────────────────────────────────────────────────────────────
    // METHOD 1: Direct DeepSeek API
    // ────────────────────────────────────────────────────────────────
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (deepseekKey) {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${deepseekKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are an expert quantitative trader." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.choices[0].message.content || "{}";
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return NextResponse.json(JSON.parse(jsonMatch[0]));
        }
      } else {
        console.warn("DeepSeek API failed:", await response.text());
      }
    }

    // ────────────────────────────────────────────────────────────────
    // METHOD 3: Graceful Mock Fallback (if no keys or calls failed)
    // ────────────────────────────────────────────────────────────────
    return NextResponse.json(MOCK_SUGGESTIONS);

  } catch (error) {
    console.error("Failed to generate trade suggestions:", error);
    return NextResponse.json(MOCK_SUGGESTIONS);
  }
}
