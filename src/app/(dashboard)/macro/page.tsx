"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Globe, Calendar, AlertTriangle, ArrowRight, Activity, Percent, BrainCircuit } from "lucide-react";
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
  { time: "08:30 PM", country: "US", event: "Core PCE Price Index (MoM)", impact: "High", prev: "0.2%", forecast: "0.3%" },
  { time: "08:30 PM", country: "US", event: "GDP Growth Rate (Q4)", impact: "High", prev: "4.9%", forecast: "3.2%" },
  { time: "07:30 AM", country: "IN", event: "RBI Interest Rate Decision", impact: "High", prev: "6.5%", forecast: "6.5%" },
  { time: "02:00 PM", country: "EU", event: "ECB Press Conference", impact: "High", prev: "-", forecast: "-" },
];

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
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Globe className="text-accent" size={28} />
              </div>
              Macroeconomic Intelligence
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl">
              Global economic indicators, central bank policies, and cross-asset correlations.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-surface-elevated border border-border rounded-md text-xs font-medium text-white shadow-sm">US 10Y: 4.25%</span>
            <span className="px-3 py-1.5 bg-surface-elevated border border-border rounded-md text-xs font-medium text-white shadow-sm">IN 10Y: 7.08%</span>
          </div>
        </motion.div>

        {/* Top Metrics Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="US Dollar Index (DXY)" 
            value="104.25" 
            trend="up" 
            trendValue="+0.12%"
            icon={Activity} 
          />
          <MetricCard 
            title="Crude Oil (WTI)" 
            value="$81.40" 
            trend="up" 
            trendValue="+1.2%"
            icon={Activity} 
          />
          <MetricCard 
            title="Gold (COMEX)" 
            value="$2,185" 
            trend="down" 
            trendValue="-0.4%"
            icon={Activity} 
          />
          <MetricCard 
            title="India 10Y Yield" 
            value="7.08%" 
            trend="neutral" 
            icon={Percent} 
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Macro Synthesis */}
            <motion.div variants={item} className="glass-card p-6 bg-gradient-to-br from-surface to-accent/5 border-accent/20 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BrainCircuit size={18} className="text-accent" />
                Algorithmic Macro Synthesis
              </h2>
              <p className="text-sm text-foreground-secondary leading-relaxed mb-4">
                The global macroeconomic regime is currently characterized by <strong className="text-white">"Sticky Inflation"</strong> and <strong className="text-white">"Higher for Longer"</strong> interest rates. 
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-elevated/50 border border-border rounded-lg">
                  <h3 className="text-xs font-bold text-positive uppercase mb-2">Equities Impact</h3>
                  <p className="text-xs text-foreground-secondary">Growth sectors (IT, Tech) may face headwinds due to higher discount rates. Value and dividend yield sectors (Utilities, Energy) remain defensive.</p>
                </div>
                <div className="p-4 bg-surface-elevated/50 border border-border rounded-lg">
                  <h3 className="text-xs font-bold text-negative uppercase mb-2">Bonds Impact</h3>
                  <p className="text-xs text-foreground-secondary">Short duration bonds preferred. The inverted yield curve signals caution, historically preceding economic contraction.</p>
                </div>
              </div>
            </motion.div>

            {/* Economic Calendar */}
            <motion.div variants={item} className="glass-card overflow-hidden backdrop-blur-md border border-white/5 bg-surface/40">
              <div className="p-4 border-b border-border bg-surface-elevated flex justify-between items-center">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-accent" /> High Impact Events (This Week)
                </h2>
                <button className="text-xs text-accent hover:text-white transition-colors">View Full Calendar</button>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead className="bg-surface">
                    <tr>
                      <th>Time</th>
                      <th>Country</th>
                      <th>Event</th>
                      <th className="text-right">Prev</th>
                      <th className="text-right">Forecast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {macroEvents.map((event, i) => (
                      <tr key={i}>
                        <td className="text-xs text-foreground-muted">{event.time}</td>
                        <td>
                          <span className="text-xs font-bold px-2 py-1 bg-surface-elevated rounded border border-border">{event.country}</span>
                        </td>
                        <td className="font-medium text-white">{event.event}</td>
                        <td className="text-right font-numeric">{event.prev}</td>
                        <td className="text-right font-numeric font-bold text-accent">{event.forecast}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div variants={item} className="glass-card p-6 backdrop-blur-md border border-white/5 bg-surface/40">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Yield Curve (US)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground-secondary">2 Year</span>
                  <span className="font-numeric font-bold text-white">4.62%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground-secondary">10 Year</span>
                  <span className="font-numeric font-bold text-white">4.25%</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-xs font-medium text-foreground-muted">2Y/10Y Spread</span>
                  <span className="font-numeric font-bold text-negative">-0.37% (Inverted)</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="glass-card p-6 backdrop-blur-md border border-white/5 bg-surface/40">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Correlation Matrix</h3>
              <p className="text-xs text-foreground-muted mb-4">Last 30 days rolling correlation to Nifty 50</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground-secondary">S&P 500</span>
                  <span className="font-numeric font-medium text-positive">0.82</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground-secondary">USD/INR</span>
                  <span className="font-numeric font-medium text-negative">-0.45</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground-secondary">Crude Oil</span>
                  <span className="font-numeric font-medium text-negative">-0.61</span>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </motion.div>
    </PageWrapper>
  );
}
