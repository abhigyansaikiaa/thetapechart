"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PieChart, Filter, RefreshCcw, Info, Settings2, Activity } from "lucide-react";
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

const STRIKES = [22200, 22250, 22300, 22350, 22400, 22450, 22500, 22550, 22600, 22650, 22700, 22750, 22800];
const SPOT_PRICE = 22495.65;

export default function OptionsChainPage() {
  const [expiry, setExpiry] = useState("28 Mar 2024");

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
                <Activity className="text-accent" size={28} />
              </div>
              Derivatives Terminal
            </h1>
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-foreground-secondary uppercase tracking-widest text-[10px] font-bold">Underlying:</span>
              <span className="font-bold text-white text-lg">NIFTY 50</span>
              <span className="font-numeric font-bold text-accent text-lg bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                ₹{SPOT_PRICE}
              </span>
              <span className="text-xs font-bold text-positive bg-positive/10 px-1.5 py-0.5 rounded">+124.50 (+0.55%)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0B] border border-border rounded-md">
              <span className="text-[10px] font-mono text-foreground-secondary uppercase">Expiry:</span>
              <select 
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="bg-transparent text-white font-mono text-sm focus:outline-none cursor-pointer"
              >
                <option>28 Mar 2024 (W)</option>
                <option>04 Apr 2024 (W)</option>
                <option>25 Apr 2024 (M)</option>
              </select>
            </div>
            <button className="p-2.5 bg-surface-elevated hover:bg-surface-hover border border-border rounded-md text-foreground-secondary hover:text-accent transition-colors">
              <RefreshCcw size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md text-sm font-bold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)] font-mono uppercase tracking-wide">
              <Settings2 size={16} /> Strategy Builder
            </button>
          </div>
        </motion.div>

        {/* Pro Metrics Dashboard */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <MetricCard title="Put-Call Ratio (PCR)" value="1.15" trend="up" subtitle="Bullish Bias" className="p-4 border-t-2 border-t-positive" />
          <MetricCard title="Max Pain Strike" value="22,500" subtitle="Heavy call writing" className="p-4" />
          <MetricCard title="Implied Volatility (IV)" value="14.2%" trend="down" subtitle="IV Crush active" className="p-4 border-t-2 border-t-negative" />
          <MetricCard title="India VIX" value="12.8" trend="down" subtitle="Low fear environment" className="p-4" />
          
          {/* Mock IV Skew Chart Box */}
          <div className="glass-card p-4 hidden lg:flex flex-col border border-border/50 relative overflow-hidden group">
            <h3 className="text-[10px] font-bold font-mono text-foreground-secondary uppercase tracking-widest mb-2 z-10">Volatility Skew</h3>
            <div className="flex-1 flex items-end gap-1 z-10 opacity-80">
              {/* CSS Volatility surface representation */}
              {[40, 30, 20, 15, 12, 10, 12, 16, 25, 35].map((val, i) => (
                <div key={i} className={`flex-1 rounded-t-sm ${i < 5 ? "bg-negative" : "bg-positive"}`} style={{ height: `${val}%` }} />
              ))}
            </div>
            <p className="text-[10px] text-foreground-muted mt-2 z-10 font-mono">Puts pricing &gt; Calls</p>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Options Chain Pro Table */}
        <motion.div variants={item} className="glass-card overflow-hidden flex flex-col mt-2 border border-border/50 bg-[#0A0A0B]">
          <div className="p-3 border-b border-border/50 flex justify-between items-center bg-surface/50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-positive/10 border border-positive/30"></span>
                <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">ITM Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-negative/10 border border-negative/30"></span>
                <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-widest">ITM Puts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                <span className="text-[10px] font-mono text-white uppercase tracking-widest font-bold">ATM Spot</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-[10px] font-mono font-bold text-accent hover:text-white px-3 py-1.5 bg-accent/10 border border-accent/20 rounded transition-colors uppercase tracking-widest">
                Greeks View
              </button>
            </div>
          </div>
          
          <div className="table-wrapper relative">
            <table className="data-table w-full text-center">
              <thead className="bg-[#050505] sticky top-0 z-20 font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th colSpan={7} className="text-center border-r border-border/50 border-b-2 border-b-positive/50 text-positive py-2 tracking-widest font-bold">CALLS (CE)</th>
                  <th className="text-center border-r border-border/50 border-b-2 border-b-accent bg-accent/5 text-white tracking-widest font-bold">STRIKE</th>
                  <th colSpan={7} className="text-center border-b-2 border-b-negative/50 text-negative py-2 tracking-widest font-bold">PUTS (PE)</th>
                </tr>
                <tr className="text-foreground-muted bg-surface/30">
                  <th className="text-right py-2">Delta</th>
                  <th className="text-right">Theta</th>
                  <th className="text-right">OI (L)</th>
                  <th className="text-right">Chg OI</th>
                  <th className="text-right">Vol</th>
                  <th className="text-right">IV</th>
                  <th className="text-right border-r border-border/50 text-white font-bold">LTP</th>
                  
                  <th className="text-center border-r border-border/50 bg-accent/5 text-accent font-bold px-4">PRICE</th>
                  
                  <th className="text-left border-l border-border/50 text-white font-bold">LTP</th>
                  <th className="text-left">IV</th>
                  <th className="text-left">Vol</th>
                  <th className="text-left">Chg OI</th>
                  <th className="text-left">OI (L)</th>
                  <th className="text-left">Theta</th>
                  <th className="text-left">Delta</th>
                </tr>
              </thead>
              <tbody className="font-numeric text-xs font-medium">
                {STRIKES.map((strike, idx) => {
                  const isCallITM = strike < SPOT_PRICE;
                  const isPutITM = strike > SPOT_PRICE;
                  // ATM calculation (closest strike to spot)
                  const isAtMoney = Math.abs(strike - SPOT_PRICE) === Math.min(...STRIKES.map(s => Math.abs(s - SPOT_PRICE)));
                  
                  // Mock Greeks based on moneyness
                  const distance = (strike - SPOT_PRICE) / SPOT_PRICE;
                  const callDelta = isCallITM ? (0.5 + Math.abs(distance)*10).toFixed(2) : (0.5 - Math.abs(distance)*10).toFixed(2);
                  const putDelta = isPutITM ? (-0.5 - Math.abs(distance)*10).toFixed(2) : (-0.5 + Math.abs(distance)*10).toFixed(2);
                  const theta = (-Math.random() * 5).toFixed(1);

                  return (
                    <tr key={strike} className={`
                      hover:bg-surface-hover transition-colors border-b border-border/30
                      ${isAtMoney ? 'border-y-2 border-y-accent bg-accent/5 shadow-[0_0_15px_rgba(59,130,246,0.1)_inset]' : ''}
                    `}>
                      {/* Calls */}
                      <td className={`text-right text-foreground-secondary ${isCallITM ? 'bg-positive/5' : ''}`}>{Math.max(0, Math.min(1, parseFloat(callDelta))).toFixed(2)}</td>
                      <td className={`text-right text-negative/70 ${isCallITM ? 'bg-positive/5' : ''}`}>{theta}</td>
                      <td className={`text-right ${isCallITM ? 'bg-positive/5' : ''}`}>{(Math.random() * 50 + 10).toFixed(1)}</td>
                      <td className={`text-right ${isCallITM ? 'bg-positive/5' : ''}`}>
                        <span className={Math.random() > 0.5 ? 'text-positive' : 'text-negative'}>
                          {(Math.random() * 10 - 5).toFixed(1)}
                        </span>
                      </td>
                      <td className={`text-right text-foreground-muted ${isCallITM ? 'bg-positive/5' : ''}`}>{(Math.random() * 500).toFixed(0)}K</td>
                      <td className={`text-right text-foreground-secondary ${isCallITM ? 'bg-positive/5' : ''}`}>{(Math.random() * 5 + 10).toFixed(1)}</td>
                      <td className={`text-right border-r border-border/50 font-bold ${isCallITM ? 'bg-positive/10 text-positive' : 'text-white'}`}>
                        {isCallITM ? (SPOT_PRICE - strike + 50).toFixed(2) : (Math.random() * 40).toFixed(2)}
                      </td>
                      
                      {/* Strike ATM Highlight */}
                      <td className={`text-center font-bold border-r border-border/50 px-4 relative ${isAtMoney ? 'bg-accent text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-surface/30 text-white'}`}>
                        {isAtMoney && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white animate-pulse" />}
                        {strike}
                        {isAtMoney && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse" />}
                      </td>
                      
                      {/* Puts */}
                      <td className={`text-left font-bold ${isPutITM ? 'bg-negative/10 text-negative' : 'text-white'}`}>
                        {isPutITM ? (strike - SPOT_PRICE + 50).toFixed(2) : (Math.random() * 40).toFixed(2)}
                      </td>
                      <td className={`text-left text-foreground-secondary ${isPutITM ? 'bg-negative/5' : ''}`}>{(Math.random() * 5 + 10).toFixed(1)}</td>
                      <td className={`text-left text-foreground-muted ${isPutITM ? 'bg-negative/5' : ''}`}>{(Math.random() * 500).toFixed(0)}K</td>
                      <td className={`text-left ${isPutITM ? 'bg-negative/5' : ''}`}>
                        <span className={Math.random() > 0.5 ? 'text-positive' : 'text-negative'}>
                          {(Math.random() * 10 - 5).toFixed(1)}
                        </span>
                      </td>
                      <td className={`text-left ${isPutITM ? 'bg-negative/5' : ''}`}>{(Math.random() * 50 + 10).toFixed(1)}</td>
                      <td className={`text-left text-negative/70 ${isPutITM ? 'bg-negative/5' : ''}`}>{theta}</td>
                      <td className={`text-left text-foreground-secondary ${isPutITM ? 'bg-negative/5' : ''}`}>{Math.max(-1, Math.min(0, parseFloat(putDelta))).toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-[#050505] font-mono text-[10px] text-foreground-muted flex justify-between items-center border-t border-border/50 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> Live Data Stream</span>
            <span className="flex items-center gap-1"><Info size={12}/> Delta/Theta based on Black-Scholes</span>
          </div>
        </motion.div>

      </motion.div>
    </PageWrapper>
  );
}
