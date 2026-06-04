import { NextResponse } from 'next/server';

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

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes('placeholder')) {
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

    // Prepare Base64 Image
    let base64Data = imageBase64;
    if (!imageBase64.startsWith("data:image")) {
       base64Data = `data:image/jpeg;base64,${imageBase64}`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${VISION_SYSTEM_PROMPT}\n\nAnalyze this chart based on SMC principles. Give me the directional bias, key liquidity levels, and an actionable trade plan.`
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Data
                }
              }
            ]
          }
        ],
        temperature: 0.5,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Groq Vision API Error]:", errorText);
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.choices[0].message.content;

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
