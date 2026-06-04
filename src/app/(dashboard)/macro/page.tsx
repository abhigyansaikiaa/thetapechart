"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Globe, Calendar, Percent, BrainCircuit, Activity, LineChart, ShieldAlert, ArrowRight, Lock } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

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

export default function MacroIntelligencePage() {
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
             <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold font-mono text-warning uppercase tracking-widest bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                Macro Data Offline
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3 font-sans">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Globe className="text-accent" size={28} />
              </div>
              Macro Economics Reference Guide
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl font-mono">
              While live global macroeconomic feeds are disconnected, use this institutional reference guide to understand how critical economic indicators impact equity markets.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Main Content Area */}
          <motion.div variants={item} className="xl:col-span-8 flex flex-col gap-6">
            
            <div className="glass-card border border-border/50 overflow-hidden">
              <div className="p-4 border-b border-border/50 flex justify-between items-center bg-surface-elevated/50">
                <h2 className="text-[12px] font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wide">
                  <BrainCircuit className="text-accent" size={16} /> Key Economic Indicators
                </h2>
              </div>

              <div className="divide-y divide-border/50">
                {/* CPI */}
                <div className="p-6 hover:bg-surface/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-negative/10 text-negative border border-negative/20 shrink-0">
                      <Percent size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        CPI (Consumer Price Index) & Inflation
                      </h3>
                      <p className="text-sm text-foreground-secondary leading-relaxed mb-4">
                        Measures changes in the price level of a weighted average market basket of consumer goods and services. High CPI indicates rising inflation.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#0A0A0B] p-3 rounded border border-border">
                          <span className="text-[10px] font-mono text-negative uppercase tracking-widest block mb-1">If Higher Than Expected</span>
                          <span className="text-xs text-white font-medium">Equities fall. Central banks may hike interest rates to cool the economy, increasing borrowing costs.</span>
                        </div>
                        <div className="bg-[#0A0A0B] p-3 rounded border border-border">
                          <span className="text-[10px] font-mono text-positive uppercase tracking-widest block mb-1">If Lower Than Expected</span>
                          <span className="text-xs text-white font-medium">Equities rally. Suggests inflation is cooling, paving the way for rate cuts and easier money.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interest Rates */}
                <div className="p-6 hover:bg-surface/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10 text-accent border border-accent/20 shrink-0">
                      <LineChart size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        Central Bank Interest Rates (Fed / RBI)
                      </h3>
                      <p className="text-sm text-foreground-secondary leading-relaxed mb-4">
                        The rate at which central banks lend money to domestic banks. It is the primary tool for controlling inflation and economic growth.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#0A0A0B] p-3 rounded border border-border">
                          <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">Rate Hikes (Hawkish)</span>
                          <span className="text-xs text-white font-medium">Strengthens currency, hurts equities (especially high-growth tech) as future cash flows are discounted at a higher rate.</span>
                        </div>
                        <div className="bg-[#0A0A0B] p-3 rounded border border-border">
                          <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">Rate Cuts (Dovish)</span>
                          <span className="text-xs text-white font-medium">Weakens currency, boosts equities and real estate as borrowing becomes cheaper and liquidity increases.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GDP */}
                <div className="p-6 hover:bg-surface/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-positive/10 text-positive border border-positive/20 shrink-0">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        GDP (Gross Domestic Product) Growth
                      </h3>
                      <p className="text-sm text-foreground-secondary leading-relaxed mb-4">
                        The broadest quantitative measure of a nation's total economic activity. Represents the monetary value of all goods and services produced.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#0A0A0B] p-3 rounded border border-border">
                          <span className="text-[10px] font-mono text-positive uppercase tracking-widest block mb-1">Strong GDP Growth</span>
                          <span className="text-xs text-white font-medium">Bullish for domestic equities. Indicates strong corporate earnings and consumer spending.</span>
                        </div>
                        <div className="bg-[#0A0A0B] p-3 rounded border border-border">
                          <span className="text-[10px] font-mono text-negative uppercase tracking-widest block mb-1">Negative GDP Growth</span>
                          <span className="text-xs text-white font-medium">Two consecutive quarters indicates a recession. Bearish for equities, bullish for safe-havens (Gold, Bonds).</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>

          {/* Right Sidebar: Waitlist & Premium Upsell */}
          <motion.div variants={item} className="xl:col-span-4 space-y-6">
            
            <div className="glass-card p-6 border border-accent/30 relative overflow-hidden group h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-10 group-hover:bg-accent/20 transition-colors" />
              
              <div>
                <div className="w-12 h-12 bg-surface rounded-xl border border-border flex items-center justify-center mb-6 relative">
                  <Lock className="text-accent" size={20} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-positive rounded-full border-2 border-background"></div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 tracking-tight">AlphaEdge Pro<br/>Macro Terminal</h2>
                
                <p className="text-sm text-foreground-secondary leading-relaxed mb-6">
                  We are finalizing direct fiber connections to global economic data providers. The Live Macro Terminal will feature:
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <ShieldAlert className="text-positive mt-0.5 shrink-0" size={16} />
                    <div>
                      <span className="text-sm font-bold text-white block">Real-Time Economic Calendar</span>
                      <span className="text-xs text-foreground-muted">Live event feeds with actuals vs consensus.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldAlert className="text-positive mt-0.5 shrink-0" size={16} />
                    <div>
                      <span className="text-sm font-bold text-white block">Live Correlation Heatmaps</span>
                      <span className="text-xs text-foreground-muted">Rolling 30-day Pearson matrix across multi-asset classes.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldAlert className="text-positive mt-0.5 shrink-0" size={16} />
                    <div>
                      <span className="text-sm font-bold text-white block">Global Liquidity Tracker</span>
                      <span className="text-xs text-foreground-muted">Central bank balance sheet expansion monitoring.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border/50">
                <h3 className="text-[10px] font-bold font-mono text-accent uppercase tracking-widest mb-3">Join the Beta Waitlist</h3>
                <NewsletterForm />
                <p className="text-[10px] text-foreground-muted mt-3 text-center">
                  Subscribers get early access and discounted pricing.
                </p>
              </div>

            </div>

          </motion.div>
          
        </div>
      </motion.div>
    </PageWrapper>
  );
}
