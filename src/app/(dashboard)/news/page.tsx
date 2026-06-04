import { Newspaper, Rss, Clock } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Newspaper className="text-accent" size={28} />
            </div>
            Algorithmic News & Sentiment
          </h1>
          <p className="text-foreground-secondary text-sm max-w-2xl">
            Real-time macroeconomic feeds, central bank announcements, and institutional sentiment analysis.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-elevated hover:bg-surface-hover border border-border rounded-md text-sm font-medium transition-colors">
          <Rss size={16} /> Live Feed Active
        </button>
      </div>

      {/* News Grid Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="flex justify-between items-center text-xs text-foreground-muted font-mono">
              <span className="text-accent bg-accent/10 px-2 py-1 rounded">MACRO</span>
              <span className="flex items-center gap-1"><Clock size={12} /> Just now</span>
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-2">
              Federal Reserve Signals Potential Rate Adjustments Amidst Rising Core PCE Data
            </h3>
            <p className="text-sm text-foreground-secondary line-clamp-3">
              Institutional sentiment remains divided as the latest inflation metrics suggest a hotter-than-expected economy. Smart money flows indicate a shift towards defensive sectors...
            </p>
            <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-sm">
              <span className="text-foreground-muted">Reuters Financial</span>
              <span className="text-positive font-medium">Impact: High</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
