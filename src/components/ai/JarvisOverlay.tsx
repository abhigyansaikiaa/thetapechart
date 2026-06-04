"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function JarvisOverlay() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isManuallyStoppedRef = useRef(false);
  const isProcessingRef = useRef(false);
  const clearTimerRef = useRef<any>(null);

  const clearText = () => {
    setTranscript("");
    setResponse("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = async (event: any) => {
          if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
          const text = event.results[0][0].transcript;
          setTranscript(text);
          isProcessingRef.current = true;
          await handleJarvisQuery(text);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setTranscript("Microphone error: " + event.error);
          clearTimerRef.current = setTimeout(clearText, 3000);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          // If recognition ended and Jarvis is NOT processing a query, it means it timed out.
          // Start auto-clear timer.
          if (!isProcessingRef.current && !isManuallyStoppedRef.current) {
            clearTimerRef.current = setTimeout(clearText, 4000);
          }
        };
      } else {
        console.warn("Speech recognition is not supported in this browser.");
      }
    }
  }, []);

  const handleJarvisQuery = async (query: string) => {
    try {
      setIsSpeaking(true);
      isManuallyStoppedRef.current = false;
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      
      // Send to existing Gemini Mentor route
      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `You are Jarvis. Keep your response to a STRICT MAXIMUM of 1 or 2 short sentences. Be extremely brief, friendly, sound like a natural human, avoid AI buzzwords, and give creative stock recommendations. The user says: ${query}` }]
        })
      });

      const data = await res.json();
      const textResponse = data.content?.[0]?.text || data.response || "I could not process that.";
      
      if (isManuallyStoppedRef.current) return; // Abort if stopped while fetching
      
      setResponse(textResponse);

      // Speak response
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(textResponse);
        utterance.pitch = 0.9;
        utterance.rate = 1.05;
        
        // Try to find a male/British voice for Jarvis
        const voices = synthRef.current.getVoices();
        const jarvisVoice = voices.find(v => v.name.includes("Google UK English Male") || v.lang === "en-GB");
        if (jarvisVoice) utterance.voice = jarvisVoice;

        utterance.onend = () => {
          setIsSpeaking(false);
          isProcessingRef.current = false;
          // Only auto-resume if not manually stopped
          if (recognitionRef.current && !isManuallyStoppedRef.current) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch(e) {
              // Ignore if already started
            }
          }
          
          if (isManuallyStoppedRef.current) {
             clearText();
          } else {
             // Start auto-clear timer in case user doesn't say anything next
             clearTimerRef.current = setTimeout(clearText, 6000);
          }
        };
        synthRef.current.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
      isProcessingRef.current = false;
      clearTimerRef.current = setTimeout(clearText, 3000);
    }
  };

  const toggleListening = async () => {
    if (isListening || isSpeaking) {
      isManuallyStoppedRef.current = true;
      recognitionRef.current?.stop();
      if (synthRef.current?.speaking) synthRef.current.cancel();
      
      setIsListening(false);
      setIsSpeaking(false);
      
      // Clear text box
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      setTimeout(clearText, 300);
      return;
    } else {
      isManuallyStoppedRef.current = false;
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      clearText();
      
      if (!recognitionRef.current) {
        setTranscript("Browser does not support Speech Recognition. Try Chrome or Edge.");
        setTimeout(() => setTranscript(""), 3000);
        return;
      }

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e: any) {
        console.error("Failed to start mic:", e);
        if (e.name === "NotFoundError" || e.message.includes("Requested device not found")) {
          setTranscript("No microphone detected! Please plug in a microphone.");
        } else {
          setTranscript("Mic Blocked (OS Level). Ensure microphone is ON in Windows Settings.");
        }
        setTimeout(() => setTranscript(""), 3000);
        setIsListening(false);
      }
    }
  };

    <motion.div 
      drag 
      dragMomentum={false}
      style={{ touchAction: "none" }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-auto cursor-move"
    >
      
      <AnimatePresence>
        {(transcript || response) && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-black/80 backdrop-blur-xl border border-[#3B82F6]/30 p-4 rounded-2xl max-w-sm shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            {transcript && (
              <div className="mb-3">
                <span className="text-xs text-[#3B82F6] font-bold tracking-widest uppercase mb-1 block">You</span>
                <p className="text-sm text-foreground-secondary italic">"{transcript}"</p>
              </div>
            )}
            {response && (
              <div>
                <span className="text-xs text-accent font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                  <BrainCircuit size={12} /> Jarvis
                </span>
                <p className="text-sm text-white leading-relaxed">{response}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleListening}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300 ${
          isListening 
            ? "bg-[#EF4444]/10 border-[#EF4444] shadow-[0_0_40px_rgba(239,68,68,0.4)]" 
            : isSpeaking
              ? "bg-[#3B82F6]/10 border-[#3B82F6] shadow-[0_0_40px_rgba(59,130,246,0.4)]"
              : "bg-[#111113]/80 border-border backdrop-blur hover:border-accent/50"
        }`}
        animate={isSpeaking ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 20px rgba(59,130,246,0.2)",
            "0 0 60px rgba(59,130,246,0.6)",
            "0 0 20px rgba(59,130,246,0.2)"
          ]
        } : {}}
        transition={{ repeat: isSpeaking ? Infinity : 0, duration: 1.5 }}
      >
        {/* Inner Arc Core Effect */}
        <div className={`absolute inset-1 rounded-full border border-t-transparent ${isSpeaking ? 'border-[#3B82F6] animate-spin' : 'border-border'}`} style={{ animationDuration: '3s' }} />
        <div className={`absolute inset-2 rounded-full border border-b-transparent ${isSpeaking ? 'border-[#8B5CF6] animate-spin' : 'border-border'}`} style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        
        {isListening ? (
          <Mic className="text-[#EF4444] w-6 h-6" />
        ) : isSpeaking ? (
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] animate-pulse" />
        ) : (
          <MicOff className="text-foreground-muted w-6 h-6" />
        )}
      </motion.button>

    </motion.div>
  );
}
