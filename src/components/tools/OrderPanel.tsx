"use client";

import { useState } from "react";
import { useTradingStore } from "@/lib/store/tradingStore";
import { TrendingUp, TrendingDown, DollarSign, Target, ShieldAlert, CheckCircle2 } from "lucide-react";

interface OrderPanelProps {
  symbol: string;
  assetType: string;
}

export function OrderPanel({ symbol, assetType }: OrderPanelProps) {
  const { balance, openTrade, trades, closeTrade } = useTradingStore();
  const [entry, setEntry] = useState("");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const [qty, setQty] = useState("");

  const activeTrades = trades.filter((t) => t.status === "Open");

  const [isEvaluating, setIsEvaluating] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const handleExecute = async (direction: "Long" | "Short") => {
    if (!entry || !sl || !tp || !qty) {
      setErrorMsg("All fields are required to execute a simulated trade.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setErrorMsg("");
    setIsEvaluating(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      openTrade({
        symbol,
        direction,
        entryPrice: parseFloat(entry),
        stopLoss: parseFloat(sl),
        takeProfit: parseFloat(tp),
        quantity: parseFloat(qty),
      });

      setEntry(""); setSl(""); setTp(""); setQty("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden">
      {/* Account Balance Header */}
      <div className="p-4 border-b border-border bg-surface-elevated">
        <p className="text-xs text-foreground-muted font-bold tracking-widest uppercase mb-1">Paper Balance</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white font-mono">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance)}
          </span>
        </div>
      </div>

      {/* Order Entry Form */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div>
          <label className="text-xs text-foreground-secondary font-bold mb-1.5 block">Entry Price</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted w-4 h-4" />
            <input 
              type="number" 
              value={entry} 
              onChange={(e) => setEntry(e.target.value)}
              className="w-full bg-[#111113] border border-border rounded-lg pl-9 pr-4 py-2 text-white font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-negative font-bold mb-1.5 flex items-center gap-1"><ShieldAlert size={12}/> Stop Loss</label>
            <input 
              type="number" 
              value={sl} 
              onChange={(e) => setSl(e.target.value)}
              className="w-full bg-[#111113] border border-border rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-negative focus:ring-1 focus:ring-negative outline-none transition-all"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-xs text-positive font-bold mb-1.5 flex items-center gap-1"><Target size={12}/> Take Profit</label>
            <input 
              type="number" 
              value={tp} 
              onChange={(e) => setTp(e.target.value)}
              className="w-full bg-[#111113] border border-border rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-positive focus:ring-1 focus:ring-positive outline-none transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-foreground-secondary font-bold mb-1.5 block">Quantity / Lots</label>
          <input 
            type="number" 
            value={qty} 
            onChange={(e) => setQty(e.target.value)}
            className="w-full bg-[#111113] border border-border rounded-lg px-3 py-2 text-white font-mono text-sm outline-none transition-all"
            placeholder="1"
          />
        </div>

        {/* Action Buttons */}
        {errorMsg && <p className="text-xs text-negative font-bold">{errorMsg}</p>}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={() => handleExecute("Long")}
            disabled={isEvaluating}
            className="bg-positive/10 border border-positive/20 hover:bg-positive hover:text-white text-positive font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isEvaluating ? <span className="animate-spin">⚡</span> : <TrendingUp size={16} />} Buy Long
          </button>
          <button 
            onClick={() => handleExecute("Short")}
            disabled={isEvaluating}
            className="bg-negative/10 border border-negative/20 hover:bg-negative hover:text-white text-negative font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isEvaluating ? <span className="animate-spin">⚡</span> : <TrendingDown size={16} />} Sell Short
          </button>
        </div>

        {/* Active Positions */}
        {activeTrades.length > 0 && (
          <div className="pt-6">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-accent" /> Active Positions
            </h4>
            <div className="space-y-2">
              {activeTrades.map(trade => (
                <div key={trade.id} className="bg-[#111113] border border-border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${trade.direction === 'Long' ? 'bg-positive/20 text-positive' : 'bg-negative/20 text-negative'}`}>
                      {trade.direction}
                    </span>
                    <span className="text-xs font-mono text-foreground-secondary">{trade.quantity} Units</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-foreground-muted">ENTRY</p>
                      <p className="text-sm font-mono text-white">{trade.entryPrice}</p>
                    </div>
                    <button 
                      onClick={() => closeTrade(trade.id, trade.entryPrice + 10)} // Mock exit price for now
                      className="text-xs bg-surface hover:bg-surface-elevated border border-border px-3 py-1 rounded transition-colors text-white"
                    >
                      Close Position
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
