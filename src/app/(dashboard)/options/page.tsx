"use client";

import { useState, useMemo } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Activity, Calculator, RefreshCcw, Info, Settings2, BarChart2 } from "lucide-react";
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

// Math helpers for Black-Scholes
function CND(x: number) {
  const a1 = 0.31938153, a2 = -0.356563782, a3 = 1.781477937, a4 = -1.821255978, a5 = 1.330274429;
  const L = Math.abs(x);
  const K = 1.0 / (1.0 + 0.2316419 * L);
  let w = 1.0 - 1.0 / Math.sqrt(2 * Math.PI) * Math.exp(-L * L / 2) * (a1 * K + a2 * K * K + a3 * Math.pow(K, 3) + a4 * Math.pow(K, 4) + a5 * Math.pow(K, 5));
  if (x < 0) {
    w = 1.0 - w;
  }
  return w;
}

export default function OptionsChainPage() {
  const [spotPrice, setSpotPrice] = useState<number>(22500);
  const [strikePrice, setStrikePrice] = useState<number>(22600);
  const [daysToExpiry, setDaysToExpiry] = useState<number>(7);
  const [volatility, setVolatility] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(7);
  
  // Black-Scholes Calculation
  const { callPrice, putPrice, d1, d2 } = useMemo(() => {
    const S = spotPrice;
    const K = strikePrice;
    const T = Math.max(0.001, daysToExpiry / 365);
    const v = Math.max(0.01, volatility / 100);
    const r = interestRate / 100;

    const _d1 = (Math.log(S / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T));
    const _d2 = _d1 - v * Math.sqrt(T);

    const call = S * CND(_d1) - K * Math.exp(-r * T) * CND(_d2);
    const put = K * Math.exp(-r * T) * CND(-_d2) - S * CND(-_d1);

    return { 
      callPrice: Math.max(0, call), 
      putPrice: Math.max(0, put),
      d1: _d1,
      d2: _d2
    };
  }, [spotPrice, strikePrice, daysToExpiry, volatility, interestRate]);

  // Greeks Approximation
  const T = Math.max(0.001, daysToExpiry / 365);
  const v = Math.max(0.01, volatility / 100);
  const callDelta = CND(d1);
  const putDelta = callDelta - 1;
  const gamma = (Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI)) / (spotPrice * v * Math.sqrt(T));

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
                Live Chain Offline
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3 font-sans">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Activity className="text-accent" size={28} />
              </div>
              Theoretical Options Pricer
            </h1>
            <p className="text-foreground-secondary text-sm max-w-2xl font-mono">
              While live exchange connections are pending, use this Black-Scholes mathematical model to simulate theoretical options prices and Greeks under various market conditions.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md text-sm font-bold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)] font-mono uppercase tracking-wide">
              <Settings2 size={16} /> Advanced Setup
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs */}
          <motion.div variants={item} className="lg:col-span-5 glass-card p-6 border border-border/50 h-fit">
            <h2 className="text-[12px] font-bold font-mono text-white uppercase tracking-widest flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
              <Calculator size={16} className="text-accent" /> Pricing Parameters
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block">Underlying Spot Price (₹)</label>
                <input 
                  type="number" 
                  value={spotPrice} 
                  onChange={(e) => setSpotPrice(Number(e.target.value))}
                  className="w-full bg-[#0A0A0B] border border-border rounded-md px-3 py-2.5 font-numeric text-sm text-white focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block">Strike Price (₹)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={strikePrice} 
                    onChange={(e) => setStrikePrice(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-border rounded-md px-3 py-2.5 font-numeric text-sm text-white focus:outline-none focus:border-accent transition-colors pl-20"
                  />
                  <div className="absolute left-1 top-1 bottom-1 px-3 bg-surface rounded flex items-center justify-center border-r border-border font-mono text-[10px] text-foreground-muted font-bold">
                    {strikePrice > spotPrice ? "OTM Call" : strikePrice < spotPrice ? "ITM Call" : "ATM"}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block flex justify-between">
                  <span>Days to Expiry (DTE)</span>
                  <span className="text-accent">{daysToExpiry} Days</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="90" step="1"
                  value={daysToExpiry} 
                  onChange={(e) => setDaysToExpiry(Number(e.target.value))}
                  className="w-full accent-accent h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block flex justify-between">
                  <span>Implied Volatility (IV %)</span>
                  <span className="text-warning">{volatility}%</span>
                </label>
                <input 
                  type="range" 
                  min="1" max="150" step="1"
                  value={volatility} 
                  onChange={(e) => setVolatility(Number(e.target.value))}
                  className="w-full accent-warning h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-mono text-foreground-secondary uppercase tracking-widest mb-1.5 block flex justify-between">
                  <span>Risk-Free Interest Rate (%)</span>
                  <span className="text-foreground-muted">{interestRate}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="15" step="0.5"
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-foreground-muted h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </motion.div>

          {/* Outputs */}
          <motion.div variants={item} className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Call Option Pricing */}
              <div className="glass-card border border-border/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-positive/5 rounded-full blur-3xl pointer-events-none" />
                <div className="p-4 border-b border-border/50 bg-positive/5 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-positive tracking-widest uppercase">CALL (CE)</span>
                  <span className="text-[10px] bg-background px-2 py-0.5 rounded border border-border font-mono text-foreground-secondary">
                    {strikePrice < spotPrice ? "IN-THE-MONEY" : strikePrice > spotPrice ? "OUT-OF-THE-MONEY" : "AT-THE-MONEY"}
                  </span>
                </div>
                <div className="p-6 flex flex-col items-center text-center">
                  <span className="text-xs font-mono text-foreground-secondary uppercase tracking-widest mb-1">Theoretical Value</span>
                  <div className="text-5xl font-bold font-numeric text-white mb-6">
                    ₹{callPrice.toFixed(2)}
                  </div>
                  
                  <div className="w-full grid grid-cols-2 gap-px bg-border/50 rounded overflow-hidden border border-border/50">
                    <div className="bg-[#0A0A0B] p-3 text-center">
                      <div className="text-[10px] text-foreground-muted font-mono uppercase tracking-widest mb-1">Delta</div>
                      <div className="text-sm font-numeric text-white">{callDelta.toFixed(3)}</div>
                    </div>
                    <div className="bg-[#0A0A0B] p-3 text-center">
                      <div className="text-[10px] text-foreground-muted font-mono uppercase tracking-widest mb-1">Gamma</div>
                      <div className="text-sm font-numeric text-white">{gamma.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Put Option Pricing */}
              <div className="glass-card border border-border/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-negative/5 rounded-full blur-3xl pointer-events-none" />
                <div className="p-4 border-b border-border/50 bg-negative/5 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-negative tracking-widest uppercase">PUT (PE)</span>
                  <span className="text-[10px] bg-background px-2 py-0.5 rounded border border-border font-mono text-foreground-secondary">
                    {strikePrice > spotPrice ? "IN-THE-MONEY" : strikePrice < spotPrice ? "OUT-OF-THE-MONEY" : "AT-THE-MONEY"}
                  </span>
                </div>
                <div className="p-6 flex flex-col items-center text-center">
                  <span className="text-xs font-mono text-foreground-secondary uppercase tracking-widest mb-1">Theoretical Value</span>
                  <div className="text-5xl font-bold font-numeric text-white mb-6">
                    ₹{putPrice.toFixed(2)}
                  </div>
                  
                  <div className="w-full grid grid-cols-2 gap-px bg-border/50 rounded overflow-hidden border border-border/50">
                    <div className="bg-[#0A0A0B] p-3 text-center">
                      <div className="text-[10px] text-foreground-muted font-mono uppercase tracking-widest mb-1">Delta</div>
                      <div className="text-sm font-numeric text-white">{putDelta.toFixed(3)}</div>
                    </div>
                    <div className="bg-[#0A0A0B] p-3 text-center">
                      <div className="text-[10px] text-foreground-muted font-mono uppercase tracking-widest mb-1">Gamma</div>
                      <div className="text-sm font-numeric text-white">{gamma.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Box */}
            <div className="glass-card p-5 border border-border/50 flex gap-4">
              <div className="shrink-0 mt-0.5">
                <Info size={18} className="text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-mono text-white uppercase tracking-widest mb-1">Black-Scholes Model</h4>
                <p className="text-[11px] font-mono text-foreground-secondary leading-relaxed">
                  This calculator uses the standard Black-Scholes-Merton mathematical model to price European options. 
                  Unlike American options (which can be exercised early), these theoretical prices represent the fair value based strictly on volatility, time decay, and the risk-free interest rate.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
