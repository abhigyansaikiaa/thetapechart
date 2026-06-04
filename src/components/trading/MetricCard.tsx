import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  className = "",
}: MetricCardProps) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-foreground-secondary">{title}</h3>
        {Icon && <Icon size={16} className="text-foreground-muted" />}
      </div>
      
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-numeric">{value}</span>
        {trendValue && (
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-positive"
                : trend === "down"
                ? "text-negative"
                : "text-foreground-muted"
            }`}
          >
            {trend === "up" ? "+" : ""}{trendValue}
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs text-foreground-muted mt-1">{subtitle}</p>
      )}
    </div>
  );
}
