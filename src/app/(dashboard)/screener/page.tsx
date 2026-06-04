"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Workflow, Calculator, ShieldCheck, Target, ArrowRight, AlertTriangle } from "lucide-react";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ScreenerPage() {
  const [capital, setCapital] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(150.00);
  const [stopLoss, setStopLoss] = useState<number>(145.00);
  
  // Calculations
  const riskAmount = (capital * riskPercent) / 100;
  const riskPerShare = Math.max(0.01, entryPrice - stopLoss); // Prevent div by 0
  
  // Only calculate if SL is below Entry (for long position)
  const isInvalidLong = stopLoss >= entryPrice;
  const sharesToBuy = isInvalidLong ? 0 : Math.floor(riskAmount / riskPerShare);
  
  const totalPositionSize = sharesToBuy * entryPrice;
  const leverageRequired = totalPositionSize > capital ? (totalPositionSize / capital).toFixed(2) + "x" : "None";
  
  const rr1Target = entryPrice + (riskPerShare * 1);
  const rr2Target = entryPrice + (riskPerShare * 2);
  const rr3Target = entryPrice + (riskPerShare * 3);

  return (
    <PageWrapper>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-5xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold font-mono text-warning uppercase tracking-widest bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                Live Screener Offline
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3 font-sans">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Workflow className="text-accent" size={28} />
              </div>
              Position Sizing Terminal
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl font-mono">
              While the live quantitative screener API is disconnected, use this institutional-grade risk management calculator to perfectly size your trades and eliminate emotional drawdowns.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Input Panel */}
          <motion.div variants={item} className="md:col-span-5 glass-card p-6 border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-10" />
            
            <h2 className="text-[12px] font-bold font-mono text-white uppercase tracking-widest flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
              <Calculator size={16} className="text-accent" /> Trade Parameters
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block">Total Trading Capital (₹)</label>
                <input 
                  type="number" 
                  value={capital} 
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-border rounded-md px-3 py-2.5 font-numeric text-sm text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block flex justify-between">
                  <span>Risk Per Trade (%)</span>
                  <span className="text-accent">{riskPercent}% (₹{riskAmount.toFixed(2)})</span>
                </label>
                <input 
                  type="range" 
                  min="0.1" max="5" step="0.1"
                  value={riskPercent} 
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full accent-accent h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block">Entry Price (₹)</label>
                  <input 
                    type="number" 
                    value={entryPrice} 
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-border rounded-md px-3 py-2.5 font-numeric text-sm text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block">Stop Loss (₹)</label>
                  <input 
                    type="number" 
                    value={stopLoss} 
                    onChange={(e) => setStopLoss(Number(e.target.value))}
                    className={`w-full bg-[#0A0A0B] border rounded-md px-3 py-2.5 font-numeric text-sm text-white focus:outline-none transition-colors ${isInvalidLong ? 'border-negative focus:border-negative' : 'border-border focus:border-accent'}`}
                  />
                </div>
              </div>
              
              {isInvalidLong && (
                <div className="p-3 bg-negative/10 border border-negative/20 rounded-md flex items-start gap-2">
                  <AlertTriangle size={14} className="text-negative mt-0.5 shrink-0" />
                  <p className="text-[10px] font-mono text-negative uppercase">Stop loss must be below entry price for long positions.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Output Dashboard */}
          <motion.div variants={item} className="md:col-span-7 flex flex-col gap-4">
            
            {/* Primary Action Card */}
            <div className="glass-card p-6 border border-accent/20 bg-accent/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
              <h3 className="text-xs font-mono text-foreground-secondary uppercase tracking-widest mb-2">Optimal Position Size</h3>
              <div className="text-5xl font-bold font-numeric text-white mb-2 flex items-baseline gap-2">
                {sharesToBuy} <span className="text-lg font-sans text-foreground-muted font-normal uppercase tracking-widest">Shares</span>
              </div>
              <p className="text-xs text-accent font-mono bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                Total Allocation: ₹{totalPositionSize.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5 border border-border/50">
                <ShieldCheck className="text-negative mb-3 opacity-80" size={20} />
                <h4 className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1">Max Loss (Risk)</h4>
                <p className="text-xl font-bold font-numeric text-white">₹{riskAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              
              <div className="glass-card p-5 border border-border/50">
                <Target className="text-warning mb-3 opacity-80" size={20} />
                <h4 className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1">Leverage Needed</h4>
                <p className="text-xl font-bold font-numeric text-white">{leverageRequired}</p>
              </div>
            </div>

            {/* Take Profit Matrix */}
            <div className="glass-card border border-border/50 overflow-hidden flex-1">
              <div className="bg-surface/50 border-b border-border/50 px-4 py-3 flex items-center justify-between">
                <h3 className="text-[10px] font-bold font-mono text-white uppercase tracking-widest">Take Profit Matrix</h3>
                <span className="text-[10px] font-mono text-foreground-muted">Risk/Reward</span>
              </div>
              <div className="divide-y divide-border/50">
                <div className="flex items-center justify-between p-4 hover:bg-surface/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center font-mono text-xs font-bold text-foreground-secondary">1:1</span>
                    <span className="font-mono text-sm text-foreground-muted">Conservative</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-numeric font-bold text-white">₹{rr1Target.toFixed(2)}</span>
                    <span className="text-xs font-mono text-positive bg-positive/10 px-2 py-1 rounded">+₹{riskAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 hover:bg-surface/30 transition-colors relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-positive/50" />
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-positive/10 border border-positive/20 flex items-center justify-center font-mono text-xs font-bold text-positive">1:2</span>
                    <span className="font-mono text-sm text-white font-bold">Standard Target</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-numeric font-bold text-white text-lg">₹{rr2Target.toFixed(2)}</span>
                    <span className="text-xs font-mono text-positive bg-positive/10 px-2 py-1 rounded border border-positive/20">+₹{(riskAmount * 2).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-surface/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-accent/10 border border-accent/20 flex items-center justify-center font-mono text-xs font-bold text-accent">1:3</span>
                    <span className="font-mono text-sm text-accent">Runner Target</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-numeric font-bold text-white">₹{rr3Target.toFixed(2)}</span>
                    <span className="text-xs font-mono text-positive bg-positive/10 px-2 py-1 rounded">+₹{(riskAmount * 3).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
