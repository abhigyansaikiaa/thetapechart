"use client";

import { useState, useMemo } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TrendingUp, Settings2, Target, PiggyBank, BarChart3, AlertTriangle } from "lucide-react";
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

export default function MutualFundsPage() {
  const [monthlySip, setMonthlySip] = useState<number>(25000);
  const [stepUp, setStepUp] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(20);

  const projection = useMemo(() => {
    let totalInvested = 0;
    let currentCorpus = 0;
    let currentSip = monthlySip;
    
    // Arrays for chart rendering
    const yearlyData = [];
    
    for (let y = 1; y <= years; y++) {
      let yearInvested = 0;
      for (let m = 1; m <= 12; m++) {
        currentCorpus += currentSip;
        yearInvested += currentSip;
        // Apply monthly return
        currentCorpus *= (1 + (expectedReturn / 100) / 12);
      }
      totalInvested += yearInvested;
      
      yearlyData.push({
        year: y,
        invested: totalInvested,
        corpus: currentCorpus,
        wealthGained: currentCorpus - totalInvested
      });
      
      // Apply annual step-up
      currentSip *= (1 + stepUp / 100);
    }
    
    return {
      totalInvested,
      finalCorpus: currentCorpus,
      wealthGained: currentCorpus - totalInvested,
      yearlyData
    };
  }, [monthlySip, stepUp, expectedReturn, years]);

  // Format currency helper
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <PageWrapper>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-6xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold font-mono text-warning uppercase tracking-widest bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                Wealth Portal Offline
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3 font-sans">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Target className="text-accent" size={28} />
              </div>
              Advanced SIP & Compounding Engine
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl font-mono">
              While live mutual fund data is disconnected, use this dynamic Non-Linear Step-Up SIP calculator to model long-term wealth creation and compounding trajectories.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Inputs */}
          <motion.div variants={item} className="xl:col-span-5 glass-card p-6 border border-border/50 h-fit">
            <h2 className="text-[12px] font-bold font-mono text-white uppercase tracking-widest flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
              <Settings2 size={16} className="text-accent" /> Projection Parameters
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block">Monthly SIP Amount (₹)</label>
                <input 
                  type="number" 
                  value={monthlySip} 
                  onChange={(e) => setMonthlySip(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-border rounded-md px-3 py-2.5 font-numeric text-sm text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block flex justify-between">
                  <span>Annual Step-Up (%)</span>
                  <span className="text-accent">{stepUp}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="50" step="1"
                  value={stepUp} 
                  onChange={(e) => setStepUp(Number(e.target.value))}
                  className="w-full accent-accent h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-foreground-muted font-mono mt-2">Increase your SIP amount every year to beat inflation.</p>
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block flex justify-between">
                  <span>Expected Annual Return (CAGR %)</span>
                  <span className="text-positive">{expectedReturn}%</span>
                </label>
                <input 
                  type="range" 
                  min="5" max="30" step="0.5"
                  value={expectedReturn} 
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full accent-positive h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block flex justify-between">
                  <span>Time Horizon (Years)</span>
                  <span className="text-white font-bold">{years} Years</span>
                </label>
                <input 
                  type="range" 
                  min="1" max="40" step="1"
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-white h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {expectedReturn > 15 && (
               <div className="mt-6 p-3 bg-warning/10 border border-warning/20 rounded-md flex items-start gap-3">
                 <AlertTriangle size={16} className="text-warning mt-0.5 shrink-0" />
                 <p className="text-[10px] font-mono text-warning uppercase">Returns above 15% CAGR are highly aggressive and generally unsustainable over long periods for standard mutual funds.</p>
               </div>
            )}
          </motion.div>

          {/* Outputs */}
          <motion.div variants={item} className="xl:col-span-7 flex flex-col gap-6">
            
            {/* Primary Result */}
            <div className="glass-card p-8 border border-positive/20 bg-positive/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-positive/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-xs font-mono text-foreground-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
                <BarChart3 size={14} className="text-positive" /> Projected Total Wealth
              </h3>
              <div className="text-6xl font-bold font-numeric text-white mb-4">
                {formatCurrency(projection.finalCorpus)}
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <div className="flex items-center gap-2 bg-[#0A0A0B] px-3 py-1.5 rounded-full border border-border">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest">Invested:</span>
                  <span className="text-xs font-numeric font-bold text-white">{formatCurrency(projection.totalInvested)}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#0A0A0B] px-3 py-1.5 rounded-full border border-border">
                  <div className="w-2 h-2 rounded-full bg-positive"></div>
                  <span className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest">Est. Returns:</span>
                  <span className="text-xs font-numeric font-bold text-white">{formatCurrency(projection.wealthGained)}</span>
                </div>
              </div>
            </div>

            {/* Visualizer Chart */}
            <div className="glass-card p-6 border border-border/50 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-bold font-mono text-white uppercase tracking-widest">Compounding Trajectory</h3>
              </div>
              
              <div className="flex-1 relative min-h-[250px] flex items-end justify-between gap-1 group">
                {/* CSS Bar Chart */}
                {projection.yearlyData.map((data, idx) => {
                  // Only show ~20 bars max to avoid crowding
                  const showEvery = Math.max(1, Math.floor(years / 20));
                  if (idx % showEvery !== 0 && idx !== years - 1) return null;
                  
                  // Calculate heights relative to final corpus
                  const totalHeightPct = (data.corpus / projection.finalCorpus) * 100;
                  const investedHeightPct = (data.invested / data.corpus) * 100;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col justify-end group/bar relative h-full">
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0A0A0B] border border-border p-2 rounded shadow-xl opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 w-max text-center">
                        <div className="text-[10px] font-bold font-mono text-white mb-1">Year {data.year}</div>
                        <div className="text-[10px] font-numeric text-positive">{formatCurrency(data.corpus)}</div>
                      </div>

                      {/* Bar Container */}
                      <div className="w-full rounded-t-sm flex flex-col justify-end overflow-hidden transition-all duration-500 ease-out bg-surface hover:brightness-125" style={{ height: `${totalHeightPct}%` }}>
                        <div className="w-full bg-positive/80" style={{ height: `${100 - investedHeightPct}%` }} />
                        <div className="w-full bg-accent/80 border-t border-[#0A0A0B]/20" style={{ height: `${investedHeightPct}%` }} />
                      </div>
                      
                      {/* X-Axis Label */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-foreground-muted">
                        Yr {data.year}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-8 pt-4 border-t border-border/50 flex justify-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-accent/80"></div>
                    <span className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest">Total Investment</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-positive/80"></div>
                    <span className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest">Wealth Generated (Compounding)</span>
                 </div>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
