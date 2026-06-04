"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PieChart, TrendingUp, Search, ShieldCheck, ChevronRight, Activity, Layers, Target } from "lucide-react";
import { MetricCard } from "@/components/trading/MetricCard";
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

const mfCategories = ["Equity", "Debt", "Hybrid", "Index", "ELSS", "Smart Beta"];

const mockFunds = [
  { id: 1, name: "Quant Small Cap Fund Direct Plan", category: "Small Cap", cagr3y: 38.5, aum: 12400, risk: "Very High", alpha: 4.2 },
  { id: 2, name: "Parag Parikh Flexi Cap Fund", category: "Flexi Cap", cagr3y: 22.4, aum: 54300, risk: "High", alpha: 2.8 },
  { id: 3, name: "Nippon India Large Cap Fund", category: "Large Cap", cagr3y: 19.2, aum: 21200, risk: "High", alpha: 1.5 },
  { id: 4, name: "HDFC Index Fund Nifty 50", category: "Index", cagr3y: 15.2, aum: 11200, risk: "High", alpha: -0.1 },
  { id: 5, name: "SBI Equity Hybrid Fund", category: "Hybrid", cagr3y: 14.8, aum: 65000, risk: "Moderate", alpha: 1.1 },
];

export default function MutualFundsPage() {
  const [activeCategory, setActiveCategory] = useState("Equity");

  return (
    <PageWrapper>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-7xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3 font-sans">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Target className="text-accent" size={28} />
              </div>
              Wealth Management Portal
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl font-mono">
              Institutional-grade mutual fund analytics, portfolio overlap detection, and non-linear SIP compounding models.
            </p>
          </div>
          <div className="w-full md:w-auto relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={16} />
            <input 
              type="text" 
              placeholder="Search AMC or Fund..." 
              className="w-full md:w-80 bg-[#0A0A0B] border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-accent transition-colors group-hover:border-accent/50"
            />
          </div>
        </motion.div>

        {/* Global Metrics Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Nifty 50 (1Y Return)" value="28.4%" trend="up" icon={Activity} />
          <MetricCard title="Avg Small Cap (1Y)" value="45.2%" trend="up" icon={TrendingUp} />
          
          {/* AI Recommendation Box */}
          <div className="glass-card p-4 lg:col-span-2 border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10 group-hover:bg-accent/20 transition-colors" />
            <h3 className="text-[10px] font-bold font-mono text-accent mb-2 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} /> Algorithmic Asset Allocation
            </h3>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <p className="text-sm text-foreground-secondary font-mono flex-1">
                Current macro regime suggests a transition to <span className="text-white font-bold">Large & Mid Cap bias</span>. Recommend reducing small-cap exposure by 15% to hedge against valuation compression.
              </p>
              <button className="px-4 py-2 bg-surface border border-border hover:border-accent/50 rounded-lg text-xs font-mono font-bold text-white transition-colors whitespace-nowrap">
                Apply Rebalance
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Main Funds List */}
          <motion.div variants={item} className="xl:col-span-8 glass-card border border-border/50 overflow-hidden flex flex-col">
            <div className="p-4 bg-surface-elevated/30 border-b border-border/50">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {mfCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 text-[11px] font-bold font-mono uppercase tracking-wider rounded-md transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? "bg-accent/10 text-accent border border-accent/20" 
                        : "bg-transparent border border-transparent text-foreground-secondary hover:text-white hover:bg-surface"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-wrapper flex-1">
              <table className="data-table">
                <thead className="bg-[#0A0A0B] font-mono text-[10px] uppercase tracking-wider text-foreground-secondary">
                  <tr>
                    <th className="border-r border-border/50">Fund Architecture</th>
                    <th className="text-right border-r border-border/50">AUM (Cr)</th>
                    <th className="text-right border-r border-border/50">Risk Metric</th>
                    <th className="text-right border-r border-border/50">Jensen's Alpha</th>
                    <th className="text-right border-r border-border/50">3Y CAGR</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {mockFunds.map(fund => (
                    <tr key={fund.id} className="group hover:bg-surface/50 cursor-pointer border-b border-border/50">
                      <td className="border-r border-border/50">
                        <p className="font-bold text-white group-hover:text-accent transition-colors">{fund.name}</p>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted mt-1">{fund.category}</p>
                      </td>
                      <td className="text-right font-numeric text-foreground-secondary border-r border-border/50">₹{fund.aum.toLocaleString()}</td>
                      <td className="text-right border-r border-border/50">
                        <span className={`text-[10px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                          fund.risk.includes('High') ? 'bg-negative/10 text-negative border-negative/20' : 'bg-warning/10 text-warning border-warning/20'
                        }`}>
                          {fund.risk}
                        </span>
                      </td>
                      <td className="text-right border-r border-border/50 font-numeric">
                        <span className={fund.alpha > 0 ? "text-positive" : "text-negative"}>
                          {fund.alpha > 0 ? "+" : ""}{fund.alpha}%
                        </span>
                      </td>
                      <td className="text-right border-r border-border/50">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-numeric font-bold text-white">{fund.cagr3y}%</span>
                        </div>
                      </td>
                      <td className="text-right">
                        <ChevronRight size={16} className="inline-block text-foreground-muted group-hover:text-accent" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-[#0A0A0B] border-t border-border/50">
              <button className="w-full py-2 border border-border/50 hover:border-accent/50 rounded-md text-xs font-mono uppercase tracking-widest text-foreground-secondary hover:text-white hover:bg-accent/5 transition-all">
                Load Master Database
              </button>
            </div>
          </motion.div>

          {/* Right Sidebar: Analytics & Projection */}
          <motion.div variants={item} className="xl:col-span-4 space-y-6">
            
            {/* Step-Up SIP Projection */}
            <div className="glass-card p-5 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-positive/10 rounded-full blur-3xl -z-10 transition-colors" />
              <h2 className="text-[10px] font-bold font-mono text-foreground-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-positive" /> Dynamic Step-Up Projection
              </h2>
              
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-2xl font-numeric font-bold text-white">₹5.2 Cr</span>
                  <span className="text-[10px] font-mono text-positive uppercase tracking-widest">Projected Corpus</span>
                </div>
                <p className="text-[10px] text-foreground-muted font-mono">Assumes 12% CAGR over 20 Years</p>
              </div>

              {/* Mock Chart Area */}
              <div className="h-24 w-full flex items-end gap-[2px] opacity-80 mb-4 border-b border-l border-border/50 pb-1 pl-1">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-positive/20 to-positive/60 rounded-t-sm transition-all hover:opacity-100" 
                    style={{ height: `${Math.pow(1.15, i) / Math.pow(1.15, 20) * 100}%` }}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-surface p-2 rounded border border-border/50">
                  <span className="text-[10px] font-mono uppercase text-foreground-secondary">Base SIP</span>
                  <span className="text-sm font-numeric font-bold text-white">₹25,000 / mo</span>
                </div>
                <div className="flex justify-between items-center bg-surface p-2 rounded border border-border/50">
                  <span className="text-[10px] font-mono uppercase text-foreground-secondary">Annual Step-Up</span>
                  <span className="text-sm font-numeric font-bold text-accent">10%</span>
                </div>
              </div>
            </div>

            {/* Portfolio Overlap Matrix */}
            <div className="glass-card p-5 border border-border/50">
              <h2 className="text-[10px] font-bold font-mono text-foreground-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={14} className="text-warning" /> Portfolio Overlap Matrix
              </h2>
              <p className="text-xs text-foreground-muted mb-4 font-mono">
                High overlap detected between your active Small Cap funds. Consider consolidating to reduce expense drag.
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-white">Quant Small Cap</span>
                    <span className="text-warning font-bold">42% Overlap</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5 overflow-hidden border border-border/50">
                    <div className="bg-warning h-full rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-[10px] text-foreground-muted mt-1 block">With Nippon Small Cap</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-white">HDFC Index Nifty 50</span>
                    <span className="text-positive font-bold">4% Overlap</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5 overflow-hidden border border-border/50">
                    <div className="bg-positive h-full rounded-full" style={{ width: '4%' }}></div>
                  </div>
                  <span className="text-[10px] text-foreground-muted mt-1 block">With Parag Parikh Flexi</span>
                </div>
              </div>
              
              <button className="w-full mt-5 py-2 bg-surface hover:bg-surface-elevated border border-border rounded-md text-[10px] font-bold font-mono uppercase tracking-widest text-white transition-colors">
                Run Deep Overlap Scan
              </button>
            </div>

          </motion.div>
          
        </div>
      </motion.div>
    </PageWrapper>
  );
}
