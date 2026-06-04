"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PieChart, Filter, RefreshCcw, Info, Settings2 } from "lucide-react";
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

const strikePrices = [22300, 22350, 22400, 22450, 22500, 22550, 22600, 22650, 22700];

export default function OptionsChainPage() {
  const [expiry, setExpiry] = useState("28 Mar 2024");
  const spotPrice = 22514.65;

  return (
    <PageWrapper>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-7xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <PieChart className="text-accent" size={28} />
              </div>
              Options Chain
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-foreground-secondary text-sm">NIFTY 50 • Spot:</span>
              <span className="font-numeric font-bold text-white text-lg">₹{spotPrice}</span>
              <span className="text-xs font-medium text-positive ml-1">+124.50</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="bg-surface-elevated border border-border text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-accent"
            >
              <option>28 Mar 2024</option>
              <option>04 Apr 2024</option>
              <option>11 Apr 2024</option>
            </select>
            <button className="p-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-md text-foreground-secondary hover:text-white transition-colors">
              <RefreshCcw size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <Settings2 size={16} /> Builder
            </button>
          </div>
        </motion.div>

        {/* Top Metrics */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <MetricCard title="Put-Call Ratio (PCR)" value="1.15" trend="up" subtitle="Bullish" className="p-4" />
          <MetricCard title="Max Pain" value="22,500" className="p-4" />
          <MetricCard title="Implied Volatility (IV)" value="14.2%" trend="down" subtitle="Low Volatility" className="p-4" />
          <MetricCard title="IV Rank" value="24" subtitle="Percentile: 30%" className="p-4" />
          <div className="glass-card p-4 hidden lg:flex flex-col justify-center border-l-4 border-l-accent">
            <h3 className="text-sm font-medium text-foreground-secondary mb-1">Current Trend</h3>
            <p className="text-white font-bold">Short Covering</p>
            <p className="text-xs text-foreground-muted">Calls unwinding at 22,500</p>
          </div>
        </motion.div>

        {/* Options Chain Table */}
        <motion.div variants={item} className="glass-card overflow-hidden flex flex-col mt-2 backdrop-blur-md border border-white/5 bg-surface/40">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-surface-elevated/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-positive/20 border border-positive/30"></span>
                <span className="text-xs text-foreground-muted">ITM Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-negative/20 border border-negative/30"></span>
                <span className="text-xs text-foreground-muted">ITM Puts</span>
              </div>
            </div>
            <button className="text-xs text-accent hover:text-white flex items-center gap-1">
              <Filter size={14} /> Columns
            </button>
          </div>
          
          <div className="table-wrapper relative">
            <table className="data-table w-full text-center">
              <thead className="bg-surface sticky top-0 z-20">
                <tr>
                  <th colSpan={5} className="text-center border-r border-border border-b-2 border-b-positive/50 text-positive py-2">CALLS</th>
                  <th className="text-center border-r border-border border-b border-b-border bg-surface-elevated">STRIKE</th>
                  <th colSpan={5} className="text-center border-b-2 border-b-negative/50 text-negative py-2">PUTS</th>
                </tr>
                <tr className="text-[10px] md:text-xs text-foreground-muted">
                  <th className="text-right">OI (Lakhs)</th>
                  <th className="text-right">Chg OI</th>
                  <th className="text-right">Volume</th>
                  <th className="text-right">IV</th>
                  <th className="text-right border-r border-border">LTP</th>
                  
                  <th className="text-center bg-surface-elevated border-r border-border px-4">PRICE</th>
                  
                  <th className="text-left">LTP</th>
                  <th className="text-left">IV</th>
                  <th className="text-left">Volume</th>
                  <th className="text-left">Chg OI</th>
                  <th className="text-left">OI (Lakhs)</th>
                </tr>
              </thead>
              <tbody className="font-numeric text-sm">
                {strikePrices.map((strike, idx) => {
                  const isCallITM = strike < spotPrice;
                  const isPutITM = strike > spotPrice;
                  const isAtMoney = Math.abs(strike - spotPrice) < 50;
                  
                  return (
                    <tr key={strike} className={`hover:bg-surface-hover/80 ${isAtMoney ? 'border-y border-accent/30 bg-accent/5' : ''}`}>
                      {/* Calls */}
                      <td className={`text-right ${isCallITM ? 'bg-positive/5' : ''}`}>{(Math.random() * 50 + 10).toFixed(1)}</td>
                      <td className={`text-right ${isCallITM ? 'bg-positive/5' : ''}`}>
                        <span className={Math.random() > 0.5 ? 'text-positive' : 'text-negative'}>
                          {(Math.random() * 10 - 5).toFixed(1)}
                        </span>
                      </td>
                      <td className={`text-right ${isCallITM ? 'bg-positive/5' : ''}`}>{(Math.random() * 1000).toFixed(0)}K</td>
                      <td className={`text-right ${isCallITM ? 'bg-positive/5' : ''}`}>{(Math.random() * 5 + 10).toFixed(1)}</td>
                      <td className={`text-right border-r border-border font-bold text-white ${isCallITM ? 'bg-positive/10' : ''}`}>
                        {isCallITM ? (spotPrice - strike + 50).toFixed(2) : (Math.random() * 100).toFixed(2)}
                      </td>
                      
                      {/* Strike */}
                      <td className={`text-center font-bold border-r border-border bg-surface-elevated ${isAtMoney ? 'text-accent' : 'text-white'}`}>
                        {strike}
                      </td>
                      
                      {/* Puts */}
                      <td className={`text-left font-bold text-white ${isPutITM ? 'bg-negative/10' : ''}`}>
                        {isPutITM ? (strike - spotPrice + 50).toFixed(2) : (Math.random() * 100).toFixed(2)}
                      </td>
                      <td className={`text-left ${isPutITM ? 'bg-negative/5' : ''}`}>{(Math.random() * 5 + 10).toFixed(1)}</td>
                      <td className={`text-left ${isPutITM ? 'bg-negative/5' : ''}`}>{(Math.random() * 1000).toFixed(0)}K</td>
                      <td className={`text-left ${isPutITM ? 'bg-negative/5' : ''}`}>
                        <span className={Math.random() > 0.5 ? 'text-positive' : 'text-negative'}>
                          {(Math.random() * 10 - 5).toFixed(1)}
                        </span>
                      </td>
                      <td className={`text-left ${isPutITM ? 'bg-negative/5' : ''}`}>{(Math.random() * 50 + 10).toFixed(1)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-surface-elevated/50 text-xs text-foreground-muted flex justify-between items-center border-t border-border">
            <span>Data delayed by 15 mins.</span>
            <span className="flex items-center gap-1"><Info size={14}/> Open Interest shown in Lakhs</span>
          </div>
        </motion.div>

      </motion.div>
    </PageWrapper>
  );
}
