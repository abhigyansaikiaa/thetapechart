"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function JarvisOverlay() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isManuallyStoppedRef = useRef(false);
  const isProcessingRef = useRef(false);
  const clearTimerRef = useRef<any>(null);

  const clearText = () => {
    setTranscript("");
    setResponse("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
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
      
      // Send to existing Gemini Mentor route, passing along history
      const messagesToSend = [
        ...chatHistory,
        { role: "user", content: `You are Jarvis, the Tape Chart bot. Keep your response to a STRICT MAXIMUM of 1 or 2 short sentences. Be extremely brief, friendly, sound like a natural human, avoid AI buzzwords, and only answer questions related to trading, finance, and stock markets. If the user asks something unrelated, playfully remind them you only talk about trading. The user says: ${query}` }
      ];

      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToSend })
      });

      const data = await res.json();
      const textResponse = data.content?.[0]?.text || data.response || "I could not process that.";
      
      if (isManuallyStoppedRef.current) return; // Abort if stopped while fetching
      
      setResponse(textResponse);
      setChatHistory(prev => [...prev, { role: "user", content: query }, { role: "assistant", content: textResponse }]);

      // Speak response using ElevenLabs
      try {
        const ttsRes = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textResponse })
        });
        
        if (ttsRes.ok && !isManuallyStoppedRef.current) {
          const audioBlob = await ttsRes.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          
          audio.onended = () => {
            setIsSpeaking(false);
            isProcessingRef.current = false;
            if (recognitionRef.current && !isManuallyStoppedRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch(e) {}
            }
            if (isManuallyStoppedRef.current) {
               clearText();
            } else {
               clearTimerRef.current = setTimeout(clearText, 6000);
            }
          };
          
          await audio.play();
        } else {
          setIsSpeaking(false);
          isProcessingRef.current = false;
        }
      } catch (err) {
        console.error("TTS playback error:", err);
        setIsSpeaking(false);
        isProcessingRef.current = false;
      }
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
      isProcessingRef.current = false;
      clearTimerRef.current = setTimeout(clearText, 3000);
    }
  };

  const playGreeting = async () => {
    setIsSpeaking(true);
    const greeting = "Hi, I'm the Tape Chart bot. How can I help you with your trading?";
    setResponse(greeting);
    
    try {
      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: greeting })
      });
      
      if (ttsRes.ok && !isManuallyStoppedRef.current) {
        const audioBlob = await ttsRes.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          if (recognitionRef.current && !isManuallyStoppedRef.current) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch(e) {}
          }
        };
        
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      setIsSpeaking(false);
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      isManuallyStoppedRef.current = true;
      recognitionRef.current?.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      setIsListening(false);
      setIsSpeaking(false);
      
      // Clear text box
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      setTimeout(clearText, 300);
      return;
    } else if (isSpeaking && !isListening) {
      // INTERRUPT JARVIS: Cancel speech and immediately start listening
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      setResponse("Listening...");
      
      isManuallyStoppedRef.current = false;
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {}
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
        // Play greeting first, which will auto-start mic when done
        playGreeting();
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

  return (
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
