"use client";

import { useState } from "react";
import { Brain, RefreshCw, TrendingUp, TrendingDown, Minus, AlertTriangle, Shield, Target, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StockData {
  symbol: string;
  name?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  dayHigh?: number;
  dayLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  volume?: number;
  marketCap?: number;
  pe?: number | null;
  eps?: number | null;
}

interface AnalysisResult {
  verdict: string;
  confidence: number;
  entry: string;
  stop_loss: string;
  tp1: string;
  tp2: string;
  tp3: string;
  risk_reward: string;
  timeframe: string;
  strategy: string;
  rationale: string[];
  key_levels: {
    resistance: string[];
    support: string[];
    order_blocks: string[];
    fvg: string[];
  };
  risk_warning: string;
  market_context: string;
}

export function StockAIAnalysis({ stockData }: { stockData: StockData }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stock-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockData),
      });
      const data = await res.json();
      if (data.error && data.verdict === "ERROR") {
        setError(data.error);
      } else {
        setAnalysis(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  const verdictConfig: Record<string, { color: string; icon: any; bg: string }> = {
    BUY: { color: "#10B981", icon: TrendingUp, bg: "rgba(16,185,129,0.1)" },
    SELL: { color: "#EF4444", icon: TrendingDown, bg: "rgba(239,68,68,0.1)" },
    HOLD: { color: "#F59E0B", icon: Minus, bg: "rgba(245,158,11,0.1)" },
    AVOID: { color: "#EF4444", icon: AlertTriangle, bg: "rgba(239,68,68,0.1)" },
  };

  const v = analysis ? verdictConfig[analysis.verdict] || verdictConfig.HOLD : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Analyze Button */}
      <button
        onClick={runAnalysis}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-accent to-purple-600 hover:from-accent-hover hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(139,92,246,0.3)] disabled:opacity-60 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Analyzing with AI...
          </>
        ) : (
          <>
            <Brain size={18} /> {analysis ? "Re-Analyze" : "AI Trade Analysis"}
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-negative/10 border border-negative/20 text-negative text-sm">
          {error}
        </div>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4"
          >
            {/* Verdict Card */}
            <div
              className="p-4 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: v?.bg, borderColor: `${v?.color}30` }}
            >
              <div className="flex items-center gap-3">
                {v && <v.icon size={28} color={v.color} />}
                <div>
                  <div className="text-2xl font-black" style={{ color: v?.color }}>
                    {analysis.verdict}
                  </div>
                  <div className="text-xs text-foreground-muted font-medium">
                    {analysis.strategy}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black font-numeric" style={{ color: v?.color }}>
                  {analysis.confidence}%
                </div>
                <div className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">
                  Confidence
                </div>
              </div>
            </div>

            {/* Trade Levels Grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "ENTRY", value: analysis.entry, color: "#3B82F6", icon: Target },
                { label: "STOP LOSS", value: analysis.stop_loss, color: "#EF4444", icon: Shield },
                { label: "TIMEFRAME", value: analysis.timeframe, color: "#8B5CF6", icon: Clock },
                { label: "TP1", value: analysis.tp1, color: "#10B981" },
                { label: "TP2", value: analysis.tp2, color: "#10B981" },
                { label: "TP3", value: analysis.tp3, color: "#10B981" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-surface-elevated rounded-lg p-3 text-center border border-border/40"
                >
                  <div className="text-[9px] text-foreground-muted font-bold tracking-widest mb-1">
                    {item.label}
                  </div>
                  <div className="text-sm font-bold font-numeric" style={{ color: item.color }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* R:R */}
            <div className="flex items-center justify-between bg-surface-elevated rounded-lg px-4 py-2 border border-border/40">
              <span className="text-xs text-foreground-muted font-bold tracking-widest">RISK : REWARD</span>
              <span className="text-lg font-black font-numeric text-accent">{analysis.risk_reward}</span>
            </div>

            {/* Rationale */}
            <div className="bg-surface-elevated rounded-xl p-4 border border-border/40">
              <h3 className="text-xs font-bold text-foreground-muted uppercase tracking-widest mb-3">Analysis Rationale</h3>
              <ul className="space-y-2">
                {analysis.rationale.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Levels */}
            {analysis.key_levels && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-elevated rounded-xl p-3 border border-border/40">
                  <h4 className="text-[10px] text-negative font-bold uppercase tracking-widest mb-2">Resistance</h4>
                  {analysis.key_levels.resistance.map((level, i) => (
                    <div key={i} className="text-sm font-numeric text-foreground-secondary py-0.5">{level}</div>
                  ))}
                </div>
                <div className="bg-surface-elevated rounded-xl p-3 border border-border/40">
                  <h4 className="text-[10px] text-positive font-bold uppercase tracking-widest mb-2">Support</h4>
                  {analysis.key_levels.support.map((level, i) => (
                    <div key={i} className="text-sm font-numeric text-foreground-secondary py-0.5">{level}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Market Context */}
            <div className="p-3 rounded-xl bg-accent/5 border border-accent/15 text-sm text-foreground-secondary leading-relaxed">
              {analysis.market_context}
            </div>

            {/* Risk Warning */}
            <div className="flex gap-2 p-3 rounded-xl bg-negative/5 border border-negative/15">
              <AlertTriangle size={14} className="text-negative flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground-muted leading-relaxed">{analysis.risk_warning}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
