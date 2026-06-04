"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Brain, User, Lightbulb, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import useUser from "@/utils/useUser";

const SYSTEM_CONTENT = `You are AlphaEdge AI Mentor — an elite institutional trading coach with 25 years of experience managing multi-billion dollar portfolios and training professional traders.

Your personality: Direct, precise, deeply knowledgeable. You teach, not just answer. You always add what most traders miss. You reference real Indian market dynamics (NSE/BSE, F&O, NIFTY, BANKNIFTY). Expert in SMC, ICT, Wyckoff, Elliott Wave, Price Action, Options, Macro.

Your style: (1) Answer directly, (2) Explain the deeper concept, (3) Give an Indian market example, (4) Add what retail traders get wrong, (5) Suggest next thing to study. Keep responses under 350 words.`;

const SUGGESTED_QUESTIONS = [
  "Explain order blocks in SMC — what most traders miss",
  "What is the Optimal Trade Entry (OTE) in ICT methodology?",
  "How do I calculate position size for a NIFTY futures trade?",
  "What does BOS vs ChoCH mean and when does it matter?",
  "Explain Power of 3 and how to use it on index charts",
  "How do FII flows affect BANKNIFTY movements?",
  "When should I avoid trading — key times to stay out?",
  "What is the Wyckoff Spring and how do I identify it?",
];

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <Brain size={15} color="#fff" />
        </div>
      )}
      <div
        style={{
          maxWidth: "78%",
          backgroundColor: isUser ? "#3B82F6" : "#1a1a1c",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          fontSize: 14,
          lineHeight: 1.65,
          border: isUser ? "none" : "1px solid #27272A",
          whiteSpace: "pre-wrap",
        }}
      >
        {msg.content}
      </div>
      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: "#27272A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <User size={15} color="#A1A1AA" />
        </div>
      )}
    </div>
  );
}

export default function MentorPage() {
  const { data: user } = useUser();
  const userId = user?.id || "demo-user";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome. I'm your AlphaEdge AI Mentor — built with institutional-grade trading knowledge and 25 years of market experience.\n\nAsk me anything about Smart Money Concepts, ICT methodology, position sizing, trade psychology, or any aspect of your trading. I'll teach you what the textbooks leave out.\n\nWhat's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;
      const userMsg = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        // Build history for context
        const history = [...messages.slice(-9), userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Call Claude directly from the frontend
        const res = await fetch("/integrations/anthropic-claude-sonnet-4/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "system", content: SYSTEM_CONTENT }, ...history],
          }),
        });

        if (!res.ok) throw new Error(`AI error: ${res.status}`);
        const data = await res.json();
        const reply =
          data.choices?.[0]?.message?.content ||
          "I encountered an issue. Please try again.";

        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

        // Save to backend (fire-and-forget)
        fetch("/api/mentor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, message: text, reply }),
        }).catch((e) => console.error("Save error:", e));
      } catch (err) {
        console.error("Mentor error:", err);
        toast.error("Failed to get response. Please try again.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I had trouble connecting. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, userId],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #27272A",
          backgroundColor: "#0A0A0B",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(139,92,246,0.25)",
              }}
            >
              <Brain size={20} color="#fff" />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                AI Trading Mentor
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                  }}
                />
                <span style={{ fontSize: 12, color: "#10B981" }}>
                  Online · Claude claude-sonnet-4-20250514
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  role: "assistant",
                  content:
                    "New conversation. What trading challenge are you working through today?",
                },
              ])
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#111113",
              border: "1px solid #27272A",
              color: "#A1A1AA",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={13} /> New Chat
          </button>
        </div>
      </div>

      {messages.length <= 1 && (
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #27272A",
            backgroundColor: "#0A0A0B",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#6B7280",
              marginBottom: 10,
              fontWeight: 600,
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Lightbulb size={11} /> SUGGESTED TOPICS
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  fontSize: 12,
                  padding: "6px 12px",
                  borderRadius: 20,
                  backgroundColor: "#111113",
                  border: "1px solid #27272A",
                  color: "#A1A1AA",
                  cursor: "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {isLoading && (
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Brain size={15} color="#fff" />
            </div>
            <div
              style={{
                backgroundColor: "#1a1a1c",
                border: "1px solid #27272A",
                padding: "12px 16px",
                borderRadius: "16px 16px 16px 4px",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              {[0, 0.2, 0.4].map((d) => (
                <div
                  key={d}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#6B7280",
                    animation: `pulse-ring 1.2s ease-in-out ${d}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid #27272A",
          backgroundColor: "#0A0A0B",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about trading, SMC, ICT, options, risk management..."
            rows={1}
            style={{
              flex: 1,
              backgroundColor: "#111113",
              border: "1px solid #27272A",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: 12,
              fontSize: 14,
              outline: "none",
              resize: "none",
              lineHeight: 1.5,
              maxHeight: 120,
              fontFamily: "Inter, sans-serif",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              backgroundColor: "#3B82F6",
              border: "none",
              color: "#fff",
              width: 44,
              height: 44,
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: !input.trim() || isLoading ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            <Send size={18} />
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#3f3f46",
            marginTop: 10,
          }}
        >
          For educational purposes only. Not financial advice.
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
