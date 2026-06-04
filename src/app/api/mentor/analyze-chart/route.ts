import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder',
});

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

export async function POST(req: Request) {
  try {
    const { imageBase64, filename } = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('placeholder')) {
      // Mock heuristic: attempt to detect if it's a chart locally since we don't have Vision AI
      const name = (filename || "").toLowerCase();
      const invalidKeywords = ["car", "dog", "cat", "selfie", "person", "food", "meme", "photo", "terms", "condition", "text", "document"];
      const isInvalid = invalidKeywords.some(kw => name.includes(kw));
      
      if (isInvalid) {
        return NextResponse.json({ error: "Local Vision Engine: The uploaded image appears to be a photograph or text document, not a financial chart." }, { status: 400 });
      }

      return NextResponse.json({
        content: [
          {
            text: "### MOCK ANALYSIS (Simulated Local Engine)\n\nSince the API key is not configured, I am running a simulated structural analysis.\n\nHowever, if I could see fully, I would identify the **Fair Value Gap** at the 4H timeframe and construct a 1:4 R:R short position targeting sell-side liquidity."
          }
        ]
      });
    }

    // Extract base64 and mime type
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { 
          role: 'user', 
          parts: [
            { text: `SYSTEM INSTRUCTION: ${VISION_SYSTEM_PROMPT}\n\nAnalyze this chart based on SMC principles. Give me the directional bias, key liquidity levels, and an actionable trade plan.` },
            { 
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ] 
        }
      ]
    });

    return NextResponse.json({
      content: [
        { text: response.text }
      ]
    });
  } catch (error: any) {
    console.error("[Chart Analysis API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
