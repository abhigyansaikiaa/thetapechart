"use client";
import { useState } from "react";
import {
  GraduationCap,
  CheckCircle,
  Circle,
  ChevronRight,
  Lock,
  Star,
  BookOpen,
  Target,
  BarChart2,
  Brain,
} from "lucide-react";

const CURRICULUM = [
  {
    id: "foundations",
    title: "Trading Foundations",
    level: "Beginner",
    color: "#10B981",
    icon: BookOpen,
    topics: [
      {
        id: "candles",
        title: "Candlestick Patterns",
        duration: "25 min",
        done: true,
      },
      {
        id: "support",
        title: "Support & Resistance",
        duration: "30 min",
        done: true,
      },
      {
        id: "trends",
        title: "Trend Identification",
        duration: "20 min",
        done: true,
      },
      {
        id: "volume",
        title: "Volume Analysis",
        duration: "25 min",
        done: false,
      },
      {
        id: "indicators",
        title: "Moving Averages & RSI",
        duration: "35 min",
        done: false,
      },
      {
        id: "risk",
        title: "Risk Management Basics",
        duration: "30 min",
        done: false,
      },
    ],
  },
  {
    id: "smc",
    title: "Smart Money Concepts",
    level: "Intermediate",
    color: "#8B5CF6",
    icon: Brain,
    topics: [
      {
        id: "structure",
        title: "Market Structure & BOS",
        duration: "40 min",
        done: true,
      },
      {
        id: "orderblocks",
        title: "Order Blocks",
        duration: "45 min",
        done: false,
      },
      {
        id: "fvg",
        title: "Fair Value Gaps (FVG)",
        duration: "35 min",
        done: false,
      },
      {
        id: "liquidity",
        title: "Liquidity Pools & Sweeps",
        duration: "40 min",
        done: false,
      },
      {
        id: "choch",
        title: "ChoCH & Market Turns",
        duration: "35 min",
        done: false,
      },
      {
        id: "premium",
        title: "Premium & Discount Zones",
        duration: "30 min",
        done: false,
      },
      {
        id: "mitigation",
        title: "Mitigation Blocks",
        duration: "25 min",
        done: false,
      },
    ],
  },
  {
    id: "ict",
    title: "ICT Methodology",
    level: "Intermediate",
    color: "#3B82F6",
    icon: Target,
    topics: [
      {
        id: "killzones",
        title: "ICT Kill Zones",
        duration: "35 min",
        done: false,
      },
      {
        id: "ote",
        title: "Optimal Trade Entry (OTE)",
        duration: "40 min",
        done: false,
      },
      { id: "po3", title: "Power of 3 (AMD)", duration: "45 min", done: false },
      {
        id: "judas",
        title: "Judas Swing & Manipulation",
        duration: "40 min",
        done: false,
      },
      {
        id: "mmm",
        title: "Market Maker Models",
        duration: "50 min",
        done: false,
      },
      {
        id: "silver",
        title: "Silver Bullet Strategy",
        duration: "45 min",
        done: false,
      },
    ],
  },
  {
    id: "wyckoff",
    title: "Wyckoff Method",
    level: "Advanced",
    color: "#F59E0B",
    icon: BarChart2,
    topics: [
      {
        id: "principles",
        title: "Three Wyckoff Laws",
        duration: "30 min",
        done: false,
      },
      {
        id: "accumulation",
        title: "Accumulation Schematic",
        duration: "50 min",
        done: false,
      },
      {
        id: "distribution",
        title: "Distribution Schematic",
        duration: "50 min",
        done: false,
      },
      {
        id: "spring",
        title: "Spring & Upthrust",
        duration: "40 min",
        done: false,
      },
      {
        id: "composite",
        title: "Composite Man Theory",
        duration: "35 min",
        done: false,
      },
    ],
  },
  {
    id: "options",
    title: "Options Trading",
    level: "Intermediate",
    color: "#EC4899",
    icon: BarChart2,
    topics: [
      {
        id: "basics",
        title: "Options Fundamentals",
        duration: "35 min",
        done: false,
      },
      {
        id: "greeks",
        title: "The Greeks (δ γ θ ν)",
        duration: "45 min",
        done: false,
      },
      {
        id: "iv",
        title: "IV Rank & Percentile",
        duration: "30 min",
        done: false,
      },
      {
        id: "strategies",
        title: "Spreads & Multi-Leg Strategies",
        duration: "60 min",
        done: false,
      },
      {
        id: "pcr",
        title: "PCR & Open Interest Analysis",
        duration: "35 min",
        done: false,
      },
      {
        id: "maxpain",
        title: "Max Pain Theory",
        duration: "25 min",
        done: false,
      },
    ],
  },
];

