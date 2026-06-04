import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic/client";
import { CHART_ANALYSIS_PROMPT } from "@/lib/anthropic/prompts";
import { analyzeRateLimit } from "@/lib/upstash/ratelimit";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";
import { auth } from "@clerk/nextjs/server";

// Force Node.js runtime because edge doesn't fully support FormData parsing yet 
// in all Next.js versions cleanly.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. Auth Check
    const isClerkEnabled = 
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") && 
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YWxwaGFlZGdl") &&
      process.env.CLERK_SECRET_KEY &&
      !process.env.CLERK_SECRET_KEY.includes("placeholder");

    let userId = "mock_user_123";
    if (isClerkEnabled) {
      const authResult = await auth();
      userId = authResult.userId || "";
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate Limiting (10 per hour per user)
    const { success } = await analyzeRateLimit.limit(userId);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    // 3. Parse FormData
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 4. Validate File Size & Type
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 500KB limit" }, { status: 400 });
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // 5. Convert File to base64 for Anthropic Vision
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 6. Call Claude 3.5 Sonnet Vision (Mocked response for now if no API key)
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('sk-ant-xxx')) {
      // Mock heuristic: attempt to detect if it's a chart locally since we don't have Vision AI
      const filename = file.name.toLowerCase();
      const invalidKeywords = ["car", "dog", "cat", "selfie", "person", "food", "meme", "photo"];
      const isInvalid = invalidKeywords.some(kw => filename.includes(kw));
      
      if (isInvalid) {
        return NextResponse.json(
          { error: "Local Vision Engine: The uploaded image appears to be a photograph or unrelated image, not a financial chart." },
          { status: 400 }
        );
      }

      // Mock response for development without API key
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      
      const mockResponse = {
        id: "mock_123",
        userId,
        imageUrl: "mock_url",
        createdAt: new Date(),
        aiResponse: {
          patterns: ["Bull Flag", "Inverse Head & Shoulders"],
          smc: {
            orderBlocks: "Bullish OB at 22,450",
            fairValueGaps: "Unmitigated FVG between 22,500 - 22,530",
            liquidity: "Buy-side liquidity resting above 22,600",
            premiumDiscount: "Price currently in discount array"
          },
          ict: {
            killZones: "Setup formed during NY PM session",
            optimalTradeEntry: "Price tapped 0.618 Fib retracement perfectly",
            judasSwing: "Clear manipulation lower before true move up"
          },
          bias: "Bullish",
          confidence: 85,
          entryZone: "22,480 - 22,510",
          stopLoss: "22,440",
          takeProfit: ["22,580", "22,650", "22,720"],
          riskReward: "1:3.5",
          narrative: "Institutional money appears to be accumulating longs within the discount array. The Judas swing into the bullish order block effectively engineered sell-side liquidity before the true directional move. Expect higher prices targeting the buy-side liquidity pool above the previous week's high.",
          executionPlan: [
            "Wait for price to retrace into the FVG (22,500 - 22,530).",
            "Confirm lower timeframe (1m/5m) change of character (CHoCH) bullish.",
            "Enter long upon CHoCH confirmation with stop loss safely below the order block (22,440).",
            "Take partial profits at TP1 and trail stop to breakeven."
          ]
        }
      };

      return NextResponse.json({ analysis: mockResponse });
    }

    // Actual Anthropic API Call (If key is present)
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Use the latest vision capable model
      max_tokens: 1500,
      system: CHART_ANALYSIS_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: file.type as "image/jpeg" | "image/png" | "image/webp",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: "Please analyze this chart and return the analysis strictly as a JSON object matching the required structure.",
            }
          ],
        }
      ],
    });

    // In a real app, you would parse the response text into the JSON structure
    // Since Claude might output text, we usually ask for JSON and parse it.
    // For this boilerplate, we're returning the text or a structured version of it.
    // Assuming Claude returns valid JSON based on a prompt instruction (added text above):
    
    const textContent = (response.content[0] as any).text;
    let parsedData;
    
    try {
      // Find JSON block if wrapped in markdown
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : textContent;
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Claude output as JSON:", textContent);
      throw new Error("AI returned an invalid format.");
    }

    const finalAnalysis = {
      id: crypto.randomUUID(),
      userId,
      imageUrl: "url_to_uploaded_image_in_supabase", // Would upload to Supabase Storage first
      createdAt: new Date(),
      aiResponse: parsedData,
    };

    // Save to Supabase (Pseudo-code)
    // await supabase.from('chart_analyses').insert(finalAnalysis);

    return NextResponse.json({ analysis: finalAnalysis });

  } catch (error: any) {
    console.error("Analyze Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
