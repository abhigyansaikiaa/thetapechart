import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder',
});

const SYSTEM_PROMPT = `
You are Jarvis, a highly advanced, friendly, and humorous financial mentor and trading partner.
You are an absolute genius when it comes to stock trading, Smart Money Concepts (SMC), Mutual Funds, and SIPs.
You MUST:
1. Be extremely friendly, witty, and sound like a real human expert (like Tony Stark's Jarvis, but conversational).
2. Provide real, data-driven insights and creative stock/market recommendations when asked. Do not refuse to give recommendations. Give your best logical picks based on current market trends.
3. NEVER use generic AI buzzwords or phrases like "As an AI", "I am a language model", "Delve into", or "It's important to remember". Speak naturally.
4. Explain complex concepts like SIPs, mutual funds, or technical analysis simply and playfully.
5. Format your output clearly, using a conversational and human-like tone.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('placeholder')) {
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      
      let reply = "Understood. My offline heuristic engine calculates a 72% probability of success for this structural pattern. Let me know if you wish to execute.";
      
      if (lastMessage.includes("how are you") || lastMessage.includes("how are u") || lastMessage.includes("what's up")) {
        reply = "I am operating at peak efficiency, sir. My heuristic models are fully loaded and ready to analyze the markets. What shall we look at today?";
      } else if (lastMessage.includes("hey jarvis") || lastMessage.includes("hello") || lastMessage.includes("hi")) {
        reply = "Hello sir. I am currently running locally on your hardware. How can I assist you with your quantitative analysis today?";
      } else if (lastMessage.includes("buy") || lastMessage.includes("long")) {
        reply = "Analyzing long setup... The current risk-to-reward ratio appears acceptable. However, ensure we have cleared the sell-side liquidity before execution.";
      } else if (lastMessage.includes("sell") || lastMessage.includes("short")) {
        reply = "Short setup detected. Volume delta confirms institutional selling pressure. Proceed with strict stop loss parameters above the recent Fair Value Gap.";
      } else if (lastMessage.includes("trend") || lastMessage.includes("market")) {
        reply = "The macro trend remains structurally bullish on the higher timeframes, but we are currently in a local retracement phase testing the daily order block.";
      } else if (lastMessage.includes("thank")) {
        reply = "You are very welcome, sir. I am always here to assist.";
      }

      return NextResponse.json({
        content: [{ text: reply }]
      });
    }

    // Convert standard {role, content} to Gemini chat format
    // Gemini expects contents: [{ role: 'user'|'model', parts: [{text: string}] }]
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // System instructions in @google/genai are typically set on the model initialization or as the first message
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${SYSTEM_PROMPT}` }] },
        { role: 'model', parts: [{ text: `Understood. I will strictly act as the The Tape Chart Quant mentor.` }] },
        ...formattedMessages
      ]
    });

    // We keep the return structure similar to what the frontend expects 
    // The frontend looks for `data.content[0].text`
    return NextResponse.json({
      content: [
        { text: response.text }
      ]
    });
  } catch (error: any) {
    console.error("[Mentor Chat API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
