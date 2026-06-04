import { Trade } from "@/types/trade";
import { ArrowUpRight, ArrowDownRight, Tag } from "lucide-react";

interface TradeCardProps {
  trade: Trade;
  onClick?: () => void;
}

export function TradeCard({ trade, onClick }: TradeCardProps) {
  const isWinner = trade.pnl > 0;
  const isClosed = trade.status === "CLOSED";

  return (
    <div 
      onClick={onClick}
      className="bg-surface-elevated border border-border hover:border-border-subtle p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all cursor-pointer group hover:bg-surface-hover"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            isClosed ? "bg-surface text-foreground-muted" : "bg-accent/10 text-accent border border-accent/20"
          }`}>
            {trade.status}
          </span>
          <span className="text-xs text-foreground-muted">
            {trade.createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
            {trade.symbol}
          </h3>
          <span className="text-xs font-medium text-foreground-secondary px-1.5 py-0.5 bg-surface rounded">
            {trade.instrument}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-foreground-muted">
          <Tag size={12} /> {trade.strategy}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 w-full md:w-auto">
        <div>
          <p className="text-xs text-foreground-muted mb-0.5">Entry</p>
          <p className="font-numeric font-medium text-sm text-white">₹{trade.entry}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-muted mb-0.5">{isClosed ? "Exit" : "Current"}</p>
          <p className="font-numeric font-medium text-sm text-white">₹{trade.exit}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-muted mb-0.5">Size</p>
          <p className="font-numeric font-medium text-sm text-white">{trade.size}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-foreground-muted mb-0.5">P&L</p>
          <p className={`font-numeric font-bold text-sm flex items-center justify-end ${
            isWinner ? "text-positive" : "text-negative"
          }`}>
            {isWinner ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
            ₹{Math.abs(trade.pnl).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}
