"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MessageSquare, Send, Sparkles, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello. I am your The Tape Chart Institutional Mentor. I'm equipped with deep knowledge of Smart Money Concepts, ICT, macroeconomics, and quantitative analysis. What aspect of the market are we analyzing today?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await response.json();
      
      const aiContent = data.content?.[0]?.text || data.error || "I am currently unable to process this request. Check API Keys.";
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "System error: Unable to reach Anthropic endpoints."
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <PageWrapper>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto"
      >
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
            <MessageSquare className="text-accent" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Quantitative Co-Pilot
              <span className="bg-surface-elevated border border-border text-foreground-secondary text-xs ml-2 font-medium tracking-normal flex items-center gap-1 px-2 py-0.5 rounded-full shadow-sm">
                <Sparkles size={12} className="text-accent" /> Institutional LLM Core
              </span>
            </h1>
            <p className="text-foreground-secondary text-sm">Direct access to algorithmic market insights, risk modeling, and structural analysis.</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 glass-card flex flex-col overflow-hidden relative backdrop-blur-md border border-white/5 bg-surface/40 shadow-xl">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-surface-elevated border border-border' : 'bg-accent text-white shadow-lg shadow-accent/20'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-surface-elevated border border-border text-white rounded-tr-none' 
                    : 'bg-accent/10 border border-accent/20 text-white rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 rounded-tl-none flex gap-1 items-center">
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-surface/80 backdrop-blur-md border-t border-border">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about SMC, macros, or risk management..." 
                className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:hover:bg-accent text-white rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex gap-2 mt-3 justify-center">
              {["Explain Order Blocks", "What is an FVG?", "Analyze BankNifty", "Risk Management Rules"].map(suggestion => (
                <button 
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="text-xs px-3 py-1.5 bg-surface-elevated hover:bg-surface-hover border border-border rounded-full text-foreground-secondary hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

      </motion.div>
    </PageWrapper>
  );
}
