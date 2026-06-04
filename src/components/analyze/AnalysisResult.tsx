"use client";

import { motion } from "framer-motion";
import { ChartAnalysis } from "@/types/analysis";
import { AlertCircle, Target, TrendingUp, BarChart, Crosshair } from "lucide-react";

interface AnalysisResultProps {
  analysis: any;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  if (!analysis) return null;

  // Handle raw text response from Claude
  if (analysis.rawText) {
    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full mt-8"
      >
        <div className="glass-card p-8 border-t-4 border-t-accent">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-accent" size={24} />
            <h3 className="text-lg font-medium text-white uppercase tracking-wider">Claude Vision Analysis</h3>
          </div>
          <div className="prose prose-invert max-w-none text-foreground-secondary prose-p:leading-relaxed prose-li:leading-relaxed">
            {analysis.rawText.split('\n').map((line: string, i: number) => {
              if (line.startsWith('###')) return <h4 key={i} className="text-white font-bold mt-6 mb-2">{line.replace('###', '')}</h4>;
              if (line.startsWith('**')) return <p key={i} className="text-white font-semibold mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
              if (line.startsWith('-')) return <li key={i} className="ml-4 list-disc">{line.substring(1)}</li>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  const { aiResponse } = analysis;
  const isBullish = aiResponse?.bias === "Bullish";
  const isBearish = aiResponse?.bias === "Bearish";

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
    >
      {/* Primary Overview Column */}
      <motion.div variants={item} className="md:col-span-1 space-y-6">
        
        {/* Bias Card */}
        <div className="glass-card p-6 border-t-4 border-t-accent">
          <h3 className="text-sm font-medium text-foreground-secondary mb-4 uppercase tracking-wider">Directional Bias</h3>
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-3xl font-bold ${isBullish ? "text-positive" : isBearish ? "text-negative" : "text-warning"}`}>
              {aiResponse.bias}
            </span>
            <span className="text-sm font-medium px-2 py-1 bg-surface-elevated rounded text-foreground-muted">
              {aiResponse.confidence}% Conviction
            </span>
          </div>
        </div>

        {/* Trade Setup Card */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium text-foreground-secondary mb-4 uppercase tracking-wider flex items-center gap-2">
            <Crosshair size={16} /> Key Levels
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-foreground-muted mb-1">Entry Zone</p>
              <p className="font-numeric font-medium text-white">{aiResponse.entryZone}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
              <div>
                <p className="text-xs text-foreground-muted mb-1">Stop Loss</p>
                <p className="font-numeric font-medium text-negative">{aiResponse.stopLoss}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted mb-1">Risk:Reward</p>
                <p className="font-numeric font-medium text-accent">{aiResponse.riskReward}</p>
              </div>
            </div>
            <div className="border-t border-border/50 pt-4">
              <p className="text-xs text-foreground-muted mb-2">Take Profit Targets</p>
              <div className="flex flex-wrap gap-2">
                {aiResponse.takeProfit.map((tp: string | number, idx: number) => (
                  <span key={idx} className="text-xs font-numeric bg-positive/10 text-positive px-2 py-1 rounded">
                    TP{idx + 1}: {tp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Details Column */}
      <motion.div variants={item} className="md:col-span-2 space-y-6">
        
        {/* Narrative */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Target size={120} />
          </div>
          <h3 className="text-sm font-medium text-foreground-secondary mb-4 uppercase tracking-wider relative z-10">
            Institutional Narrative
          </h3>
          <p className="text-white leading-relaxed relative z-10">
            {aiResponse.narrative}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* SMC Analysis */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-foreground-secondary mb-4 uppercase tracking-wider">
              Smart Money Concepts
            </h3>
            <ul className="space-y-3">
              {Object.entries(aiResponse.smc).map(([key, val]) => (
                <li key={key} className="flex flex-col">
                  <span className="text-xs text-foreground-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm text-white font-medium">{String(val)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ICT Analysis */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-foreground-secondary mb-4 uppercase tracking-wider">
              ICT Concepts
            </h3>
            <ul className="space-y-3">
              {Object.entries(aiResponse.ict).map(([key, val]) => (
                <li key={key} className="flex flex-col">
                  <span className="text-xs text-foreground-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm text-white font-medium">{String(val)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Execution Plan */}
        <div className="glass-card p-6 bg-surface-elevated/50">
          <h3 className="text-sm font-medium text-foreground-secondary mb-4 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle size={16} className="text-accent" /> Execution Plan
          </h3>
          <div className="space-y-3">
            {aiResponse.executionPlan.map((step: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-white leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
