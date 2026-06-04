"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Clock,
  RefreshCw,
  Filter,
  Search,
} from "lucide-react";

const MOCK_NEWS = [
  {
    id: 1,
    title:
      "RBI keeps repo rate unchanged at 6.5%, maintains accommodative stance withdrawal",
    source: "Economic Times",
    time: "2 hours ago",
    category: "Macro",
    sentiment: "neutral",
    sentimentScore: 52,
    stocks: ["HDFC", "ICICIBANK", "SBIBANK"],
    url: "#",
    summary:
      "The Reserve Bank of India maintained its key policy rate unchanged for the sixth consecutive meeting, signaling caution amid global uncertainty.",
  },
  {
    id: 2,
    title:
      "Tata Motors Q4 results: Net profit surges 222% YoY on strong JLR performance",
    source: "Mint",
    time: "4 hours ago",
    category: "Earnings",
    sentiment: "bullish",
    sentimentScore: 87,
    stocks: ["TATAMOTORS", "TATAGROUP"],
    url: "#",
    summary:
      "Tata Motors reported exceptional quarterly results with JLR division contributing significantly to the bottom line recovery.",
  },
  {
    id: 3,
    title:
      "FII outflows continue for third consecutive session amid dollar strength",
    source: "CNBC-TV18",
    time: "5 hours ago",
    category: "FII/DII",
    sentiment: "bearish",
    sentimentScore: 28,
    stocks: ["NIFTY", "SENSEX"],
    url: "#",
    summary:
      "Foreign institutional investors sold equities worth ₹2,847 crore on Thursday as the dollar index strengthened.",
  },
  {
    id: 4,
    title:
      "Reliance Industries to invest ₹75,000 crore in green energy over next 3 years",
    source: "Business Standard",
    time: "6 hours ago",
    category: "Corporate",
    sentiment: "bullish",
    sentimentScore: 79,
    stocks: ["RELIANCE"],
    url: "#",
    summary:
      "Reliance Industries announced a massive green energy investment plan targeting net zero carbon by 2035.",
  },
  {
    id: 5,
    title:
      "SEBI tightens F&O rules: New margin requirements from June 1, position limits reduced",
    source: "Moneycontrol",
    time: "8 hours ago",
    category: "Regulatory",
    sentiment: "bearish",
    sentimentScore: 31,
    stocks: ["NSE", "NIFTY"],
    url: "#",
    summary:
      "Market regulator SEBI announced stricter margin requirements for futures and options trading effective next month.",
  },
  {
    id: 6,
    title:
      "IT sector earnings preview: TCS, Infy Q1 expected to show recovery in deal wins",
    source: "ET Markets",
    time: "10 hours ago",
    category: "Sector",
    sentiment: "bullish",
    sentimentScore: 68,
    stocks: ["TCS", "INFY", "WIPRO", "TECHM"],
    url: "#",
    summary:
      "Analysts expect IT bellwethers to report improved deal signings in the June quarter driven by AI-related projects.",
  },
  {
    id: 7,
    title:
      "HDFC Bank sees record credit card spends in April; NPA ratio improves sequentially",
    source: "Reuters",
    time: "12 hours ago",
    category: "Banking",
    sentiment: "bullish",
    sentimentScore: 74,
    stocks: ["HDFCBANK"],
    url: "#",
    summary:
      "HDFC Bank reported record credit card spending data while asset quality continued to improve.",
  },
  {
    id: 8,
    title:
      "US Fed minutes signal two rate cuts possible in 2025 if inflation cools",
    source: "Bloomberg",
    time: "1 day ago",
    category: "Global",
    sentiment: "bullish",
    sentimentScore: 63,
    stocks: ["NIFTY", "IT", "METALS"],
    url: "#",
    summary:
      "Federal Reserve meeting minutes revealed committee members open to two rate reductions contingent on inflation data.",
  },
];

const CATEGORIES = [
  "All",
  "Macro",
  "Earnings",
  "FII/DII",
  "Corporate",
  "Regulatory",
  "Sector",
  "Banking",
  "Global",
];

