// ─────────────────────────────────────────────────
// Dashboard Data Layer
// All types & static/mock data for the market dashboard
// Replace mock data with API calls when ready
// ─────────────────────────────────────────────────

export interface IndexSymbol {
  symbol: string;
  name: string;
  color: string;
}

export interface LiveIndexData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface SectorItem {
  name: string;
  change: number;
}

export interface FiiDiiDay {
  date: string;
  fii: number;
  dii: number;
}

export interface GainerLoser {
  symbol: string;
  price: number;
  change: number;
}

export interface MarketEvent {
  date: string;
  event: string;
  impact: "high" | "medium" | "low";
}

export interface TradeSuggestion {
  id: string;
  symbol: string;
  instrument: string;
  direction: "Long" | "Short";
  strategy: string;
  setup: string;
  confidence: number;
  entry: number;
  stop_loss: number;
  target1: number;
  rr_ratio: number;
  timeframe: string;
  validity?: string;
  key_level?: string;
  rationale: string;
}

export interface TradeSuggestionResponse {
  market_bias: "Bullish" | "Bearish" | "Neutral";
  market_summary: string;
  suggestions: TradeSuggestion[];
  avoid?: string;
}

export interface QuickAccessItem {
  href: string;
  emoji: string;
  label: string;
  desc: string;
}

// ── Index Symbols ──────────────────────────────────

export const INDEX_SYMBOLS: IndexSymbol[] = [
  { symbol: "^NSEI", name: "NIFTY 50", color: "#3B82F6" },
  { symbol: "^BSESN", name: "SENSEX", color: "#8B5CF6" },
  { symbol: "^NSEBANK", name: "BANKNIFTY", color: "#F59E0B" },
  { symbol: "^CNXIT", name: "NIFTY IT", color: "#10B981" },
  { symbol: "GC=F", name: "Gold", color: "#EAB308" },
  { symbol: "CL=F", name: "Crude Oil", color: "#EF4444" },
];

// ── Mock Live Data ─────────────────────────────────

export const MOCK_LIVE_DATA: Record<string, LiveIndexData> = {
  "^NSEI": { symbol: "^NSEI", price: 24856.75, change: 187.30, changePercent: 0.76 },
  "^BSESN": { symbol: "^BSESN", price: 81742.50, change: 542.15, changePercent: 0.67 },
  "^NSEBANK": { symbol: "^NSEBANK", price: 53412.00, change: -245.80, changePercent: -0.46 },
  "^CNXIT": { symbol: "^CNXIT", price: 38920.45, change: 312.60, changePercent: 0.81 },
  "GC=F": { symbol: "GC=F", price: 2648.30, change: 18.40, changePercent: 0.70 },
  "CL=F": { symbol: "CL=F", price: 78.54, change: -1.23, changePercent: -1.54 },
};

// ── Sector Data ────────────────────────────────────

export const STATIC_SECTORS: SectorItem[] = [
  { name: "IT", change: 1.24 },
  { name: "Banking", change: -0.35 },
  { name: "FMCG", change: 0.67 },
  { name: "Auto", change: 1.89 },
  { name: "Pharma", change: 0.43 },
  { name: "Metal", change: -1.12 },
  { name: "Realty", change: 2.31 },
  { name: "Energy", change: -0.78 },
  { name: "Media", change: 0.92 },
  { name: "Infra", change: 0.31 },
];

// ── FII / DII Flow ────────────────────────────────

export const FII_DII: FiiDiiDay[] = [
  { date: "Mon", fii: 1243, dii: -432 },
  { date: "Tue", fii: -892, dii: 1102 },
  { date: "Wed", fii: 2341, dii: 876 },
  { date: "Thu", fii: -543, dii: 1234 },
  { date: "Fri", fii: 1892, dii: 654 },
];

// ── Top Gainers / Losers ──────────────────────────

export const GAINERS: GainerLoser[] = [
  { symbol: "HDFCLIFE", price: 743.50, change: 4.82 },
  { symbol: "SBILIFE", price: 1542.30, change: 3.91 },
  { symbol: "TATAMOTORS", price: 987.65, change: 3.45 },
  { symbol: "JSWSTEEL", price: 921.10, change: 2.98 },
  { symbol: "TECHM", price: 1832.45, change: 2.73 },
];

export const LOSERS: GainerLoser[] = [
  { symbol: "ONGC", price: 234.70, change: -2.84 },
  { symbol: "COALINDIA", price: 451.25, change: -2.31 },
  { symbol: "NTPC", price: 362.80, change: -1.94 },
  { symbol: "POWERGRID", price: 312.40, change: -1.72 },
  { symbol: "GAIL", price: 198.35, change: -1.58 },
];

// ── Events ────────────────────────────────────────

export const EVENTS: MarketEvent[] = [
  { date: "Today", event: "RBI MPC Minutes Release", impact: "high" },
  { date: "Jun 4", event: "US ISM Manufacturing PMI", impact: "medium" },
  { date: "Jun 7", event: "US NFP Non-Farm Payrolls", impact: "high" },
  { date: "Jun 12", event: "US CPI Inflation Data", impact: "high" },
  { date: "Jun 18", event: "SEBI Board Meeting", impact: "medium" },
];

