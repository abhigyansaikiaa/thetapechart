"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  RefreshCw,
  Brain,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const INDEX_SYMBOLS = [
  { symbol: "^NSEI", name: "NIFTY 50", color: "#3B82F6" },
  { symbol: "^BSESN", name: "SENSEX", color: "#8B5CF6" },
  { symbol: "^NSEBANK", name: "BANKNIFTY", color: "#F59E0B" },
  { symbol: "^CNXIT", name: "NIFTY IT", color: "#10B981" },
  { symbol: "GC=F", name: "Gold", color: "#EAB308" },
  { symbol: "CL=F", name: "Crude Oil", color: "#EF4444" },
];

const STATIC_SECTORS = [
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

const FII_DII = [
  { date: "Mon", fii: 1243, dii: -432 },
  { date: "Tue", fii: -892, dii: 1102 },
  { date: "Wed", fii: 2341, dii: 876 },
  { date: "Thu", fii: -543, dii: 1234 },
  { date: "Fri", fii: 1892, dii: 654 },
];

const GAINERS = [
  { symbol: "HDFCLIFE", price: 743.5, change: 4.82 },
  { symbol: "SBILIFE", price: 1542.3, change: 3.91 },
  { symbol: "TATAMOTORS", price: 987.65, change: 3.45 },
  { symbol: "JSWSTEEL", price: 921.1, change: 2.98 },
  { symbol: "TECHM", price: 1832.45, change: 2.73 },
];

const LOSERS = [
  { symbol: "ONGC", price: 234.7, change: -2.84 },
  { symbol: "COALINDIA", price: 451.25, change: -2.31 },
  { symbol: "NTPC", price: 362.8, change: -1.94 },
  { symbol: "POWERGRID", price: 312.4, change: -1.72 },
  { symbol: "GAIL", price: 198.35, change: -1.58 },
];

const EVENTS = [
  { date: "Today", event: "RBI MPC Minutes Release", impact: "high" },
  { date: "Jun 4", event: "US ISM Manufacturing PMI", impact: "medium" },
  { date: "Jun 7", event: "US NFP Non-Farm Payrolls", impact: "high" },
  { date: "Jun 12", event: "US CPI Inflation Data", impact: "high" },
  { date: "Jun 18", event: "SEBI Board Meeting", impact: "medium" },
];

function IndexCard({ sym, liveData, delay }) {
  const d = liveData?.[sym.symbol];
  const pct = d?.changePercent ?? 0;
  const positive = pct >= 0;
  const clr = positive ? "#10B981" : "#EF4444";
  const spark = Array.from({ length: 20 }, (_, i) => ({
    v: (d?.price || 10000) * (1 + (Math.random() - 0.49) * 0.012 * (i / 20)),
  }));

  return (
    <div
      className="card"
      style={{
        padding: "14px 16px",
        borderRadius: 12,
        animation: `fadeInUp 0.4s ease ${delay}s forwards`,
        opacity: 0,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: "#6B7280",
              marginBottom: 4,
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            {sym.name}
          </div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "-0.5px",
            }}
          >
            {d?.price ? (
              d.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })
            ) : (
              <span
                style={{
                  display: "inline-block",
                  width: 80,
                  height: 20,
                  borderRadius: 4,
                  background:
                    "linear-gradient(90deg,#1a1a1c 25%,#222 50%,#1a1a1c 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            )}
          </div>
        </div>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: positive
              ? "rgba(16,185,129,0.1)"
              : "rgba(239,68,68,0.1)",
            color: clr,
            padding: "3px 8px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {d ? Math.abs(pct).toFixed(2) + "%" : "—"}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: clr,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 600,
          }}
        >
          {d?.change != null
            ? (positive ? "+" : "") + d.change.toFixed(2)
            : "—"}
        </span>
        {d && (
          <div style={{ height: 36, width: 88 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={spark}
                margin={{ top: 1, right: 0, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id={`g${sym.symbol.replace(/[^a-z]/gi, "")}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={clr} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={clr} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={clr}
                  fill={`url(#g${sym.symbol.replace(/[^a-z]/gi, "")})`}
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function TradeSuggestionCard({ s, i }) {
  const [expanded, setExpanded] = useState(false);
  const dirColor = s.direction === "Long" ? "#10B981" : "#EF4444";
  const confColor =
    s.confidence >= 75 ? "#10B981" : s.confidence >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div
      style={{
        backgroundColor: "#111113",
        border: "1px solid #27272A",
        borderRadius: 12,
        overflow: "hidden",
        animation: `fadeInUp 0.4s ease ${i * 0.1}s forwards`,
        opacity: 0,
        transition: "border-color 0.15s",
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: "14px 16px", cursor: "pointer" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: `${dirColor}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${dirColor}25`,
              }}
            >
              {s.direction === "Long" ? (
                <TrendingUp size={16} color={dirColor} />
              ) : (
                <TrendingDown size={16} color={dirColor} />
              )}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
                  {s.symbol}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: "#6B7280",
                    backgroundColor: "#1a1a1c",
                    padding: "2px 6px",
                    borderRadius: 6,
                    border: "1px solid #27272A",
                  }}
                >
                  {s.instrument}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: dirColor,
                    backgroundColor: `${dirColor}12`,
                    padding: "2px 6px",
                    borderRadius: 6,
                  }}
                >
                  {s.direction}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>
                {s.strategy} · {s.setup}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: confColor,
                fontFamily: "JetBrains Mono,monospace",
              }}
            >
              {s.confidence}%
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#6B7280",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              CONFIDENCE
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 6,
            marginTop: 12,
          }}
        >
          {[
            { label: "ENTRY", value: s.entry, color: "#3B82F6" },
            { label: "SL", value: s.stop_loss, color: "#EF4444" },
            { label: "TP1", value: s.target1, color: "#10B981" },
            { label: "R:R", value: `1:${s.rr_ratio}`, color: "#F59E0B" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: "#0d0d0f",
                borderRadius: 6,
                padding: "6px 8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  color: "#6B7280",
                  fontWeight: 700,
                  marginBottom: 2,
                  letterSpacing: "0.06em",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: item.color,
                  fontFamily: "JetBrains Mono,monospace",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      {expanded && (
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #1f1f21",
            backgroundColor: "#0d0d0f",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 5,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 10,
                backgroundColor: "rgba(59,130,246,0.1)",
                color: "#3B82F6",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {s.timeframe}
            </span>
            {s.validity && (
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 10,
                  backgroundColor: "rgba(245,158,11,0.1)",
                  color: "#F59E0B",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                Valid: {s.validity}
              </span>
            )}
            {s.key_level && (
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 10,
                  backgroundColor: "rgba(139,92,246,0.1)",
                  color: "#8B5CF6",
                  border: "1px solid rgba(139,92,246,0.2)",
                }}
              >
                Key: {s.key_level}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#D1D5DB",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {s.rationale}
          </p>
        </div>
      )}
    </div>
  );
}

function TickerBar({ items }) {
  return (
    <div
      style={{
        backgroundColor: "#0d0d0f",
        borderBottom: "1px solid #1f1f21",
        padding: "7px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          whiteSpace: "nowrap",
          animation: "ticker 35s linear infinite",
          width: "max-content",
          paddingLeft: 24,
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ color: "#6B7280", fontWeight: 500 }}>
              {item.name}
            </span>
            <span
              style={{
                color: "#fff",
                fontFamily: "JetBrains Mono,monospace",
                fontWeight: 600,
              }}
            >
              {item.value}
            </span>
            <span
              style={{
                color: item.pct >= 0 ? "#10B981" : "#EF4444",
                fontSize: 10,
              }}
            >
              {item.pct >= 0 ? "▲" : "▼"} {Math.abs(item.pct).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const upd = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
      );
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);

  const {
    data: liveData,
    isLoading: loadingBatch,
    refetch,
  } = useQuery({
    queryKey: ["batch-indices"],
    queryFn: async () => {
      const res = await fetch("/api/market-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols: INDEX_SYMBOLS.map((s) => s.symbol) }),
      });
      if (!res.ok) throw new Error("Failed");
      const arr = await res.json();
      const map = {};
      arr.forEach((item) => {
        if (item) map[item.symbol] = item;
      });
      return map;
    },
    refetchInterval: 30000,
    staleTime: 25000,
  });

  const { data: suggestions, isLoading: loadingSugg } = useQuery({
    queryKey: ["trade-suggestions"],
    queryFn: async () => {
      const res = await fetch("/api/trade-suggestions");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 1000 * 60 * 15,
    retry: 1,
  });

  const tickerItems = INDEX_SYMBOLS.map((sym) => {
    const d = liveData?.[sym.symbol];
    return {
      name: sym.name,
      value: d
        ? d.price?.toLocaleString("en-IN", { maximumFractionDigits: 2 })
        : "...",
      pct: d?.changePercent ?? 0,
    };
  });

  const fearGreed = 62;
  const getFearColor = (v) =>
    v <= 25
      ? "#EF4444"
      : v <= 45
        ? "#F59E0B"
        : v <= 55
          ? "#A1A1AA"
          : v <= 75
            ? "#10B981"
            : "#3B82F6";
  const getFearLabel = (v) =>
    v <= 25
      ? "Extreme Fear"
      : v <= 45
        ? "Fear"
        : v <= 55
          ? "Neutral"
          : v <= 75
            ? "Greed"
            : "Extreme Greed";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0B" }}>
      <TickerBar items={tickerItems} />

      <div style={{ padding: "20px 24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#fff",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              Market Overview
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                marginTop: 4,
                margin: "4px 0 0",
              }}
            >
              Wednesday, 27 May 2026 ·{" "}
              <span
                style={{
                  fontFamily: "JetBrains Mono,monospace",
                  color: "#10B981",
                }}
              >
                {time} IST
              </span>
              {loadingBatch && (
                <span
                  style={{ marginLeft: 10, fontSize: 11, color: "#6B7280" }}
                >
                  · Fetching live prices...
                </span>
              )}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href="/analyze"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(135deg,#8B5CF6,#3B82F6)",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(139,92,246,0.25)",
              }}
            >
              <Brain size={14} /> AI Analyze
            </a>
            <button
              onClick={() => refetch()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#111113",
                border: "1px solid #27272A",
                color: "#A1A1AA",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Live Indices */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {INDEX_SYMBOLS.map((sym, i) => (
            <IndexCard
              key={sym.symbol}
              sym={sym}
              liveData={liveData}
              delay={i * 0.06}
            />
          ))}
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* AI Trade Suggestions */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: "linear-gradient(135deg,#8B5CF6,#3B82F6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Zap size={14} color="#fff" />
                </div>
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  AI Trade Suggestions
                </h2>
                {suggestions?.market_bias && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 10,
                      backgroundColor:
                        suggestions.market_bias === "Bullish"
                          ? "rgba(16,185,129,0.1)"
                          : suggestions.market_bias === "Bearish"
                            ? "rgba(239,68,68,0.1)"
                            : "rgba(161,161,170,0.1)",
                      color:
                        suggestions.market_bias === "Bullish"
                          ? "#10B981"
                          : suggestions.market_bias === "Bearish"
                            ? "#EF4444"
                            : "#A1A1AA",
                    }}
                  >
                    {suggestions.market_bias}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 11, color: "#3f3f46" }}>
                AI-generated · Not financial advice
              </span>
            </div>

            {suggestions?.market_summary && (
              <div
                style={{
                  backgroundColor: "rgba(59,130,246,0.04)",
                  border: "1px solid rgba(59,130,246,0.12)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: "#A1A1AA",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {suggestions.market_summary}
                </p>
              </div>
            )}

            {loadingSugg && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="shimmer"
                    style={{ height: 100, borderRadius: 12 }}
                  />
                ))}
              </div>
            )}

            {suggestions?.suggestions && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {suggestions.suggestions.map((s, i) => (
                  <TradeSuggestionCard key={s.id || i} s={s} i={i} />
                ))}
              </div>
            )}

            {suggestions?.avoid && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 10,
                  backgroundColor: "rgba(239,68,68,0.04)",
                  border: "1px solid rgba(239,68,68,0.12)",
                  marginTop: 10,
                }}
              >
                <AlertTriangle
                  size={14}
                  color="#EF4444"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#EF4444",
                      fontWeight: 700,
                      marginBottom: 2,
                      letterSpacing: "0.06em",
                    }}
                  >
                    AVOID TODAY
                  </div>
                  <div style={{ fontSize: 13, color: "#A1A1AA" }}>
                    {suggestions.avoid}
                  </div>
                </div>
              </div>
            )}

            {!loadingSugg && !suggestions && (
              <div
                style={{
                  padding: "32px",
                  textAlign: "center",
                  backgroundColor: "#111113",
                  border: "1px solid #27272A",
                  borderRadius: 12,
                }}
              >
                <Brain size={36} color="#27272A" style={{ marginBottom: 12 }} />
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#3f3f46",
                    marginBottom: 6,
                  }}
                >
                  Generating AI suggestions...
                </div>
                <div style={{ fontSize: 12, color: "#27272A" }}>
                  Analyzing live market data with Claude AI
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Sector Heatmap */}
            <div className="card" style={{ padding: 16, borderRadius: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <h2
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Sector Heatmap
                </h2>
                <span style={{ fontSize: 10, color: "#6B7280" }}>NSE</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 5,
                }}
              >
                {STATIC_SECTORS.map((sec) => {
                  const intensity = Math.min(Math.abs(sec.change) / 3, 1);
                  const bg =
                    sec.change >= 0
                      ? `rgba(16,185,129,${0.07 + intensity * 0.3})`
                      : `rgba(239,68,68,${0.07 + intensity * 0.3})`;
                  const clr = sec.change >= 0 ? "#10B981" : "#EF4444";
                  return (
                    <div
                      key={sec.name}
                      style={{
                        backgroundColor: bg,
                        borderRadius: 7,
                        padding: "8px 10px",
                        textAlign: "center",
                        border: `1px solid ${clr}15`,
                      }}
                    >
                      <div
                        style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}
                      >
                        {sec.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: clr,
                          marginTop: 2,
                          fontFamily: "JetBrains Mono,monospace",
                          fontWeight: 600,
                        }}
                      >
                        {sec.change >= 0 ? "+" : ""}
                        {sec.change.toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FII/DII */}
            <div className="card" style={{ padding: 16, borderRadius: 12 }}>
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  margin: "0 0 12px",
                }}
              >
                FII / DII Flow
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(59,130,246,0.06)",
                    borderRadius: 8,
                    padding: 10,
                    border: "1px solid rgba(59,130,246,0.15)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#6B7280",
                      marginBottom: 4,
                      fontWeight: 700,
                    }}
                  >
                    FII NET
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#10B981",
                      fontFamily: "JetBrains Mono,monospace",
                    }}
                  >
                    +₹1,892Cr
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "rgba(139,92,246,0.06)",
                    borderRadius: 8,
                    padding: 10,
                    border: "1px solid rgba(139,92,246,0.15)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#6B7280",
                      marginBottom: 4,
                      fontWeight: 700,
                    }}
                  >
                    DII NET
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#10B981",
                      fontFamily: "JetBrains Mono,monospace",
                    }}
                  >
                    +₹654Cr
                  </div>
                </div>
              </div>
              <div style={{ height: 72 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={FII_DII}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#6B7280", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1c",
                        border: "1px solid #27272A",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                      formatter={(v) => [`₹${v}Cr`]}
                    />
                    <Area
                      type="monotone"
                      dataKey="fii"
                      stroke="#3B82F6"
                      fill="rgba(59,130,246,0.08)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="dii"
                      stroke="#8B5CF6"
                      fill="rgba(139,92,246,0.08)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fear & Greed */}
            <div className="card" style={{ padding: 16, borderRadius: 12 }}>
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  margin: "0 0 12px",
                }}
              >
                Fear & Greed Index
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 60,
                    height: 60,
                    flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 60 60" width="60" height="60">
                    <circle
                      cx="30"
                      cy="30"
                      r="24"
                      fill="none"
                      stroke="#1f1f21"
                      strokeWidth="6"
                    />
                    <circle
                      cx="30"
                      cy="30"
                      r="24"
                      fill="none"
                      stroke={getFearColor(fearGreed)}
                      strokeWidth="6"
                      strokeDasharray={`${fearGreed * 1.508} 150.8`}
                      strokeDashoffset="37.7"
                      strokeLinecap="round"
                      transform="rotate(-90 30 30)"
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: getFearColor(fearGreed),
                        fontFamily: "JetBrains Mono,monospace",
                      }}
                    >
                      {fearGreed}
                    </span>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: getFearColor(fearGreed),
                    }}
                  >
                    {getFearLabel(fearGreed)}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                    India Market
                  </div>
                </div>
              </div>
              <h3
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#6B7280",
                  margin: "0 0 8px",
                  letterSpacing: "0.06em",
                }}
              >
                UPCOMING EVENTS
              </h3>
              {EVENTS.map((ev, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "5px 0",
                    borderBottom:
                      i < EVENTS.length - 1 ? "1px solid #1f1f21" : "none",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      marginTop: 6,
                      backgroundColor:
                        ev.impact === "high" ? "#EF4444" : "#F59E0B",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#6B7280",
                        fontWeight: 600,
                      }}
                    >
                      {ev.date}
                    </div>
                    <div style={{ fontSize: 11, color: "#D1D5DB" }}>
                      {ev.event}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gainers / Losers / Quick Nav */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 12,
          }}
        >
          <div
            className="card"
            style={{ padding: "16px 18px", borderRadius: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h2
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Top Gainers
              </h2>
              <TrendingUp size={13} color="#10B981" />
            </div>
            {GAINERS.map((s) => (
              <div
                key={s.symbol}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #1f1f21",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
                    {s.symbol}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6B7280",
                      fontFamily: "JetBrains Mono,monospace",
                    }}
                  >
                    ₹{s.price}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#10B981",
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono,monospace",
                  }}
                >
                  +{s.change}%
                </span>
              </div>
            ))}
          </div>

          <div
            className="card"
            style={{ padding: "16px 18px", borderRadius: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h2
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Top Losers
              </h2>
              <TrendingDown size={13} color="#EF4444" />
            </div>
            {LOSERS.map((s) => (
              <div
                key={s.symbol}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #1f1f21",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
                    {s.symbol}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6B7280",
                      fontFamily: "JetBrains Mono,monospace",
                    }}
                  >
                    ₹{s.price}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#EF4444",
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono,monospace",
                  }}
                >
                  {s.change}%
                </span>
              </div>
            ))}
          </div>

          <div
            className="card"
            style={{
              padding: "16px 18px",
              borderRadius: 12,
              gridColumn: "span 2",
            }}
          >
            <h2
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#fff",
                margin: "0 0 12px",
              }}
            >
              Quick Access
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
              }}
            >
              {[
                {
                  href: "/journal",
                  emoji: "📒",
                  label: "Trade Journal",
                  desc: "Log trades",
                },
                {
                  href: "/screener",
                  emoji: "🔍",
                  label: "Screener",
                  desc: "Filter stocks",
                },
                {
                  href: "/options",
                  emoji: "⚡",
                  label: "Options Chain",
                  desc: "F&O analysis",
                },
                {
                  href: "/watchlist",
                  emoji: "⭐",
                  label: "Watchlist",
                  desc: "Track stocks",
                },
                {
                  href: "/macro",
                  emoji: "🌐",
                  label: "Macro Data",
                  desc: "Economy",
                },
                {
                  href: "/learn",
                  emoji: "🎓",
                  label: "Learn SMC/ICT",
                  desc: "Education",
                },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    backgroundColor: "#0d0d0f",
                    border: "1px solid #1f1f21",
                    borderRadius: 10,
                    padding: "10px 12px",
                    textDecoration: "none",
                    display: "block",
                    transition: "border-color 0.15s",
                  }}
                >
                  <div style={{ fontSize: 16, marginBottom: 4 }}>
                    {item.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#fff",
                      marginBottom: 1,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>
                    {item.desc}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}
