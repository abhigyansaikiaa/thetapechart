"use client";
import { useState } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const EXPIRIES = ["29 May 2026", "05 Jun 2026", "26 Jun 2026", "24 Jul 2026"];

function generateChain(spot, strikes) {
  return strikes.map((strike) => {
    const diff = (strike - spot) / spot;
    const atm = Math.abs(diff) < 0.01;
    const itmCall = strike < spot;
    const itmPut = strike > spot;
    const vol = 0.15 + Math.abs(diff) * 0.5;
    const callIV = (vol * 100 + (Math.random() - 0.5) * 3).toFixed(1);
    const putIV = (vol * 100 + (Math.random() - 0.5) * 3).toFixed(1);
    const callOI = Math.floor(
      (itmCall ? 80000 : atm ? 250000 : 150000) * (1 + Math.random() * 0.3),
    );
    const putOI = Math.floor(
      (itmPut ? 80000 : atm ? 280000 : 160000) * (1 + Math.random() * 0.3),
    );
    const callPrice = itmCall
      ? spot - strike + 20
      : Math.max(5, 200 * Math.exp((-0.5 * diff * diff) / (vol * vol)));
    const putPrice = itmPut
      ? strike - spot + 20
      : Math.max(5, 200 * Math.exp((-0.5 * diff * diff) / (vol * vol)));
    return {
      strike,
      callIV,
      putIV,
      callOI,
      putOI,
      callPrice: callPrice.toFixed(2),
      putPrice: putPrice.toFixed(2),
      callDelta: itmCall ? 0.9 : atm ? 0.5 : 0.2,
      putDelta: itmPut ? -0.9 : atm ? -0.5 : -0.2,
      callTheta: -(Math.random() * 3 + 1).toFixed(2),
      putTheta: -(Math.random() * 3 + 1).toFixed(2),
      isATM: atm,
      isITMCall: itmCall,
      isITMPut: itmPut,
    };
  });
}

const NIFTY_SPOT = 24563;
const NIFTY_STRIKES = [
  24000, 24100, 24200, 24300, 24400, 24500, 24550, 24600, 24650, 24700, 24750,
  24800, 24900, 25000, 25100, 25200,
];
const CHAIN = generateChain(NIFTY_SPOT, NIFTY_STRIKES);

const MAX_PAIN = 24600;
const PCR = 0.87;
const TOTAL_CALL_OI = CHAIN.reduce((s, r) => s + r.callOI, 0);
const TOTAL_PUT_OI = CHAIN.reduce((s, r) => s + r.putOI, 0);