// ── Mock AI Trade Suggestions ─────────────────────

export const MOCK_SUGGESTIONS: TradeSuggestionResponse = {
  market_bias: "Bullish",
  market_summary: "Markets are showing strong momentum with NIFTY breaking above key resistance at 24,800. FII inflows remain positive for the 5th consecutive session. IT and Auto sectors leading the rally while metals face headwinds from global commodity correction. Watch for RBI MPC minutes release today — could add volatility in the afternoon session.",
  suggestions: [
    {
      id: "ts-1",
      symbol: "RELIANCE",
      instrument: "EQ",
      direction: "Long",
      strategy: "Breakout Retest",
      setup: "Bullish Order Block",
      confidence: 82,
      entry: 2945,
      stop_loss: 2912,
      target1: 3010,
      rr_ratio: 1.97,
      timeframe: "4H",
      validity: "2-3 sessions",
      key_level: "2940 OB",
      rationale: "Price retested the 4H bullish order block at 2940 zone after sweeping Monday's low. Displacement candle confirmed with rising volume. FII delivery data shows consistent accumulation. Target aligns with previous swing high and weekly FVG."
    },
    {
      id: "ts-2",
      symbol: "INFY",
      instrument: "EQ",
      direction: "Long",
      strategy: "Fair Value Gap",
      setup: "FVG + BOS",
      confidence: 76,
      entry: 1445,
      stop_loss: 1422,
      target1: 1495,
      rr_ratio: 2.17,
      timeframe: "1D",
      validity: "3-5 sessions",
      key_level: "1440 FVG",
      rationale: "Daily FVG at 1440-1445 zone with bullish break of structure. IT sector showing relative strength. DII buying in large-cap IT names. Strong earnings outlook supports the setup."
    },
    {
      id: "ts-3",
      symbol: "BANKNIFTY",
      instrument: "FUT",
      direction: "Short",
      strategy: "Premium Sweep",
      setup: "Liquidity Grab + MSS",
      confidence: 68,
      entry: 53500,
      stop_loss: 53720,
      target1: 53100,
      rr_ratio: 1.82,
      timeframe: "15M",
      validity: "Intraday",
      rationale: "BANKNIFTY swept buy-side liquidity above 53,450 Asian session high. Market structure shift on 15M with bearish displacement. Banking sector showing divergence with broader market strength. Options data indicates heavy call writing at 53,500 strike."
    },
    {
      id: "ts-4",
      symbol: "TATAMOTORS",
      instrument: "EQ",
      direction: "Long",
      strategy: "Demand Zone",
      setup: "Institutional Accumulation",
      confidence: 74,
      entry: 985,
      stop_loss: 965,
      target1: 1025,
      rr_ratio: 2.0,
      timeframe: "1D",
      validity: "5-7 sessions",
      key_level: "980 Demand",
      rationale: "Tata Motors sitting at a strong weekly demand zone with institutional accumulation visible in delivery percentage data. Auto sector rotation play with EV narrative support. Volume profile shows value area low providing support."
    }
  ],
  avoid: "Avoid aggressive positioning in metals and PSU banking stocks ahead of RBI minutes. ONGC, COALINDIA showing distribution patterns on higher timeframes."
};

// ── Quick Access ──────────────────────────────────

export const QUICK_ACCESS: QuickAccessItem[] = [
  { href: "/journal", emoji: "📒", label: "Trade Journal", desc: "Log & track trades" },
  { href: "/screener", emoji: "🔍", label: "Screener", desc: "Filter stocks" },
  { href: "/options", emoji: "⚡", label: "Options Chain", desc: "F&O analysis" },
  { href: "/watchlist", emoji: "⭐", label: "Watchlist", desc: "Track stocks" },
  { href: "/macro", emoji: "🌐", label: "Macro Data", desc: "Economy" },
  { href: "/learn", emoji: "🎓", label: "Learn SMC/ICT", desc: "Education" },
];

// ── Fear & Greed Helpers ──────────────────────────

export const FEAR_GREED_VALUE = 62;

export function getFearColor(v: number): string {
  if (v <= 25) return "#EF4444";
  if (v <= 45) return "#F59E0B";
  if (v <= 55) return "#A1A1AA";
  if (v <= 75) return "#10B981";
  return "#3B82F6";
}

export function getFearLabel(v: number): string {
  if (v <= 25) return "Extreme Fear";
  if (v <= 45) return "Fear";
  if (v <= 55) return "Neutral";
  if (v <= 75) return "Greed";
  return "Extreme Greed";
}

// ── Sparkline Generator ───────────────────────────

export function generateSparkline(basePrice: number, points = 20): { v: number }[] {
  return Array.from({ length: points }, (_, i) => ({
    v: basePrice * (1 + (Math.random() - 0.49) * 0.012 * (i / points)),
  }));
}
