"use client";
import { useState } from "react";
import { PieChart, TrendingUp, Calculator, Star } from "lucide-react";

const FUNDS = [
  {
    name: "Mirae Asset Large Cap Fund",
    category: "Large Cap",
    aum: 38420,
    expense: 0.54,
    rating: 5,
    returns: {
      "1m": 2.1,
      "3m": 5.8,
      "6m": 12.4,
      "1y": 28.3,
      "3y": 14.2,
      "5y": 16.8,
    },
    risk: "Moderately High",
    manager: "Neelesh Surana",
  },
  {
    name: "Parag Parikh Flexi Cap Fund",
    category: "Flexi Cap",
    aum: 58340,
    expense: 0.59,
    rating: 5,
    returns: {
      "1m": 1.8,
      "3m": 4.9,
      "6m": 10.8,
      "1y": 24.1,
      "3y": 17.2,
      "5y": 20.4,
    },
    risk: "Moderately High",
    manager: "Rajeev Thakkar",
  },
  {
    name: "SBI Small Cap Fund",
    category: "Small Cap",
    aum: 28950,
    expense: 0.69,
    rating: 4,
    returns: {
      "1m": 3.2,
      "3m": 8.4,
      "6m": 18.2,
      "1y": 42.8,
      "3y": 28.4,
      "5y": 31.2,
    },
    risk: "Very High",
    manager: "R Srinivasan",
  },
  {
    name: "HDFC Mid-Cap Opportunities",
    category: "Mid Cap",
    aum: 64280,
    expense: 0.74,
    rating: 4,
    returns: {
      "1m": 2.8,
      "3m": 7.1,
      "6m": 16.3,
      "1y": 38.4,
      "3y": 22.8,
      "5y": 24.1,
    },
    risk: "High",
    manager: "Chirag Setalvad",
  },
  {
    name: "Axis Bluechip Fund",
    category: "Large Cap",
    aum: 31240,
    expense: 0.48,
    rating: 3,
    returns: {
      "1m": 1.4,
      "3m": 3.8,
      "6m": 9.2,
      "1y": 18.4,
      "3y": 11.2,
      "5y": 14.8,
    },
    risk: "Moderately High",
    manager: "Shreyash Devalkar",
  },
  {
    name: "Quant Small Cap Fund",
    category: "Small Cap",
    aum: 22380,
    expense: 0.64,
    rating: 5,
    returns: {
      "1m": 4.1,
      "3m": 10.2,
      "6m": 22.4,
      "1y": 58.3,
      "3y": 38.4,
      "5y": 42.1,
    },
    risk: "Very High",
    manager: "Ankit Pande",
  },
];

const CATEGORIES = [
  "All",
  "Large Cap",
  "Mid Cap",
  "Small Cap",
  "Flexi Cap",
  "ELSS",
];

const RISK_COLORS = {
  Low: "#10B981",
  "Moderately Low": "#3B82F6",
  Moderate: "#F59E0B",
  "Moderately High": "#F97316",
  High: "#EF4444",
  "Very High": "#9333EA",
};

