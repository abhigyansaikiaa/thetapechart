import { NextResponse } from 'next/server';
import { getQuote } from '@/lib/api/market';

const PLANNER_PROMPT = `
You are an elite quantitative algorithmic trading engine. 
The user is providing their capital, risk tolerance, and trading style.
Your job is to allocate this capital across a few high-probability setups using REAL TICKER SYMBOLS (e.g., RELIANCE.NS, TSLA, AAPL, HDFCBANK.NS).
You must use Smart Money Concepts (SMC) and ICT to justify these trades.
You MUST output a structured JSON response matching exactly this format (NO markdown blocks, just raw JSON string):
{
  "summary": "Brief executive summary of the strategy",
  "trades": [
    {
      "ticker": "AAPL",
      "allocationPercentage": 30,
      "lotSize": 15,
      "entry": 175.50,
      "stopLoss": 165.00,
      "takeProfit": 210.00,
      "rationale": "SMC mitigation block sweep on the 4H timeframe.",
      "style": "Swing"
    }
  ],
  "riskMetrics": {
    "maxDrawdown": "5%",
    "sharpeRatio": "1.8"
  }
}
Do not return anything other than the JSON.
`;

export async function POST(req: Request) {
  try {
    const { capital, risk, style } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes('placeholder')) {
      // Return a realistic mock JSON response
      return NextResponse.json({
        plan: {
          summary: "MOCK MODE: Groq API key missing. This is a simulated high-probability SMC strategy.",
          trades: [
            {
              ticker: "RELIANCE.NS",
              allocationPercentage: 50,
              lotSize: Math.floor((capital * 0.5) / 2900),
              entry: 2900.50,
              stopLoss: 2820.00,
              takeProfit: 3150.00,
              rationale: "4H Fair Value Gap (FVG) mitigation aligned with bullish macro order flow.",
              style: "Swing"
            },
            {
              ticker: "HDFCBANK.NS",
              allocationPercentage: 50,
              lotSize: Math.floor((capital * 0.5) / 1450),
              entry: 1450.00,
              stopLoss: 1410.00,
              takeProfit: 1580.00,
              rationale: "Liquidity sweep below weekly lows into a daily Institutional Order Block.",
              style: "Position"
            }
          ],
          riskMetrics: {
            maxDrawdown: "3.5%",
            sharpeRatio: "2.1"
          }
        }
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: PLANNER_PROMPT },
          { role: "user", content: `User Profile - Capital: ${capital}, Risk Tolerance: ${risk}, Preferred Style: ${style}. Generate the JSON trading plan.` }
        ],
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Groq Planner API Error]:", errorText);
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawJson = data.choices[0].message.content || "{}";
    const cleanedJson = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    const planData = JSON.parse(cleanedJson);

    return NextResponse.json({ plan: planData });
  } catch (error: any) {
    console.error("[Planner API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
