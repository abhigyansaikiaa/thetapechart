"use client";

import { useAutoTradingStore } from "@/lib/store/autoTradingStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Power, Settings2, ShieldAlert, Cpu } from "lucide-react";

export default function BotConfigPage() {
  const { isAutoTrading, botProfile, strategy, toggleAutoTrade, updateProfile, updateStrategy } = useAutoTradingStore();

  return (
    <PageWrapper>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Bot className="w-8 h-8 text-accent" /> AI Auto-Trading Matrix
          </h1>
          <p className="text-foreground-secondary">Configure technical strategies and provide a Machine Learning profile for autonomous simulated execution.</p>
        </div>
        
        {/* Master Switch */}
        <button
          onClick={toggleAutoTrade}
          className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 border-2 ${
            isAutoTrading 
              ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
              : "bg-surface border-border text-foreground-muted hover:border-accent/50"
          }`}
        >
          <Power className={`w-6 h-6 ${isAutoTrading ? "text-[#10B981] animate-pulse" : ""}`} />
          {isAutoTrading ? "AUTO-TRADING ACTIVE" : "BOT OFFLINE"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ML Profile Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#0A0A0B] border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cpu className="text-accent w-5 h-5" /> Machine Learning Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground-secondary mb-4">
                "Teach" the bot how to trade. This text is fed into Gemini to guide discretionary decisions and risk evaluations when the bot scans live market data. Be specific about your methodologies (e.g., SMC, ICT, Wyckoff).
              </p>
              <textarea
                value={botProfile}
                onChange={(e) => updateProfile(e.target.value)}
                className="w-full h-40 bg-[#111113] border border-border rounded-xl p-4 text-white font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none"
                placeholder="e.g. I trade ICT concepts. Look for buys after sell-side liquidity is swept below the Asian session low..."
              />
            </CardContent>
          </Card>

          {/* Technical Strategy Builder */}
          <Card className="bg-[#0A0A0B] border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings2 className="text-[#3B82F6] w-5 h-5" /> Technical Strategy Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {/* SMA Crossover Block */}
                <div className="p-4 bg-surface rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">SMA Crossover</h4>
                      <p className="text-xs text-foreground-muted">Buy when Fast SMA crosses above Slow SMA</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={strategy.useSMA} onChange={(e) => updateStrategy({ useSMA: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-elevated rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 opacity-100 transition-opacity" style={{ opacity: strategy.useSMA ? 1 : 0.4 }}>
                    <div>
                      <label className="text-xs text-foreground-secondary mb-1 block">Fast Period</label>
                      <input type="number" value={strategy.smaPeriod1} onChange={(e) => updateStrategy({ smaPeriod1: parseInt(e.target.value) })} disabled={!strategy.useSMA} className="w-full bg-[#111113] border border-border rounded-lg px-3 py-2 text-white font-mono text-sm outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-secondary mb-1 block">Slow Period</label>
                      <input type="number" value={strategy.smaPeriod2} onChange={(e) => updateStrategy({ smaPeriod2: parseInt(e.target.value) })} disabled={!strategy.useSMA} className="w-full bg-[#111113] border border-border rounded-lg px-3 py-2 text-white font-mono text-sm outline-none" />
                    </div>
                  </div>
                </div>

                {/* RSI Block */}
                <div className="p-4 bg-surface rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">RSI Reversal</h4>
                      <p className="text-xs text-foreground-muted">Filter trades using Relative Strength Index extremes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={strategy.useRSI} onChange={(e) => updateStrategy({ useRSI: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-elevated rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 transition-opacity" style={{ opacity: strategy.useRSI ? 1 : 0.4 }}>
                    <div>
                      <label className="text-xs text-foreground-secondary mb-1 block">Oversold Threshold (Buy)</label>
                      <input type="number" value={strategy.rsiOversold} onChange={(e) => updateStrategy({ rsiOversold: parseInt(e.target.value) })} disabled={!strategy.useRSI} className="w-full bg-[#111113] border border-border rounded-lg px-3 py-2 text-white font-mono text-sm outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-secondary mb-1 block">Overbought Threshold (Sell)</label>
                      <input type="number" value={strategy.rsiOverbought} onChange={(e) => updateStrategy({ rsiOverbought: parseInt(e.target.value) })} disabled={!strategy.useRSI} className="w-full bg-[#111113] border border-border rounded-lg px-3 py-2 text-white font-mono text-sm outline-none" />
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Management Side Panel */}
        <div className="space-y-6">
          <Card className="bg-[#0A0A0B] border-border sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="text-[#EF4444] w-5 h-5" /> Risk Protocol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-foreground-secondary mb-1 block">Max Risk per Trade (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={strategy.maxRiskPerTradePercent} 
                      onChange={(e) => updateStrategy({ maxRiskPerTradePercent: parseFloat(e.target.value) })}
                      className="w-full bg-[#111113] border border-border rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-[#EF4444]" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">%</span>
                  </div>
                  <p className="text-[10px] text-foreground-muted mt-1">Bot will adjust position size (quantity) to never exceed this risk on a stop loss hit.</p>
                </div>
                
                <div>
                  <label className="text-xs text-foreground-secondary mb-1 block">Max Daily Loss Cutoff</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">$</span>
                    <input 
                      type="number" 
                      value={strategy.maxDailyLoss} 
                      onChange={(e) => updateStrategy({ maxDailyLoss: parseFloat(e.target.value) })}
                      className="w-full bg-[#111113] border border-border rounded-lg pl-8 pr-3 py-2 text-white font-mono text-sm outline-none focus:border-[#EF4444]" 
                    />
                  </div>
                  <p className="text-[10px] text-foreground-muted mt-1">If the bot loses this much in paper trading, it halts execution.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </PageWrapper>
  );
}