export default function OptionsPage() {
  const [symbol, setSymbol] = useState("NIFTY");
  const [expiry, setExpiry] = useState(EXPIRIES[0]);
  const [tab, setTab] = useState("chain");

  const oiChartData = NIFTY_STRIKES.map((s) => {
    const row = CHAIN.find((r) => r.strike === s);
    return {
      strike: s,
      callOI: Math.round(row.callOI / 1000),
      putOI: Math.round(row.putOI / 1000),
    };
  });

  const tabs = ["chain", "oi-analysis", "strategy"];

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
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
            <Activity size={20} color="#3B82F6" />
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              Options Chain
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            F&O data · Open Interest · Greeks · Strategy Builder
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["NIFTY", "BANKNIFTY", "FINNIFTY"].map((s) => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
                fontWeight: symbol === s ? 600 : 400,
                backgroundColor: symbol === s ? "#3B82F6" : "#111113",
                border: `1px solid ${symbol === s ? "#3B82F6" : "#27272A"}`,
                color: symbol === s ? "#fff" : "#A1A1AA",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "SPOT",
            value: `₹${NIFTY_SPOT.toLocaleString()}`,
            color: "#fff",
          },
          {
            label: "PCR",
            value: PCR.toFixed(2),
            color: PCR > 1 ? "#10B981" : PCR < 0.8 ? "#EF4444" : "#F59E0B",
            sub: PCR > 1 ? "Bullish signal" : "Bearish signal",
          },
          {
            label: "MAX PAIN",
            value: `₹${MAX_PAIN.toLocaleString()}`,
            color: "#F59E0B",
          },
          {
            label: "TOTAL CALL OI",
            value: `${(TOTAL_CALL_OI / 100000).toFixed(1)}L`,
            color: "#EF4444",
          },
          {
            label: "TOTAL PUT OI",
            value: `${(TOTAL_PUT_OI / 100000).toFixed(1)}L`,
            color: "#10B981",
          },
          {
            label: "INDIA VIX",
            value: "13.82",
            color: "#A1A1AA",
            sub: "↓ 3.01%",
          },
        ].map((m) => (
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
                letterSpacing: "0.05em",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: m.color,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {m.value}
            </div>
            {m.sub && (
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                {m.sub}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Expiry + Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {EXPIRIES.map((e) => (
            <button
              key={e}
              onClick={() => setExpiry(e)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                backgroundColor: expiry === e ? "#111113" : "transparent",
                border: `1px solid ${expiry === e ? "#3B82F6" : "#27272A"}`,
                color: expiry === e ? "#fff" : "#6B7280",
              }}
            >
              {e}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "chain", label: "Option Chain" },
            { id: "oi-analysis", label: "OI Analysis" },
            { id: "strategy", label: "Strategy" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
                fontWeight: tab === t.id ? 600 : 400,
                backgroundColor:
                  tab === t.id ? "rgba(59,130,246,0.1)" : "transparent",
                border: `1px solid ${tab === t.id ? "#3B82F6" : "#27272A"}`,
                color: tab === t.id ? "#3B82F6" : "#A1A1AA",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* OI Chart */}
      {tab === "oi-analysis" && (
        <div
          className="card"
          style={{ padding: 20, borderRadius: 12, marginBottom: 16 }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              margin: "0 0 16px",
            }}
          >
            Call vs Put OI Distribution (in Lots × 1000)
          </h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={oiChartData}
                margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
              >
                <XAxis
                  dataKey="strike"
                  tick={{ fill: "#6B7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1c",
                    border: "1px solid #27272A",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <ReferenceLine
                  x={NIFTY_SPOT}
                  stroke="#3B82F6"
                  strokeDasharray="4 4"
                  label={{ value: "Spot", fill: "#3B82F6", fontSize: 11 }}
                />
                <ReferenceLine
                  x={MAX_PAIN}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{ value: "Max Pain", fill: "#F59E0B", fontSize: 11 }}
                />
                <Bar
                  dataKey="callOI"
                  name="Call OI"
                  fill="#EF4444"
                  opacity={0.7}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="putOI"
                  name="Put OI"
                  fill="#10B981"
                  opacity={0.7}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
            {[
              { color: "#EF4444", label: "Call OI (Resistance)" },
              { color: "#10B981", label: "Put OI (Support)" },
            ].map((l) => (
              <div
                key={l.label}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: l.color,
                  }}
                />
                <span style={{ fontSize: 12, color: "#6B7280" }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options Chain Table */}
      {tab === "chain" && (
        <div className="card" style={{ borderRadius: 12, overflow: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #27272A" }}>
                <th
                  colSpan="5"
                  style={{
                    padding: "10px 16px",
                    textAlign: "center",
                    fontSize: 12,
                    color: "#EF4444",
                    fontWeight: 700,
                    borderRight: "2px solid #27272A",
                    backgroundColor: "rgba(239,68,68,0.04)",
                  }}
                >
                  CALLS
                </th>
                <th
                  style={{
                    padding: "10px 16px",
                    textAlign: "center",
                    fontSize: 12,
                    color: "#6B7280",
                    fontWeight: 700,
                    backgroundColor: "rgba(59,130,246,0.06)",
                    borderLeft: "1px solid #27272A",
                    borderRight: "1px solid #27272A",
                  }}
                >
                  STRIKE
                </th>
                <th
                  colSpan="5"
                  style={{
                    padding: "10px 16px",
                    textAlign: "center",
                    fontSize: 12,
                    color: "#10B981",
                    fontWeight: 700,
                    backgroundColor: "rgba(16,185,129,0.04)",
                  }}
                >
                  PUTS
                </th>
              </tr>
              <tr style={{ borderBottom: "1px solid #27272A" }}>
                {["OI", "IV%", "Delta", "LTP", "Chg"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "right",
                      fontSize: 10,
                      color: "#6B7280",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
                <th
                  style={{
                    padding: "8px 12px",
                    textAlign: "center",
                    fontSize: 10,
                    color: "#3B82F6",
                    fontWeight: 700,
                    backgroundColor: "rgba(59,130,246,0.06)",
                    borderLeft: "1px solid #27272A",
                    borderRight: "1px solid #27272A",
                  }}
                >
                  STRIKE
                </th>
                {["Chg", "LTP", "Delta", "IV%", "OI"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      fontSize: 10,
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
              {CHAIN.map((row) => {
                const isATM = row.isATM;
                return (
                  <tr
                    key={row.strike}
                    style={{
                      borderBottom: "1px solid #1f1f21",
                      backgroundColor: isATM
                        ? "rgba(59,130,246,0.08)"
                        : row.isITMCall
                          ? "rgba(239,68,68,0.03)"
                          : "transparent",
                    }}
                  >
                    {[
                      row.callOI.toLocaleString(),
                      `${row.callIV}%`,
                      row.callDelta.toFixed(2),
                      `₹${row.callPrice}`,
                      `+${(Math.random() * 10).toFixed(1)}%`,
                    ].map((v, i) => (
                      <td
                        key={i}
                        style={{
                          padding: "9px 12px",
                          textAlign: "right",
                          fontSize: 12,
                          fontFamily: "JetBrains Mono, monospace",
                          color: i === 3 ? "#EF4444" : "#A1A1AA",
                        }}
                      >
                        {v}
                      </td>
                    ))}
                    <td
                      style={{
                        padding: "9px 12px",
                        textAlign: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: isATM ? "#3B82F6" : "#fff",
                        fontFamily: "JetBrains Mono, monospace",
                        backgroundColor: "rgba(59,130,246,0.06)",
                        borderLeft: "1px solid #27272A",
                        borderRight: "1px solid #27272A",
                      }}
                    >
                      {row.strike.toLocaleString()}
                    </td>
                    {[
                      `-${(Math.random() * 10).toFixed(1)}%`,
                      `₹${row.putPrice}`,
                      row.putDelta.toFixed(2),
                      `${row.putIV}%`,
                      row.putOI.toLocaleString(),
                    ].map((v, i) => (
                      <td
                        key={i}
                        style={{
                          padding: "9px 12px",
                          textAlign: "left",
                          fontSize: 12,
                          fontFamily: "JetBrains Mono, monospace",
                          color: i === 1 ? "#10B981" : "#A1A1AA",
                        }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Strategy Builder */}
      {tab === "strategy" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              name: "Bull Call Spread",
              desc: "Buy lower strike call, sell higher strike call. Limited risk, limited reward.",
              risk: "Limited",
              reward: "Limited",
              color: "#10B981",
              legs: "Buy 24500 CE + Sell 24700 CE",
            },
            {
              name: "Iron Condor",
              desc: "Sell OTM call spread + OTM put spread. Profit from time decay in range-bound markets.",
              risk: "Limited",
              reward: "Limited",
              color: "#3B82F6",
              legs: "Sell 24700 CE + Buy 24900 CE + Sell 24400 PE + Buy 24200 PE",
            },
            {
              name: "Straddle",
              desc: "Buy ATM call and put. Profit from large moves in either direction.",
              risk: "Premium Paid",
              reward: "Unlimited",
              color: "#F59E0B",
              legs: "Buy 24600 CE + Buy 24600 PE",
            },
            {
              name: "Strangle",
              desc: "Buy OTM call and put. Cheaper than straddle, needs bigger move.",
              risk: "Premium Paid",
              reward: "Unlimited",
              color: "#8B5CF6",
              legs: "Buy 24800 CE + Buy 24400 PE",
            },
            {
              name: "Covered Call",
              desc: "Hold stock, sell OTM call. Earn premium, cap upside.",
              risk: "Stock Price",
              reward: "Premium + Move to Strike",
              color: "#14B8A6",
              legs: "Long 100 shares + Sell 24800 CE",
            },
            {
              name: "Bear Put Spread",
              desc: "Buy higher strike put, sell lower strike put. Bet on moderate decline.",
              risk: "Limited",
              reward: "Limited",
              color: "#EC4899",
              legs: "Buy 24500 PE + Sell 24300 PE",
            },
          ].map((s) => (
            <div
              key={s.name}
              className="card"
              style={{ padding: "18px 20px", borderRadius: 12 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
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
                  {s.name}
                </h3>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: s.color,
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  margin: "0 0 12px",
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </p>
              <div
                style={{
                  fontSize: 11,
                  color: "#A1A1AA",
                  backgroundColor: "#0d0d0f",
                  padding: "8px 10px",
                  borderRadius: 6,
                  fontFamily: "JetBrains Mono, monospace",
                  marginBottom: 12,
                }}
              >
                {s.legs}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}
                  >
                    RISK
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#EF4444", fontWeight: 600 }}
                  >
                    {s.risk}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}
                  >
                    REWARD
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}
                  >
                    {s.reward}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
