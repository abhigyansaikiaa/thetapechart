"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { IndexSymbol, LiveIndexData, generateSparkline } from "@/lib/dashboardData";
import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface IndexCardProps {
  sym: IndexSymbol;
  data?: LiveIndexData;
  delay?: number;
}

export function IndexCard({ sym, data, delay = 0 }: IndexCardProps) {
  const pct = data?.changePercent ?? 0;
  const isPositive = pct >= 0;
  const clr = isPositive ? "#10B981" : "#EF4444"; // positive / negative colors

  const spark = useMemo(() => {
    return generateSparkline(data?.price || 10000);
  }, [data?.price]);

  return (
    <Link href={`/chart?symbol=${sym.symbol}`}>
      <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 100 }}
      className="card p-3.5 group cursor-pointer relative overflow-hidden"
    >
      {/* Subtle background glow on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${clr}15 0%, transparent 70%)`
        }}
      />

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <div className="text-[10px] text-foreground-muted mb-1 font-semibold tracking-wider uppercase">
            {sym.name}
          </div>
          <div className="text-xl font-extrabold text-foreground font-numeric tracking-tighter">
            {data?.price ? (
              data.price.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
            ) : (
              <span className="inline-block w-20 h-6 rounded bg-surface-elevated shimmer" />
            )}
          </div>
        </div>
        
        <span
          className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] font-bold ${
            isPositive ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
          }`}
          style={{
            boxShadow: `0 0 10px ${isPositive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
          }}
        >
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {data ? Math.abs(pct).toFixed(2) + "%" : "—"}
        </span>
      </div>

      <div className="flex justify-between items-center relative z-10">
        <span
          className={`text-[11px] font-semibold font-numeric ${
            isPositive ? "text-positive" : "text-negative"
          }`}
        >
          {data?.change != null
            ? (isPositive ? "+" : "") + data.change.toFixed(2)
            : "—"}
        </span>
        
        {data && (
          <div className="h-9 w-24 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient
                    id={`gradient-${sym.symbol.replace(/[^a-z0-9]/gi, "")}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={clr} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={clr} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={clr}
                  fill={`url(#gradient-${sym.symbol.replace(/[^a-z0-9]/gi, "")})`}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      </motion.div>
    </Link>
  );
}
