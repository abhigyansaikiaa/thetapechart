import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getQuote } from '@/lib/api/market';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder',
});

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

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('placeholder')) {
      // Return a realistic mock JSON response
      return NextResponse.json({
        plan: {
          summary: "MOCK MODE: Gemini API key missing. This is a simulated high-probability SMC strategy.",
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${PLANNER_PROMPT}\n\nUser Profile - Capital: ${capital}, Risk Tolerance: ${risk}, Preferred Style: ${style}. Generate the JSON trading plan.` }] }
      ]
    });

    const rawJson = response.text || "{}";
    const cleanedJson = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    const planData = JSON.parse(cleanedJson);

    return NextResponse.json({ plan: planData });
  } catch (error: any) {
    console.error("[Planner API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