function SentimentBadge({ sentiment, score }) {
  const configs = {
    bullish: {
      color: "#10B981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.3)",
      icon: TrendingUp,
      label: "Bullish",
    },
    bearish: {
      color: "#EF4444",
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.3)",
      icon: TrendingDown,
      label: "Bearish",
    },
    neutral: {
      color: "#A1A1AA",
      bg: "rgba(161,161,170,0.1)",
      border: "rgba(161,161,170,0.3)",
      icon: Minus,
      label: "Neutral",
    },
  };
  const config = configs[sentiment] || configs.neutral;
  const Icon = config.icon;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 20,
        padding: "3px 10px",
      }}
    >
      <Icon size={11} color={config.color} />
      <span style={{ fontSize: 11, color: config.color, fontWeight: 500 }}>
        {config.label}
      </span>
      <span
        style={{
          fontSize: 10,
          color: config.color,
          opacity: 0.8,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {score}
      </span>
    </div>
  );
}

export default function NewsPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_NEWS.filter((n) => {
    if (category !== "All" && n.category !== category) return false;
    if (
      search &&
      !n.title.toLowerCase().includes(search.toLowerCase()) &&
      !n.stocks.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    )
      return false;
    return true;
  });

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
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
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 4px",
            }}
          >
            Market Intelligence
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            AI-curated news with sentiment analysis · Updated live
          </p>
        </div>
        <button
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
            cursor: "pointer",
          }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Sentiment Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Bullish News",
            count: MOCK_NEWS.filter((n) => n.sentiment === "bullish").length,
            color: "#10B981",
            bg: "rgba(16,185,129,0.06)",
          },
          {
            label: "Bearish News",
            count: MOCK_NEWS.filter((n) => n.sentiment === "bearish").length,
            color: "#EF4444",
            bg: "rgba(239,68,68,0.06)",
          },
          {
            label: "Neutral News",
            count: MOCK_NEWS.filter((n) => n.sentiment === "neutral").length,
            color: "#A1A1AA",
            bg: "rgba(161,161,170,0.06)",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: s.bg,
              border: `1px solid ${s.color}20`,
              borderRadius: 12,
              padding: "14px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#A1A1AA" }}>{s.label}</span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: s.color,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {s.count}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <Search
            size={13}
            color="#6B7280"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news or symbol..."
            style={{
              backgroundColor: "#111113",
              border: "1px solid #27272A",
              color: "#fff",
              padding: "8px 12px 8px 30px",
              borderRadius: 8,
              fontSize: 13,
              outline: "none",
              width: 220,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 12,
                cursor: "pointer",
                backgroundColor: category === c ? "#3B82F6" : "#111113",
                border: `1px solid ${category === c ? "#3B82F6" : "#27272A"}`,
                color: category === c ? "#fff" : "#A1A1AA",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((article) => (
          <div
            key={article.id}
            className="card"
            style={{ padding: "18px 20px", borderRadius: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#6B7280",
                      backgroundColor: "#1f1f21",
                      padding: "2px 8px",
                      borderRadius: 10,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {article.category.toUpperCase()}
                  </span>
                  <SentimentBadge
                    sentiment={article.sentiment}
                    score={article.sentimentScore}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Clock size={10} /> {article.time}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#fff",
                    margin: "0 0 8px",
                    lineHeight: 1.5,
                  }}
                >
                  {article.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    margin: "0 0 10px",
                    lineHeight: 1.6,
                  }}
                >
                  {article.summary}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: "#A1A1AA", fontWeight: 500 }}
                  >
                    {article.source}
                  </span>
                  {article.stocks.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 11,
                        color: "#3B82F6",
                        backgroundColor: "rgba(59,130,246,0.1)",
                        padding: "1px 7px",
                        borderRadius: 8,
                        border: "1px solid rgba(59,130,246,0.2)",
                      }}
                    >
                      #{s}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={article.url}
                style={{
                  flexShrink: 0,
                  color: "#6B7280",
                  display: "flex",
                  alignItems: "center",
                  padding: 4,
                }}
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