export default function MFPage() {
  const [tab, setTab] = useState("funds");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("1y");
  const [sip, setSip] = useState({
    monthly: "5000",
    rate: "14",
    years: "10",
    target: "",
  });

  const filtered = FUNDS.filter(
    (f) => category === "All" || f.category === category,
  ).sort((a, b) => b.returns[sortBy] - a.returns[sortBy]);

  const n = parseFloat(sip.years) * 12;
  const r = parseFloat(sip.rate) / 100 / 12;
  const corpus =
    parseFloat(sip.monthly) * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = parseFloat(sip.monthly) * n;
  const gains = corpus - invested;

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 24,
        }}
      >
        <PieChart size={20} color="#8B5CF6" />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
          Mutual Funds & SIP Planner
        </h1>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid #27272A",
          marginBottom: 24,
        }}
      >
        {[
          { id: "funds", label: "Fund Explorer" },
          { id: "sip", label: "SIP Calculator" },
          { id: "goals", label: "Goal Tracker" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? "#fff" : "#6B7280",
              borderBottom: `2px solid ${tab === t.id ? "#8B5CF6" : "transparent"}`,
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "funds" && (
        <>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    cursor: "pointer",
                    backgroundColor: category === c ? "#8B5CF6" : "#111113",
                    border: `1px solid ${category === c ? "#8B5CF6" : "#27272A"}`,
                    color: category === c ? "#fff" : "#A1A1AA",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "#6B7280" }}>Sort by:</span>
              {["1m", "3m", "6m", "1y", "3y", "5y"].map((p) => (
                <button
                  key={p}
                  onClick={() => setSortBy(p)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: "pointer",
                    backgroundColor: sortBy === p ? "#8B5CF6" : "#111113",
                    border: `1px solid ${sortBy === p ? "#8B5CF6" : "#27272A"}`,
                    color: sortBy === p ? "#fff" : "#A1A1AA",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((fund) => (
              <div
                key={fund.name}
                className="card"
                style={{ padding: "18px 20px", borderRadius: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}
                      >
                        {fund.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: "#8B5CF6",
                          backgroundColor: "rgba(139,92,246,0.1)",
                          padding: "2px 8px",
                          borderRadius: 10,
                          border: "1px solid rgba(139,92,246,0.2)",
                          fontWeight: 500,
                        }}
                      >
                        {fund.category}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: RISK_COLORS[fund.risk] || "#A1A1AA",
                          backgroundColor: `${RISK_COLORS[fund.risk]}15`,
                          padding: "2px 8px",
                          borderRadius: 10,
                        }}
                      >
                        {fund.risk}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {fund.manager} · AUM: ₹{(fund.aum / 100).toFixed(0)}Cr ·
                      Expense: {fund.expense}%
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          color={i < fund.rating ? "#F59E0B" : "#27272A"}
                          fill={i < fund.rating ? "#F59E0B" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, auto)",
                      gap: "4px 20px",
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {[
                      ["1Y", "1y"],
                      ["3Y", "3y"],
                      ["5Y", "5y"],
                    ].map(([label, key]) => (
                      <div key={key}>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#6B7280",
                            marginBottom: 2,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#10B981",
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        >
                          +{fund.returns[key]}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "sip" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          <div className="card" style={{ padding: 28, borderRadius: 14 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 24px",
              }}
            >
              SIP Calculator
            </h2>
            {[
              { label: "Monthly SIP Amount", key: "monthly", prefix: "₹" },
              { label: "Expected Annual Return", key: "rate", suffix: "%" },
              { label: "Investment Duration", key: "years", suffix: "yrs" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 500,
                  }}
                >
                  {f.label}
                </label>
                <div style={{ position: "relative" }}>
                  {f.prefix && (
                    <span
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6B7280",
                        fontSize: 13,
                      }}
                    >
                      {f.prefix}
                    </span>
                  )}
                  <input
                    type="number"
                    value={sip[f.key]}
                    onChange={(e) =>
                      setSip((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "#0d0d0f",
                      border: "1px solid #27272A",
                      color: "#fff",
                      padding: `10px ${f.suffix ? "40px" : "12px"} 10px ${f.prefix ? "28px" : "12px"}`,
                      borderRadius: 8,
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                  {f.suffix && (
                    <span
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6B7280",
                        fontSize: 12,
                      }}
                    >
                      {f.suffix}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div
              style={{
                backgroundColor: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 14,
                padding: 28,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#10B981",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  marginBottom: 10,
                }}
              >
                PROJECTED CORPUS
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 800,
                  color: "#10B981",
                  fontFamily: "JetBrains Mono, monospace",
                  marginBottom: 8,
                }}
              >
                ₹{(corpus / 100000).toFixed(2)}L
              </div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                After {sip.years} years at {sip.rate}% annual return
              </div>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  {
                    label: "Amount Invested",
                    value: `₹${(invested / 100000).toFixed(2)}L`,
                  },
                  {
                    label: "Wealth Gained",
                    value: `₹${(gains / 100000).toFixed(2)}L`,
                    color: "#10B981",
                  },
                  {
                    label: "Return Multiple",
                    value: `${(corpus / invested).toFixed(2)}x`,
                    color: "#3B82F6",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#A1A1AA" }}>
                      {r.label}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: r.color || "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual pie representation */}
            <div className="card" style={{ padding: 20, borderRadius: 12 }}>
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Wealth Composition
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ position: "relative", width: 80, height: 80 }}>
                  <svg viewBox="0 0 80 80" width="80" height="80">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="#1f1f21"
                      strokeWidth="12"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="12"
                      strokeDasharray={`${(gains / corpus) * 220} 220`}
                      strokeDashoffset="55"
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="12"
                      strokeDasharray={`${(invested / corpus) * 220} 220`}
                      strokeDashoffset={55 + (gains / corpus) * 220}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {[
                    {
                      color: "#3B82F6",
                      label: "Invested",
                      pct: Math.round((invested / corpus) * 100),
                    },
                    {
                      color: "#10B981",
                      label: "Gains",
                      pct: Math.round((gains / corpus) * 100),
                    },
                  ].map((l) => (
                    <div
                      key={l.label}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          backgroundColor: l.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13, color: "#A1A1AA" }}>
                        {l.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: l.color,
                          marginLeft: "auto",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {l.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "goals" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              name: "Retirement Corpus",
              target: 5,
              current: 0.8,
              years: 25,
              color: "#8B5CF6",
              monthly: 25000,
            },
            {
              name: "Child's Education",
              target: 0.8,
              current: 0.12,
              years: 12,
              color: "#3B82F6",
              monthly: 8000,
            },
            {
              name: "House Down Payment",
              target: 0.5,
              current: 0.18,
              years: 5,
              color: "#10B981",
              monthly: 15000,
            },
            {
              name: "Emergency Fund",
              target: 0.06,
              current: 0.04,
              years: 1,
              color: "#F59E0B",
              monthly: 20000,
            },
          ].map((goal) => {
            const pct = Math.round((goal.current / goal.target) * 100);
            return (
              <div
                key={goal.name}
                className="card"
                style={{ padding: 20, borderRadius: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    {goal.name}
                  </h3>
                  <span
                    style={{ fontSize: 12, color: goal.color, fontWeight: 600 }}
                  >
                    {pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    backgroundColor: "#27272A",
                    borderRadius: 4,
                    marginBottom: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      backgroundColor: goal.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    ₹{goal.current}Cr saved
                  </span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    Target: ₹{goal.target}Cr
                  </span>
                </div>
                <div
                  style={{ fontSize: 11, color: "#A1A1AA", marginBottom: 8 }}
                >
                  {goal.years} years · SIP ₹{goal.monthly.toLocaleString()}/mo
                </div>
                <button
                  style={{
                    width: "100%",
                    fontSize: 12,
                    padding: "8px",
                    borderRadius: 8,
                    backgroundColor: `${goal.color}15`,
                    border: `1px solid ${goal.color}30`,
                    color: goal.color,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Adjust Goal
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
