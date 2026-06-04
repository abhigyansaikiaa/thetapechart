"use client";

import { useState } from "react";
import { ArrowRight, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Subscribed successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Mail className="absolute left-4 text-foreground-muted w-4 h-4" />
        <input 
          type="email" 
          placeholder="Subscribe to institutional research..." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          required
          className="w-full bg-[#111113] border border-border rounded-full pl-11 pr-32 py-3 text-sm text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={status === "loading" || status === "success" || !email}
          className="absolute right-1.5 top-1.5 bottom-1.5 bg-white text-black px-4 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : status === "success" ? (
            <>Done <CheckCircle2 size={14} className="text-positive" /></>
          ) : (
            <>Join <ArrowRight size={14} /></>
          )}
        </button>
      </form>
      {message && (
        <div className={`mt-2 text-xs flex items-center gap-1 font-mono pl-4 ${status === "success" ? "text-positive" : "text-negative"}`}>
          {status === "success" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          {message}
        </div>
      )}
    </div>
  );
}
