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



// ── Index Symbols ──────────────────────────────────

export const INDEX_SYMBOLS: IndexSymbol[] = [
  { symbol: "^NSEI", name: "NIFTY 50", color: "#3B82F6" },
  { symbol: "AAPL", name: "Apple Inc.", color: "#8B5CF6" },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", color: "#F59E0B" },
  { symbol: "EURUSD=X", name: "EUR/USD", color: "#10B981" },
  { symbol: "TSLA", name: "Tesla", color: "#EAB308" },
  { symbol: "RELIANCE.NS", name: "Reliance", color: "#EF4444" },
];



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



// ── India VIX Helpers ─────────────────────────────

export const FEAR_GREED_VALUE = 14.2;

export function getFearColor(v: number): string {
  if (v <= 12) return "#10B981";   // Low VIX = calm = green
  if (v <= 18) return "#F59E0B";   // Moderate = amber
  if (v <= 25) return "#EF4444";   // High = red
  return "#DC2626";                // Extreme = deep red
}

export function getFearLabel(v: number): string {
  if (v <= 12) return "Low Volatility";
  if (v <= 18) return "Moderate";
  if (v <= 25) return "Elevated";
  return "Extreme Volatility";
}

// ── Sparkline Generator ───────────────────────────

export function generateSparkline(basePrice: number, points = 20): { v: number }[] {
  return Array.from({ length: points }, (_, i) => ({
    v: basePrice * (1 + (Math.random() - 0.49) * 0.012 * (i / points)),
  }));
}
