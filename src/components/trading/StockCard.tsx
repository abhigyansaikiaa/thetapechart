import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { StockData } from "@/types/market";

interface StockCardProps {
  data: StockData;
  onClick?: () => void;
}

export function StockCard({ data, onClick }: StockCardProps) {
  const isPositive = data.change >= 0;

  return (
    <div 
      onClick={onClick}
      className="glass-card p-4 flex flex-col gap-2 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-glow"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">
          {data.symbol}
        </h3>
        <div className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${isPositive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
          {isPositive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
          {Math.abs(data.changePercent).toFixed(2)}%
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-2">
        <div>
          <p className="text-xs text-foreground-muted mb-0.5">Price</p>
          <p className="font-numeric text-lg font-semibold">
            ₹{data.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-right">
          <Activity 
            size={24} 
            className={isPositive ? "text-positive opacity-50" : "text-negative opacity-50"} 
          />
        </div>
      </div>
    </div>
  );
}