const GLOSSARY = [
  {
    term: "BOS",
    def: "Break of Structure — price breaks a significant swing high or low confirming trend continuation",
  },
  {
    term: "ChoCH",
    def: "Change of Character — the first indication of potential trend reversal; previous swing point broken",
  },
  {
    term: "FVG",
    def: "Fair Value Gap — inefficiency in price where price moved rapidly, leaving an unbalanced area that tends to be revisited",
  },
  {
    term: "OB",
    def: "Order Block — the last opposing candle before a strong displacement move; key institutional entry zone",
  },
  {
    term: "OTE",
    def: "Optimal Trade Entry — Fibonacci 61.8%-79% retracement zone used by ICT traders for precise entry",
  },
  {
    term: "PCR",
    def: "Put-Call Ratio — ratio of put OI to call OI; above 1 suggests bullish sentiment, below 1 bearish",
  },
  {
    term: "Po3",
    def: "Power of 3 — ICT concept: Accumulation → Manipulation → Distribution cycle within each session",
  },
  {
    term: "Premium Zone",
    def: "Price trading above the equilibrium (50% of a range) — typically a selling zone in SMC",
  },
  {
    term: "Discount Zone",
    def: "Price trading below equilibrium — typically a buying zone in SMC methodology",
  },
  {
    term: "Liquidity",
    def: "Clusters of stop-loss orders above swing highs (buy-side) or below swing lows (sell-side)",
  },
];

export default function LearnPage() {
  const [activeModule, setActiveModule] = useState("smc");
  const [tab, setTab] = useState("curriculum");
  const [glossarySearch, setGlossarySearch] = useState("");

  const module = CURRICULUM.find((m) => m.id === activeModule);
  const completedTotal = CURRICULUM.flatMap((m) => m.topics).filter(
    (t) => t.done,
  ).length;
  const totalTopics = CURRICULUM.flatMap((m) => m.topics).length;
  const progress = Math.round((completedTotal / totalTopics) * 100);

  const filteredGlossary = GLOSSARY.filter(
    (g) =>
      !glossarySearch ||
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.def.toLowerCase().includes(glossarySearch.toLowerCase()),
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid #27272A",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ padding: "20px 16px", borderBottom: "1px solid #27272A" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <GraduationCap size={18} color="#3B82F6" />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
              Learning Path
            </span>
          </div>
          {/* Progress */}
          <div
            style={{
              marginBottom: 4,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 11, color: "#6B7280" }}>
              Overall Progress
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#3B82F6",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {progress}%
            </span>
          </div>
          <div
            style={{
              height: 4,
              backgroundColor: "#27272A",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                borderRadius: 4,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>
            {completedTotal}/{totalTopics} lessons
          </div>
        </div>

        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {CURRICULUM.map((m) => {
            const done = m.topics.filter((t) => t.done).length;
            const active = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveModule(m.id);
                  setTab("curriculum");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 14px",
                  margin: "2px 6px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "calc(100% - 12px)",
                  backgroundColor: active
                    ? "rgba(59,130,246,0.1)"
                    : "transparent",
                  borderLeft: `2px solid ${active ? "#3B82F6" : "transparent"}`,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    backgroundColor: `${m.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <m.icon size={14} color={m.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: active ? 600 : 400,
                      color: active ? "#fff" : "#A1A1AA",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {m.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>
                    {done}/{m.topics.length} · {m.level}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid #27272A" }}>
          <button
            onClick={() => setTab("glossary")}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
              backgroundColor:
                tab === "glossary" ? "rgba(59,130,246,0.1)" : "transparent",
              border: `1px solid ${tab === "glossary" ? "#3B82F6" : "#27272A"}`,
              color: tab === "glossary" ? "#3B82F6" : "#A1A1AA",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <BookOpen size={14} /> Trading Glossary
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
        {tab === "glossary" ? (
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 16px",
              }}
            >
              Trading Glossary
            </h2>
            <input
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Search terms..."
              style={{
                width: "100%",
                maxWidth: 380,
                backgroundColor: "#111113",
                border: "1px solid #27272A",
                color: "#fff",
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
                marginBottom: 20,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredGlossary.map((g) => (
                <div
                  key={g.term}
                  className="card"
                  style={{ padding: "16px 20px", borderRadius: 10 }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#3B82F6",
                      marginBottom: 6,
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {g.term}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#A1A1AA", lineHeight: 1.6 }}
                  >
                    <span style={{ color: "#3f3f46", marginRight: 8 }}>-</span>
                    {g.def}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : module ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: `${module.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <module.icon size={18} color={module.color} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {module.title}
                </h1>
                <span
                  style={{ fontSize: 12, color: module.color, fontWeight: 500 }}
                >
                  {module.level} Level
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 20,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  height: 4,
                  flex: 1,
                  backgroundColor: "#27272A",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(module.topics.filter((t) => t.done).length / module.topics.length) * 100}%`,
                    backgroundColor: module.color,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {module.topics.map((topic, i) => (
                <div
                  key={topic.id}
                  className="card"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    {topic.done ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : (
                      <Circle size={20} color="#27272A" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: topic.done ? "#A1A1AA" : "#fff",
                        textDecoration: topic.done ? "line-through" : "none",
                      }}
                    >
                      {topic.title}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                    >
                      {topic.duration}
                    </div>
                  </div>
                  {!topic.done && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        backgroundColor: "#111113",
                        border: "1px solid #27272A",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#3B82F6",
                        fontWeight: 500,
                      }}
                    >
                      Start <ChevronRight size={12} />
                    </div>
                  )}
                  {topic.done && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "#10B981",
                        fontWeight: 500,
                      }}
                    >
                      ✓ Done
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
