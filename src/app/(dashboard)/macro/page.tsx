"use client";
import React from "react";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Globe, Calendar, Percent, BrainCircuit, Activity, LineChart, ShieldAlert, TrendingUp } from "lucide-react";
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

const macroEvents = [
  { time: "08:30 PM", country: "US", event: "Core PCE Price Index (MoM)", impact: "High", prev: "0.2%", forecast: "0.3%", actual: "WAITING" },
  { time: "08:30 PM", country: "US", event: "GDP Growth Rate (Q4)", impact: "High", prev: "4.9%", forecast: "3.2%", actual: "WAITING" },
  { time: "07:30 AM", country: "IN", event: "RBI Interest Rate Decision", impact: "High", prev: "6.5%", forecast: "6.5%", actual: "6.5%" },
  { time: "02:00 PM", country: "EU", event: "ECB Press Conference", impact: "Medium", prev: "-", forecast: "-", actual: "DONE" },
];

// Heatmap data matrix (Asset Class Correlation)
const assets = ["SPX", "NIFTY", "GOLD", "USOIL", "DXY", "BTC"];
const correlationMatrix = [
  [1.00, 0.72, -0.21, -0.45, -0.68, 0.54],
  [0.72, 1.00, -0.15, -0.61, -0.42, 0.38],
  [-0.21, -0.15, 1.00, 0.28, -0.84, 0.12],
  [-0.45, -0.61, 0.28, 1.00, 0.35, -0.22],
  [-0.68, -0.42, -0.84, 0.35, 1.00, -0.41],
  [0.54, 0.38, 0.12, -0.22, -0.41, 1.00],
];

function getHeatmapColor(value: number) {
  if (value === 1) return "bg-surface text-foreground-muted border border-border/50";
  if (value >= 0.5) return "bg-positive/20 text-positive border border-positive/30";
  if (value > 0) return "bg-positive/5 text-positive/70 border border-positive/10";
  if (value <= -0.5) return "bg-negative/20 text-negative border border-negative/30";
  if (value < 0) return "bg-negative/5 text-negative/70 border border-negative/10";
  return "bg-surface border border-border text-white";
}

