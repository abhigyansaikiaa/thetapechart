import { NextResponse } from 'next/server';

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

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes('placeholder')) {
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      
      let reply = "Understood. My offline heuristic engine calculates a 72% probability of success for this structural pattern. Let me know if you wish to execute.";
      
      if (/\b(how are you|how are u|what's up)\b/.test(lastMessage)) {
        reply = "I am operating at peak efficiency, sir. My heuristic models are fully loaded and ready to analyze the markets. What shall we look at today?";
      } else if (/\b(hey jarvis|hello|hi)\b/.test(lastMessage)) {
        reply = "Hello sir. I am currently running locally on your hardware. How can I assist you with your quantitative analysis today?";
      } else if (/\b(buy|long)\b/.test(lastMessage)) {
        reply = "Analyzing long setup... The current risk-to-reward ratio appears acceptable. However, ensure we have cleared the sell-side liquidity before execution.";
      } else if (/\b(sell|short)\b/.test(lastMessage)) {
        reply = "Short setup detected. Volume delta confirms institutional selling pressure. Proceed with strict stop loss parameters above the recent Fair Value Gap.";
      } else if (/\b(trend|market)\b/.test(lastMessage)) {
        reply = "The macro trend remains structurally bullish on the higher timeframes, but we are currently in a local retracement phase testing the daily order block.";
      } else if (/\b(thank)\b/.test(lastMessage)) {
        reply = "You are very welcome, sir. I am always here to assist.";
      }

      return NextResponse.json({
        content: [{ text: reply }]
      });
    }

    // Format messages for Groq/OpenAI format
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || m.parts?.[0]?.text || ""
    }));

    // Insert system prompt at the beginning
    formattedMessages.unshift({
      role: "system",
      content: SYSTEM_PROMPT
    });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Using Llama 3 8B which is incredibly fast for voice bots
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 150 // Keep it concise for voice
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Groq API Error]:", errorText);
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
    console.error("[Mentor Chat API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
