import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { IndexSymbol, LiveIndexData } from "@/lib/dashboardData";
import Link from "next/link";

interface TickerBarProps {
  items: IndexSymbol[];
  liveData: Record<string, LiveIndexData>;
}

export function TickerBar({ items, liveData }: TickerBarProps) {
  // Combine static symbol info with live data
  const tickerItems = items.map((sym) => {
    const data = liveData[sym.symbol];
    return {
      symbol: sym.symbol,
      name: sym.name,
      value: data?.price?.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || "...",
      pct: data?.changePercent || 0,
    };
  });

  return (
    <div className="bg-surface border-b border-border/50 py-2 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="flex gap-10 whitespace-nowrap animate-ticker w-max pl-6 items-center">
        {/* Double array for seamless marquee loop */}
        {[...tickerItems, ...tickerItems].map((item, i) => {
          const isPositive = item.pct >= 0;
          return (
            <Link
              href={`/chart?s=${item.symbol}`}
              key={`${item.name}-${i}`}
              className="inline-flex gap-2 items-center text-xs group cursor-pointer hover:bg-surface-elevated px-2 py-1 rounded"
            >
              <span className="text-foreground-muted font-medium group-hover:text-foreground-secondary transition-colors">
                {item.name}
              </span>
              <span className="text-foreground font-semibold font-numeric tracking-tight">
                {item.value}
              </span>
              <span
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded font-medium ${
                  isPositive
                    ? "bg-positive/10 text-positive"
                    : "bg-negative/10 text-negative"
                }`}
              >
                {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {Math.abs(item.pct).toFixed(2)}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
