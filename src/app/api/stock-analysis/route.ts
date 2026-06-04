import { NextResponse } from "next/server";

const ANALYSIS_PROMPT = `
You are an elite institutional quant trader with deep expertise in Smart Money Concepts (SMC), Inner Circle Trader (ICT) methodology, and price action analysis.

Given a stock symbol and its current market data, provide a comprehensive trade analysis.

You MUST respond in valid JSON only, no markdown, no code fences. Use this exact structure:
{
  "verdict": "BUY" | "SELL" | "HOLD" | "AVOID",
  "confidence": 0-100,
  "entry": "price or range",
  "stop_loss": "price",
  "tp1": "price",
  "tp2": "price",
  "tp3": "price",
  "risk_reward": "1:X",
  "timeframe": "recommended timeframe",
  "strategy": "SMC/ICT strategy name",
  "rationale": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4"],
  "key_levels": {
    "resistance": ["level1", "level2"],
    "support": ["level1", "level2"],
    "order_blocks": ["description"],
    "fvg": ["description"]
  },
  "risk_warning": "brief risk warning",
  "market_context": "1-2 sentences about broader market"
}

Be creative but grounded. Give realistic prices based on the data provided. Never refuse to analyze — always give your best quantitative assessment.
`;

export async function POST(req: Request) {
  try {
    const { symbol, name, price, change, changePercent, dayHigh, dayLow, fiftyTwoWeekHigh, fiftyTwoWeekLow, volume, marketCap, pe, eps } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes("placeholder")) {
      // Return mock analysis
      const isBullish = (changePercent || 0) > 0;
      return NextResponse.json({
        verdict: isBullish ? "BUY" : "HOLD",
        confidence: Math.floor(Math.random() * 25) + 60,
        entry: price ? `${(price * 0.99).toFixed(2)}` : "N/A",
        stop_loss: price ? `${(price * 0.96).toFixed(2)}` : "N/A",
        tp1: price ? `${(price * 1.03).toFixed(2)}` : "N/A",
        tp2: price ? `${(price * 1.06).toFixed(2)}` : "N/A",
        tp3: price ? `${(price * 1.10).toFixed(2)}` : "N/A",
        risk_reward: "1:3",
        timeframe: "4H / Daily",
        strategy: "SMC Order Block Retest",
        rationale: [
          "Running in offline mode — analysis is heuristic-based",
          "Price structure suggests potential continuation pattern",
          "Volume analysis indicates institutional participation",
          "Add your GROQ_API_KEY in .env.local for real AI analysis"
        ],
        key_levels: {
          resistance: [dayHigh?.toFixed(2) || "N/A", fiftyTwoWeekHigh?.toFixed(2) || "N/A"],
          support: [dayLow?.toFixed(2) || "N/A", fiftyTwoWeekLow?.toFixed(2) || "N/A"],
          order_blocks: ["Potential demand zone near day low"],
          fvg: ["Check 4H chart for Fair Value Gaps"]
        },
        risk_warning: "Offline mode — this is not real AI analysis. Add your API key for accurate results.",
        market_context: "Analysis generated from local heuristics. Connect Groq API for institutional-grade insights."
      });
    }

    const userPrompt = `
Analyze this asset for a potential trade:

Symbol: ${symbol}
Name: ${name || symbol}
Current Price: ${price || "Unknown"}
Day Change: ${change || 0} (${changePercent?.toFixed(2) || 0}%)
Day High: ${dayHigh || "N/A"}
Day Low: ${dayLow || "N/A"}
52-Week High: ${fiftyTwoWeekHigh || "N/A"}
52-Week Low: ${fiftyTwoWeekLow || "N/A"}
Volume: ${volume || "N/A"}
Market Cap: ${marketCap || "N/A"}
P/E Ratio: ${pe || "N/A"}
EPS: ${eps || "N/A"}

Provide your full trade analysis in the specified JSON format.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: ANALYSIS_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Groq Stock Analysis API Error]:", errorText);
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.choices[0].message.content || "{}";
    
    // Try to parse JSON from the response
    let jsonStr = rawText;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    jsonStr = jsonStr.trim();
    const analysis = JSON.parse(jsonStr);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("[Stock Analysis API Error]:", error);
    return NextResponse.json(
      { 
        error: error.message,
        verdict: "ERROR",
        confidence: 0,
        rationale: ["Analysis failed — " + error.message],
      },
      { status: 500 }
    );
  }
}
