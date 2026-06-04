"use client";
import { useState } from "react";
import { Globe, TrendingUp, TrendingDown, Info, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const INDIA_MACRO = [
  {
    label: "GDP Growth",
    value: "8.4%",
    prev: "8.1%",
    trend: "up",
    note: "Q3 FY24 — fastest in 4 quarters",
  },
  {
    label: "CPI Inflation",
    value: "5.1%",
    prev: "5.4%",
    trend: "down",
    note: "April 2024 — within RBI comfort zone",
  },
  {
    label: "WPI Inflation",
    value: "0.53%",
    prev: "0.20%",
    trend: "up",
    note: "Wholesale prices rising modestly",
  },
  {
    label: "Repo Rate",
    value: "6.50%",
    prev: "6.50%",
    trend: "flat",
    note: "RBI held rate for 6th consecutive time",
  },
  {
    label: "India VIX",
    value: "13.82",
    prev: "16.24",
    trend: "down",
    note: "Market complacency — low volatility",
  },
  {
    label: "IIP Growth",
    value: "4.9%",
    prev: "5.6%",
    trend: "down",
    note: "Industrial output Feb 2024",
  },
  {
    label: "PMI Manufacturing",
    value: "59.1",
    prev: "56.9",
    trend: "up",
    note: "Expansion for 32 consecutive months",
  },
  {
    label: "PMI Services",
    value: "61.2",
    prev: "60.6",
    trend: "up",
    note: "Near all-time high",
  },
];

const US_MACRO = [
  {
    label: "Fed Funds Rate",
    value: "5.25-5.50%",
    prev: "5.25-5.50%",
    trend: "flat",
    note: "Held at 23-year high",
  },
  {
    label: "US CPI YoY",
    value: "3.4%",
    prev: "3.5%",
    trend: "down",
    note: "Gradual disinflation continues",
  },
  {
    label: "US GDP Growth",
    value: "1.6%",
    prev: "3.4%",
    trend: "down",
    note: "Q1 2024 — slowdown vs Q4 2023",
  },
  {
    label: "Unemployment",
    value: "3.9%",
    prev: "3.7%",
    trend: "up",
    note: "Near-full employment persists",
  },
  {
    label: "DXY Index",
    value: "104.82",
    prev: "103.21",
    trend: "up",
    note: "Dollar strength pressuring EMs",
  },
  {
    label: "US 10Y Yield",
    value: "4.63%",
    prev: "4.20%",
    trend: "up",
    note: "Higher for longer narrative",
  },
];

const GDP_DATA = [
  { q: "Q1 FY22", val: 20.1 },
  { q: "Q2 FY22", val: 8.4 },
  { q: "Q3 FY22", val: 5.4 },
  { q: "Q4 FY22", val: 4.1 },
  { q: "Q1 FY23", val: 13.5 },
  { q: "Q2 FY23", val: 6.3 },
  { q: "Q3 FY23", val: 4.4 },
  { q: "Q4 FY23", val: 6.1 },
  { q: "Q1 FY24", val: 8.2 },
  { q: "Q2 FY24", val: 7.6 },
  { q: "Q3 FY24", val: 8.4 },
];

const CPI_DATA = [
  { m: "May", val: 4.25 },
  { m: "Jun", val: 4.81 },
  { m: "Jul", val: 7.44 },
  { m: "Aug", val: 6.83 },
  { m: "Sep", val: 5.02 },
  { m: "Oct", val: 4.87 },
  { m: "Nov", val: 5.55 },
  { m: "Dec", val: 5.69 },
  { m: "Jan", val: 5.1 },
  { m: "Feb", val: 5.09 },
  { m: "Mar", val: 4.85 },
  { m: "Apr", val: 4.83 },
];

const UPCOMING_EVENTS = [
  {
    date: "May 27",
    event: "US Consumer Confidence",
    impact: "medium",
    country: "🇺🇸",
  },
  {
    date: "May 29",
    event: "India Q4 GDP Release",
    impact: "high",
    country: "🇮🇳",
  },
  {
    date: "Jun 5",
    event: "RBI MPC Meeting (Day 1)",
    impact: "high",
    country: "🇮🇳",
  },
  {
    date: "Jun 6",
    event: "RBI Policy Decision",
    impact: "high",
    country: "🇮🇳",
  },
  {
    date: "Jun 7",
    event: "US NFP (Non-Farm Payrolls)",
    impact: "high",
    country: "🇺🇸",
  },
  {
    date: "Jun 12",
    event: "US CPI Inflation Data",
    impact: "high",
    country: "🇺🇸",
  },
  { date: "Jun 14", event: "India IIP Data", impact: "medium", country: "🇮🇳" },
  {
    date: "Jun 19",
    event: "US Fed FOMC Meeting",
    impact: "high",
    country: "🇺🇸",
  },
];

function MacroRow({ item }) {
  const up = item.trend === "up";
  const down = item.trend === "down";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #1f1f21",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
          {item.label}
        </div>
        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
          {item.note}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {item.value}
          </div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>
            Prev: {item.prev}
          </div>
        </div>
        <div style={{ width: 24, display: "flex", justifyContent: "center" }}>
          {up && <TrendingUp size={16} color="#10B981" />}
          {down && <TrendingDown size={16} color="#EF4444" />}
          {item.trend === "flat" && (
            <span style={{ fontSize: 14, color: "#A1A1AA" }}>→</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MacroPage() {
  const [tab, setTab] = useState("india");

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
        <Globe size={20} color="#3B82F6" />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
          Macroeconomic Intelligence
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 4,
              borderBottom: "1px solid #27272A",
              marginBottom: 20,
            }}
          >
            {[
              { id: "india", label: "🇮🇳 India" },
              { id: "us", label: "🇺🇸 United States" },
              { id: "charts", label: "Charts" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 16px",
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

          {tab === "india" && (
            <div className="card" style={{ padding: 24, borderRadius: 12 }}>
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 4px",
                }}
              >
                India Macro Indicators
              </h2>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 16px" }}>
                Latest data from RBI, MoSPI, and government sources
              </p>
              {INDIA_MACRO.map((item) => (
                <MacroRow key={item.label} item={item} />
              ))}
            </div>
          )}

          {tab === "us" && (
            <div className="card" style={{ padding: 24, borderRadius: 12 }}>
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 4px",
                }}
              >
                US Macro Indicators
              </h2>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 16px" }}>
                Federal Reserve, BLS, and US government data
              </p>
              {US_MACRO.map((item) => (
                <MacroRow key={item.label} item={item} />
              ))}
            </div>
          )}

          {tab === "charts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="card" style={{ padding: 20, borderRadius: 12 }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    margin: "0 0 16px",
                  }}
                >
                  India GDP Growth Rate (YoY %)
                </h3>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={GDP_DATA}
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
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1c",
                          border: "1px solid #27272A",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v) => [`${v}%`, "GDP Growth"]}
                      />
                      <ReferenceLine y={0} stroke="#27272A" />
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card" style={{ padding: 20, borderRadius: 12 }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    margin: "0 0 16px",
                  }}
                >
                  India CPI Inflation — Last 12 Months
                </h3>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={CPI_DATA}
                      margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                    >
                      <XAxis
                        dataKey="m"
                        tick={{ fill: "#6B7280", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6B7280", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                        domain={[3, 8]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1c",
                          border: "1px solid #27272A",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v) => [`${v}%`, "CPI"]}
                      />
                      <ReferenceLine
                        y={6}
                        stroke="#EF4444"
                        strokeDasharray="4 4"
                        label={{
                          value: "Upper Band 6%",
                          fill: "#EF4444",
                          fontSize: 10,
                        }}
                      />
                      <ReferenceLine
                        y={4}
                        stroke="#10B981"
                        strokeDasharray="4 4"
                        label={{
                          value: "Target 4%",
                          fill: "#10B981",
                          fontSize: 10,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ fill: "#F59E0B", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events Calendar */}
        <div>
          <div className="card" style={{ padding: 20, borderRadius: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <Calendar size={15} color="#3B82F6" />
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Upcoming Events
              </h2>
            </div>
            {UPCOMING_EVENTS.map((ev, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom:
                    i < UPCOMING_EVENTS.length - 1
                      ? "1px solid #1f1f21"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginTop: 5,
                    backgroundColor:
                      ev.impact === "high" ? "#EF4444" : "#F59E0B",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 11, color: "#6B7280" }}>
                      {ev.date}
                    </span>
                    <span>{ev.country}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#fff", marginTop: 2 }}>
                    {ev.event}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: ev.impact === "high" ? "#EF4444" : "#F59E0B",
                      marginTop: 3,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {ev.impact} impact
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Macro Brief */}
          <div
            style={{
              marginTop: 14,
              padding: 20,
              borderRadius: 12,
              backgroundColor: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#3B82F6",
                marginBottom: 10,
                letterSpacing: "0.05em",
              }}
            >
              AI MACRO BRIEF
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#D1D5DB",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Strong PMI data and recovering IIP numbers suggest India's
              manufacturing momentum continues despite global headwinds. The
              RBI's pause on rates signals comfort with current inflation
              trajectory, which is positive for equity markets. Watch the June
              RBI meeting for forward guidance — any hint of a rate cut could
              trigger a significant rally in rate-sensitive sectors (NBFC,
              housing, banking).
            </p>
            <div style={{ marginTop: 12, fontSize: 11, color: "#6B7280" }}>
              AI-generated — for educational use only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
