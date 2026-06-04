"use client";
import { useState } from "react";
import {
  Landmark,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  BarChart2,
  Calculator,
  Brain,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const STOCK_DATA = {
  RELIANCE: {
    name: "Reliance Industries Ltd",
    sector: "Energy & Conglomerates",
    mcap: "1,983,450",
    pe: 26.4,
    pb: 2.1,
    roe: 9.8,
    roce: 11.2,
    de: 0.34,
    eps: 112.4,
    bvps: 1402.3,
    div_yield: 0.4,
    price: 2943.5,
    change: 1.24,
    week52h: 3024.9,
    week52l: 2220.3,
    income: [
      { yr: "FY20", revenue: 658000, profit: 39354 },
      { yr: "FY21", revenue: 592000, profit: 53739 },
      { yr: "FY22", revenue: 721000, profit: 67845 },
      { yr: "FY23", revenue: 899000, profit: 73670 },
      { yr: "FY24", revenue: 973000, profit: 79020 },
    ],
    fii_holding: [
      { q: "Q1 FY23", val: 24.2 },
      { q: "Q2 FY23", val: 23.8 },
      { q: "Q3 FY23", val: 23.4 },
      { q: "Q4 FY23", val: 23.1 },
      { q: "Q1 FY24", val: 22.8 },
      { q: "Q2 FY24", val: 22.6 },
      { q: "Q3 FY24", val: 22.4 },
      { q: "Q4 FY24", val: 22.3 },
    ],
    about:
      "Reliance Industries Limited is an Indian multinational conglomerate with interests in oil and gas, petrochemicals, retail, digital services, and media. It is the largest company in India by market capitalization. Founded by Dhirubhai Ambani in 1966.",
  },
};

const DEFAULT_DATA = STOCK_DATA.RELIANCE;

export default function FundamentalPage({ params }) {
  const symbol = params?.symbol || "RELIANCE";
  const data = STOCK_DATA[symbol] || DEFAULT_DATA;
  const [tab, setTab] = useState("overview");
  const [dcf, setDcf] = useState({
    growth: "12",
    discount: "10",
    terminal: "5",
  });

  const graham = Math.sqrt(22.5 * parseFloat(data.eps) * parseFloat(data.bvps));
  const dcfGrowth = parseFloat(dcf.growth) / 100;
  const dcfDiscount = parseFloat(dcf.discount) / 100;
  const dcfTerminal = parseFloat(dcf.terminal) / 100;
  const projectedEPS = data.eps * Math.pow(1 + dcfGrowth, 5);
  const terminalValue =
    (projectedEPS * (1 + dcfTerminal)) / (dcfDiscount - dcfTerminal);
  const dcfValue = terminalValue / Math.pow(1 + dcfDiscount, 5);
  const upside = ((dcfValue - data.price) / data.price) * 100;

  const METRICS = [
    { label: "Market Cap", value: `₹${data.mcap}Cr`, note: "Large Cap" },
    {
      label: "P/E Ratio",
      value: data.pe,
      note: data.pe > 30 ? "Premium valued" : "Fair valued",
      color: data.pe > 40 ? "#F59E0B" : "#fff",
    },
    { label: "P/B Ratio", value: data.pb, note: "Price-to-Book" },
    {
      label: "ROE",
      value: `${data.roe}%`,
      note: "Return on Equity",
      color: data.roe > 15 ? "#10B981" : "#A1A1AA",
    },
    {
      label: "ROCE",
      value: `${data.roce}%`,
      note: "Return on Capital Employed",
      color: data.roce > 15 ? "#10B981" : "#A1A1AA",
    },
    {
      label: "Debt/Equity",
      value: data.de,
      note: data.de < 1 ? "Conservative" : "Leveraged",
      color: data.de < 0.5 ? "#10B981" : data.de > 2 ? "#EF4444" : "#F59E0B",
    },
    { label: "EPS (TTM)", value: `₹${data.eps}`, note: "Earnings Per Share" },
    {
      label: "Div Yield",
      value: `${data.div_yield}%`,
      note: "Annual Dividend",
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <Landmark size={20} color="#3B82F6" />
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                margin: 0,
              }}
            >
              {symbol}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                backgroundColor:
                  data.change >= 0
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(239,68,68,0.1)",
                border: `1px solid ${data.change >= 0 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              {data.change >= 0 ? (
                <ArrowUpRight size={13} color="#10B981" />
              ) : (
                <TrendingDown size={13} color="#EF4444" />
              )}
              <span
                style={{
                  fontSize: 12,
                  color: data.change >= 0 ? "#10B981" : "#EF4444",
                  fontWeight: 600,
                }}
              >
                {data.change >= 0 ? "+" : ""}
                {data.change}%
              </span>
            </div>
          </div>
          <div style={{ fontSize: 14, color: "#6B7280" }}>
            {data.name} · {data.sector}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            ₹{data.price.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            52W H: ₹{data.week52h} · L: ₹{data.week52l}
          </div>
        </div>
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
          { id: "overview", label: "Overview" },
          { id: "financials", label: "Financials" },
          { id: "valuation", label: "Valuation" },
          { id: "institutional", label: "Institutional" },
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
              borderBottom: `2px solid ${tab === t.id ? "#3B82F6" : "transparent"}`,
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="card"
                style={{ padding: "14px 16px", borderRadius: 10 }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "#6B7280",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: m.color || "#fff",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: 11, color: "#3f3f46", marginTop: 2 }}>
                  {m.note}
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 24, borderRadius: 12 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 12px",
              }}
            >
              About the Company
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "#A1A1AA",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {data.about}
            </p>
          </div>
        </>
      )}

      {tab === "financials" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 24, borderRadius: 12 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 16px",
              }}
            >
              Revenue & Net Profit (₹ Crore)
            </h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.income}
                  margin={{ top: 0, right: 10, bottom: 0, left: 10 }}
                >
                  <XAxis
                    dataKey="yr"
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1c",
                      border: "1px solid #27272A",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v, name) => [
                      `₹${v.toLocaleString("en-IN")}Cr`,
                      name === "revenue" ? "Revenue" : "Net Profit",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    name="revenue"
                    fill="rgba(59,130,246,0.6)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="profit"
                    name="profit"
                    fill="rgba(16,185,129,0.7)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: 24, borderRadius: 12 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 12px",
              }}
            >
              Revenue Growth Summary
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #27272A" }}>
                  {[
                    "Year",
                    "Revenue (Cr)",
                    "Net Profit (Cr)",
                    "Profit Margin",
                    "YoY Growth",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        fontSize: 11,
                        color: "#6B7280",
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.income.map((row, i) => {
                  const prevRev = data.income[i - 1]?.revenue;
                  const growth = prevRev
                    ? (((row.revenue - prevRev) / prevRev) * 100).toFixed(1)
                    : "N/A";
                  return (
                    <tr
                      key={row.yr}
                      style={{ borderBottom: "1px solid #1f1f21" }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {row.yr}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          color: "#A1A1AA",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        ₹{row.revenue.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          color: "#10B981",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        ₹{row.profit.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          color: "#fff",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {((row.profit / row.revenue) * 100).toFixed(1)}%
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: 13,
                          color:
                            growth !== "N/A" && parseFloat(growth) >= 0
                              ? "#10B981"
                              : "#EF4444",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {growth !== "N/A"
                          ? `${parseFloat(growth) >= 0 ? "+" : ""}${growth}%`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "valuation" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          <div className="card" style={{ padding: 24, borderRadius: 12 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 4px",
              }}
            >
              Graham Number
            </h3>
            <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 20px" }}>
              √(22.5 × EPS × BVPS)
            </p>
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                borderBottom: "1px solid #27272A",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#F59E0B",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                ₹{graham.toFixed(0)}
              </div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
                Intrinsic Value (Graham)
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, color: "#A1A1AA" }}>
                Current Price
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                ₹{data.price.toLocaleString()}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#A1A1AA" }}>
                Margin of Safety
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: graham > data.price ? "#10B981" : "#EF4444",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {graham > data.price
                  ? `+${(((graham - data.price) / data.price) * 100).toFixed(1)}%`
                  : `-${(((data.price - graham) / data.price) * 100).toFixed(1)}% Overvalued`}
              </span>
            </div>
          </div>

          <div className="card" style={{ padding: 24, borderRadius: 12 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 4px",
              }}
            >
              DCF Valuation
            </h3>
            <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 16px" }}>
              Discounted Cash Flow — 5Y projection
            </p>
            {[
              { label: "EPS Growth Rate", key: "growth", suffix: "%" },
              { label: "Discount Rate", key: "discount", suffix: "%" },
              { label: "Terminal Growth", key: "terminal", suffix: "%" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 5,
                    fontWeight: 500,
                  }}
                >
                  {f.label}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={dcf[f.key]}
                    onChange={(e) =>
                      setDcf((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "#0d0d0f",
                      border: "1px solid #27272A",
                      color: "#fff",
                      padding: "8px 36px 8px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
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
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 10,
                backgroundColor:
                  upside > 0 ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${upside > 0 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}
            >
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6 }}>
                DCF FAIR VALUE
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: upside > 0 ? "#10B981" : "#EF4444",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                ₹{dcfValue.toFixed(0)}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: upside > 0 ? "#10B981" : "#EF4444",
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                {upside > 0 ? "↑" : "↓"} {Math.abs(upside).toFixed(1)}%{" "}
                {upside > 0 ? "Upside" : "Downside"}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "institutional" && (
        <div className="card" style={{ padding: 24, borderRadius: 12 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 16px",
            }}
          >
            FII Holding Trend (%)
          </h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.fii_holding}
                margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
              >
                <XAxis
                  dataKey="q"
                  tick={{ fill: "#6B7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1c",
                    border: "1px solid #27272A",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${v}%`, "FII Holding"]}
                />
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              marginTop: 16,
              padding: 14,
              backgroundColor: "rgba(59,130,246,0.06)",
              borderRadius: 10,
              border: "1px solid rgba(59,130,246,0.2)",
              fontSize: 13,
              color: "#A1A1AA",
              lineHeight: 1.7,
            }}
          >
            FII holding has been gradually declining from 24.2% to 22.3% over
            the past 8 quarters. This may suggest institutional profit-booking
            or rebalancing. Watch for reversal of this trend as a potential
            catalyst.
          </div>
        </div>
      )}
    </div>
  );
}
