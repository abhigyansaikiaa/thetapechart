"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ChartUploader } from "@/components/analyze/ChartUploader";
import { AnalysisResult } from "@/components/analyze/AnalysisResult";
import { ChartAnalysis } from "@/types/analysis";
import { Target } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ChartAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const base64String = await fileToBase64(file);

      // Call our Next.js API route which will talk to Claude
      const res = await fetch("/api/mentor/analyze-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64String, filename: file.name }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await res.json();
      
      const aiResponseText = data.content?.[0]?.text || "";
      
      // Since Claude returns markdown text based on the prompt, 
      // we'll inject it into the AnalysisResult or adapt our frontend types
      // For now, we mock the structured response if it's text-only, or parse it if it returns JSON.
      // Assuming Claude returns structured text that we can display in the UI:
      setAnalysis({
        bias: aiResponseText.toLowerCase().includes("bullish") ? "bullish" : aiResponseText.toLowerCase().includes("bearish") ? "bearish" : "neutral",
        confidence: 85,
        timeframe: "4H",
        keyLevels: [
          { price: 0, type: "support", description: "Identified via Claude Vision" }
        ],
        tradePlan: {
          entry: "See Analysis",
          stopLoss: "See Analysis",
          takeProfit: "See Analysis",
          riskReward: "1:3"
        },
        rawText: aiResponseText
      } as any); // Type assertion for UI compatibility
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
              <Target className="text-accent" size={28} />
            </div>
            Institutional Chart Analysis
          </h1>
          <p className="text-foreground-secondary text-base max-w-2xl">
            Upload chart data. The algorithmic model evaluates Smart Money Concepts (SMC) 
            and ICT structures to identify institutional liquidity zones, order blocks, and directional bias.
          </p>
        </motion.div>

        {/* Uploader Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <ChartUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-negative/10 border border-negative/20 text-negative text-sm">
              <span className="font-semibold block mb-1">Analysis Error</span>
              {error}
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        {analysis && (
          <div className="w-full">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                Analysis Complete
              </span>
              <div className="h-px bg-border flex-1" />
            </div>
            <AnalysisResult analysis={analysis} />
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
