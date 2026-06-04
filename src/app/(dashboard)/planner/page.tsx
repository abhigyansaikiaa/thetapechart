"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BrainCircuit, DollarSign, Activity, Target, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PlannerPage() {
  const [capital, setCapital] = useState("100000");
  const [risk, setRisk] = useState("Moderate");
  const [style, setStyle] = useState("Swing");
  
  const [isPlanning, setIsPlanning] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const generatePlan = async () => {
    setIsPlanning(true);
    setPlan(null);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capital: parseFloat(capital), risk, style }),
      });
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
              <BrainCircuit className="text-accent" size={28} />
            </div>
            Algorithmic Investment Planner
          </h1>
          <p className="text-foreground-secondary text-sm max-w-3xl">
            Input your capital and risk parameters. The Gemini-powered quantitative engine will synthesize live macro data, 
            Smart Money Concepts, and ICT structures to generate exact entry/exit allocations and lot sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inputs */}
          <div className="glass-card p-6 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-border/50 pb-4">Strategy Parameters</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Total Capital Base (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-foreground-muted" />
                  </div>
                  <input 
                    type="number" 
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-white font-numeric focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Risk Tolerance</label>
                <div className="flex bg-surface-elevated rounded-lg p-1">
                  {["Low", "Moderate", "High"].map(r => (
                    <button
                      key={r}
                      onClick={() => setRisk(r)}
                      className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                        risk === r ? "bg-accent text-white shadow-md" : "text-foreground-secondary hover:text-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Trading Style</label>
                <select 
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="Scalping">Intraday / Scalping</option>
                  <option value="Swing">Swing Trading (Days-Weeks)</option>
                  <option value="Position">Positional (Weeks-Months)</option>
                  <option value="SIP">Long Term / SIP</option>
                </select>
              </div>

              <button 
                onClick={generatePlan}
                disabled={isPlanning || !capital}
                className="w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50"
              >
                {isPlanning ? (
                  <><Loader2 size={18} className="animate-spin" /> Synthesizing Data...</>
                ) : (
                  <><Activity size={18} /> Generate Quant Strategy</>
                )}
              </button>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-2">
            {!plan && !isPlanning ? (
              <div className="h-full min-h-[400px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-center text-foreground-muted">
                <Target size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Awaiting Parameters</h3>
                <p className="max-w-md mx-auto">Set your capital and risk profile on the left, and the engine will build a high-probability SMC/ICT trading plan.</p>
              </div>
            ) : isPlanning ? (
              <div className="h-full min-h-[400px] glass-card flex flex-col items-center justify-center p-8 text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                  <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mt-6 mb-2">Running Algorithmic Models</h3>
                <p className="text-foreground-secondary text-sm max-w-md">Scanning global order flow, identifying FVGs, and calculating strict Risk:Reward lot sizes...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="glass-card p-6 border-l-4 border-l-accent">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Executive Summary</h3>
                  <p className="text-foreground-secondary leading-relaxed">{plan.summary}</p>
                  
                  <div className="flex gap-6 mt-6 pt-6 border-t border-border/50">
                    <div>
                      <p className="text-xs text-foreground-muted uppercase tracking-wider mb-1">Target Sharpe Ratio</p>
                      <p className="text-xl font-bold font-numeric text-white">{plan.riskMetrics?.sharpeRatio || "1.8"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted uppercase tracking-wider mb-1">Est. Max Drawdown</p>
                      <p className="text-xl font-bold font-numeric text-negative">{plan.riskMetrics?.maxDrawdown || "4.5%"}</p>
                    </div>
                  </div>
                </div>

                {/* Trades */}
                <h3 className="text-xl font-bold text-white mt-8 mb-4">Allocated Setups</h3>
                <div className="grid grid-cols-1 gap-4">
                  {plan.trades?.map((trade: any, idx: number) => (
                    <div key={idx} className="glass-card p-0 overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                      <div className="p-4 bg-surface-elevated flex justify-between items-center border-b border-border">
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-white">{trade.ticker}</span>
                          <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded">{trade.style}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-foreground-muted mb-1">Capital Allocation</p>
                          <p className="text-sm font-bold text-white">{trade.allocationPercentage}% ({(parseFloat(capital) * (trade.allocationPercentage/100)).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })})</p>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-4 gap-4 mb-6">
                          <div>
                            <p className="text-xs text-foreground-muted uppercase mb-1">Lot Size / Qty</p>
                            <p className="font-numeric font-bold text-white">{trade.lotSize}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground-muted uppercase mb-1">Entry (OTE)</p>
                            <p className="font-numeric font-bold text-accent">{trade.entry}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground-muted uppercase mb-1">Invalidation (SL)</p>
                            <p className="font-numeric font-bold text-negative">{trade.stopLoss}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground-muted uppercase mb-1">Target (TP)</p>
                            <p className="font-numeric font-bold text-positive">{trade.takeProfit}</p>
                          </div>
                        </div>
                        
                        <div className="bg-surface/50 rounded-lg p-4 border border-border/50">
                          <h4 className="text-xs font-bold text-foreground-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-positive" /> SMC / ICT Rationale
                          </h4>
                          <p className="text-sm text-foreground-secondary">{trade.rationale}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
