"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Clock, ShieldAlert } from "lucide-react";
import { TradeSuggestion } from "@/lib/dashboardData";
import { motion, AnimatePresence } from "framer-motion";

interface TradeSuggestionCardProps {
  suggestion: TradeSuggestion;
  index: number;
}

export function TradeSuggestionCard({ suggestion: s, index }: TradeSuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = s.direction === "Long";
  const dirColor = isLong ? "#10B981" : "#EF4444";
  
  const confColor =
    s.confidence >= 80
      ? "#10B981" // Green
      : s.confidence >= 65
      ? "#F59E0B" // Amber
      : "#EF4444"; // Red

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card overflow-hidden group"
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-3.5 cursor-pointer hover:bg-surface-hover/50 transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300"
              style={{
                backgroundColor: `${dirColor}15`,
                borderColor: `${dirColor}30`,
                boxShadow: expanded ? `0 0 15px ${dirColor}20` : 'none'
              }}
            >
              {isLong ? (
                <TrendingUp size={18} color={dirColor} />
              ) : (
                <TrendingDown size={18} color={dirColor} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-extrabold text-white tracking-wide">
                  {s.symbol}
                </span>
                <span className="text-[9px] text-foreground-muted bg-surface-elevated px-1.5 py-0.5 rounded border border-border">
                  {s.instrument}
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                  style={{ color: dirColor, backgroundColor: `${dirColor}15` }}
                >
                  {s.direction}
                </span>
              </div>
              <div className="text-[11px] text-foreground-secondary font-medium">
                {s.strategy} · {s.setup}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div
              className="text-lg font-extrabold font-numeric drop-shadow-md"
              style={{ color: confColor }}
            >
              {s.confidence}%
            </div>
            <div className="text-[9px] text-foreground-muted font-bold tracking-widest uppercase">
              Confidence
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: "ENTRY", value: s.entry, color: "#3B82F6" },
            { label: "SL", value: s.stop_loss, color: "#EF4444" },
            { label: "TP1", value: s.target1, color: "#10B981" },
            { label: "R:R", value: `1:${s.rr_ratio}`, color: "#F59E0B" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-background rounded-lg py-1.5 px-2 text-center border border-border/40 group-hover:border-border/80 transition-colors"
            >
              <div className="text-[9px] text-foreground-muted font-bold mb-0.5 tracking-widest">
                {item.label}
              </div>
              <div
                className="text-[11px] font-bold font-numeric"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3.5 border-t border-border/50 bg-background/50">
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
                  <Clock size={10} /> {s.timeframe}
                </span>
                {s.validity && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 font-medium">
                    Valid: {s.validity}
                  </span>
                )}
                {s.key_level && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                    <ShieldAlert size={10} /> Key: {s.key_level}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-foreground-secondary leading-relaxed m-0">
                {s.rationale}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