export default function MacroPage() {
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
                <Globe className="text-accent" size={28} />
              </div>
              Global Macro Terminal
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl font-mono">
              Institutional regime analysis, global liquidity tracking, and cross-asset correlation models.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1.5 bg-[#0A0A0B] border border-border rounded-md text-[10px] font-mono font-bold text-white shadow-sm flex items-center gap-2">
              <span className="text-foreground-muted">US 10Y:</span> <span className="text-negative">4.25%</span>
            </div>
            <div className="px-3 py-1.5 bg-[#0A0A0B] border border-border rounded-md text-[10px] font-mono font-bold text-white shadow-sm flex items-center gap-2">
              <span className="text-foreground-muted">IN 10Y:</span> <span className="text-positive">7.08%</span>
            </div>
            <div className="px-3 py-1.5 bg-[#0A0A0B] border border-border rounded-md text-[10px] font-mono font-bold text-white shadow-sm flex items-center gap-2">
              <span className="text-foreground-muted">FED RATE:</span> <span className="text-accent">5.25 - 5.50%</span>
            </div>
          </div>
        </motion.div>

        {/* Top Metrics Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="US Dollar Index (DXY)" value="104.25" trend="up" trendValue="+0.12%" icon={Activity} />
          <MetricCard title="Crude Oil (WTI)" value="$81.40" trend="up" trendValue="+1.2%" icon={Activity} />
          <MetricCard title="Gold (COMEX)" value="$2,185" trend="down" trendValue="-0.4%" icon={Activity} />
          
          {/* Global Liquidity Tracker Box */}
          <div className="glass-card p-4 border border-border/50 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-positive/10 rounded-full blur-3xl -z-10 transition-colors" />
            <div>
              <h3 className="text-[10px] font-bold font-mono text-foreground-secondary uppercase tracking-widest flex items-center gap-2">
                <LineChart size={14} className="text-positive" /> Global Net Liquidity
              </h3>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-2xl font-numeric font-bold text-white">$6.42T</span>
                <span className="text-xs font-bold text-positive mb-1">+0.8%</span>
              </div>
            </div>
            <p className="text-[10px] text-foreground-muted font-mono mt-2">Fed Balance Sheet - TGA - RRP</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* AI Macro Synthesis */}
            <motion.div variants={item} className="glass-card p-6 bg-gradient-to-br from-[#0A0A0B] to-accent/5 border border-border/50 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              <h2 className="text-[12px] font-bold font-mono text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
                <BrainCircuit size={16} className="text-accent" />
                Algorithmic Macro Synthesis
              </h2>
              <p className="text-sm text-foreground-secondary leading-relaxed mb-6 font-mono">
                The global macroeconomic regime is currently classified as <span className="text-warning font-bold bg-warning/10 px-1 rounded">STAGFLATIONARY LITE</span>. Central banks are trapped between sticky services inflation and softening manufacturing PMIs. Expect yield curve bear-steepening.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface/50 border border-positive/20 rounded-lg border-l-2 border-l-positive">
                  <h3 className="text-[10px] font-bold font-mono text-positive uppercase tracking-widest mb-2 flex items-center gap-2">
                    <TrendingUp size={12} /> Asset Overweight
                  </h3>
                  <p className="text-xs text-foreground-secondary font-mono leading-relaxed">Commodities (Gold, Oil), Short-Duration Treasuries, Value Equities, Energy Sector.</p>
                </div>
                <div className="p-4 bg-surface/50 border border-negative/20 rounded-lg border-l-2 border-l-negative">
                  <h3 className="text-[10px] font-bold font-mono text-negative uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ShieldAlert size={12} /> Asset Underweight
                  </h3>
                  <p className="text-xs text-foreground-secondary font-mono leading-relaxed">Long-Duration Bonds, Highly Leveraged Tech, Unprofitable Growth, Real Estate.</p>
                </div>
              </div>
            </motion.div>

            {/* Economic Calendar */}
            <motion.div variants={item} className="glass-card overflow-hidden border border-border/50 bg-[#0A0A0B]">
              <div className="p-4 border-b border-border/50 bg-surface/50 flex justify-between items-center">
                <h2 className="text-[10px] font-bold font-mono text-white uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} className="text-accent" /> High Impact Catalysts (This Week)
                </h2>
              </div>
              <div className="table-wrapper relative">
                <table className="data-table w-full">
                  <thead className="bg-[#050505] font-mono text-[10px] uppercase tracking-wider text-foreground-secondary">
                    <tr>
                      <th className="border-r border-border/50">Time / Region</th>
                      <th className="border-r border-border/50">Macro Event</th>
                      <th className="text-right border-r border-border/50">Consensus</th>
                      <th className="text-right border-r border-border/50">Previous</th>
                      <th className="text-right">Actual</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-xs">
                    {macroEvents.map((event, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-surface/30">
                        <td className="border-r border-border/50">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${event.country === 'US' ? 'bg-blue-500/20 text-blue-400' : event.country === 'IN' ? 'bg-orange-500/20 text-orange-400' : 'bg-surface-elevated text-white'}`}>
                              {event.country}
                            </span>
                            <span className="text-foreground-muted">{event.time}</span>
                          </div>
                        </td>
                        <td className="font-medium text-white border-r border-border/50">
                          <span className="flex items-center gap-2">
                            {event.impact === 'High' && <span className="w-1.5 h-1.5 rounded-full bg-negative animate-pulse" />}
                            {event.event}
                          </span>
                        </td>
                        <td className="text-right font-numeric text-accent font-bold border-r border-border/50">{event.forecast}</td>
                        <td className="text-right font-numeric text-foreground-secondary border-r border-border/50">{event.prev}</td>
                        <td className="text-right font-numeric font-bold">
                          {event.actual === "WAITING" ? (
                            <span className="text-[10px] text-foreground-muted bg-surface px-2 py-1 rounded">PENDING</span>
                          ) : (
                            <span className="text-white">{event.actual}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Correlation Heatmap */}
            <motion.div variants={item} className="glass-card p-5 border border-border/50 bg-[#0A0A0B]">
              <h3 className="text-[10px] font-bold font-mono text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-warning" /> Cross-Asset Correlation
              </h3>
              <p className="text-[10px] font-mono text-foreground-muted mb-4 uppercase">Rolling 30-Day Pearson Matrix</p>
              
              <div className="overflow-x-auto scrollbar-hide">
                <div className="grid grid-cols-7 gap-1 min-w-max">
                  {/* Header Row */}
                  <div className="h-8"></div>
                  {assets.map(asset => (
                    <div key={asset} className="h-8 flex items-center justify-center text-[9px] font-mono font-bold text-foreground-secondary">
                      {asset}
                    </div>
                  ))}
                  
                  {/* Matrix Rows */}
                  {assets.map((asset, rowIndex) => (
                    <React.Fragment key={asset}>
                      <div className="h-8 flex items-center justify-end pr-2 text-[9px] font-mono font-bold text-foreground-secondary">
                        {asset}
                      </div>
                      {correlationMatrix[rowIndex].map((val, colIndex) => (
                        <div 
                          key={`${rowIndex}-${colIndex}`} 
                          className={`h-8 flex items-center justify-center text-[10px] font-mono font-bold rounded-sm transition-all hover:scale-110 cursor-crosshair ${getHeatmapColor(val)}`}
                          title={`${asset} vs ${assets[colIndex]}: ${val}`}
                        >
                          {val.toFixed(2)}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Yield Curve Tracker */}
            <motion.div variants={item} className="glass-card p-5 border border-border/50 bg-[#0A0A0B]">
              <h3 className="text-[10px] font-bold font-mono text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                <LineChart size={14} className="text-accent" /> Sovereign Yield Curve (US)
              </h3>
              
              <div className="space-y-4 font-mono">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-foreground-secondary">2 Year Treasury</span>
                    <span className="font-numeric font-bold text-white">4.62%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                    <div className="bg-accent h-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-foreground-secondary">10 Year Treasury</span>
                    <span className="font-numeric font-bold text-white">4.25%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                    <div className="bg-accent/60 h-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-negative/5 border border-negative/20 rounded flex justify-between items-center mt-6">
                  <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">2Y/10Y Spread</span>
                  <span className="font-numeric font-bold text-negative bg-negative/10 px-2 py-0.5 rounded border border-negative/20">-0.37% (Inverted)</span>
                </div>
                <p className="text-[9px] text-foreground-muted leading-relaxed uppercase tracking-widest mt-2 text-center">
                  Inversion historically precedes contraction.
                </p>
              </div>
            </motion.div>

          </div>
          
        </div>
      </motion.div>
    </PageWrapper>
  );
}
