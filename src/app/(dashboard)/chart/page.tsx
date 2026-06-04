"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TradingChart } from "@/components/tools/TradingChart";
import { OrderPanel } from "@/components/tools/OrderPanel";

const SYMBOLS = [
  { symbol: "BTCUSDT", name: "Bitcoin", type: "crypto" },
  { symbol: "ETHUSDT", name: "Ethereum", type: "crypto" },
  { symbol: "RELIANCE.NS", name: "Reliance Ind.", type: "stock" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", type: "stock" },
  { symbol: "EURUSD=X", name: "EUR/USD", type: "forex" },
  { symbol: "GC=F", name: "Gold", type: "forex" },
];

export default function ChartPage() {
  const [activeSymbol, setActiveSymbol] = useState(SYMBOLS[0]);
  const [interval, setInterval] = useState("1m");

  return (
    <PageWrapper>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        {/* Header toolbar */}
        <div className="flex items-center justify-between mb-4 bg-surface-elevated p-2 rounded-xl border border-border">
          <div className="flex items-center gap-2 overflow-x-auto">
            {SYMBOLS.map((sym) => (
              <button
                key={sym.symbol}
                onClick={() => setActiveSymbol(sym)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSymbol.symbol === sym.symbol 
                    ? "bg-accent text-white" 
                    : "text-foreground-secondary hover:bg-surface-hover hover:text-white"
                }`}
              >
                {sym.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {["1m", "5m", "15m", "1h", "1d"].map((int) => (
              <button
                key={int}
                onClick={() => setInterval(int)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold font-mono transition-colors ${
                  interval === int 
                    ? "bg-surface-hover text-white border border-border" 
                    : "text-foreground-muted hover:text-white"
                }`}
              >
                {int}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Chart + Order Panel */}
        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Chart Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <TradingChart 
              symbol={activeSymbol.symbol} 
              assetType={activeSymbol.type as any} 
              interval={interval} 
            />
          </div>

          {/* Paper Trading Panel */}
          <div className="w-[340px] shrink-0 h-full overflow-y-auto">
            <OrderPanel symbol={activeSymbol.symbol} assetType={activeSymbol.type} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
