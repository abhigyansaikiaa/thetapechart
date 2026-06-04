"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Target,
  X,
  Upload,
  BarChart2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const STRATEGIES = [
  "SMC",
  "ICT",
  "Breakout",
  "Reversal",
  "Swing",
  "Scalp",
  "Gap Up/Down",
  "Trend Follow",
  "Mean Revert",
];
const MOODS = [
  "Confident",
  "Anxious",
  "Neutral",
  "Excited",
  "Patient",
  "Impulsive",
];

const userId = "demo-user";

function StatCard({ label, value, sub, color = "#fff" }) {
  return (
    <div className="card" style={{ padding: "16px 20px", borderRadius: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: "#6B7280",
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("trades");
  const qc = useQueryClient();
  const [form, setForm] = useState({
    symbol: "",
    direction: "long",
    instrument_type: "equity",
    entry_price: "",
    exit_price: "",
    stop_loss: "",
    take_profit: "",
    quantity: "",
    strategy: "SMC",
    setup_name: "",
    notes: "",
    mood: "Neutral",
    confidence: 7,
  });

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ["trades", userId],
    queryFn: async () => {
      const res = await fetch(`/api/trades?userId=${userId}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const addTrade = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trades"] });
      setShowForm(false);
      toast.success("Trade logged successfully");
      setForm({
        symbol: "",
        direction: "long",
        instrument_type: "equity",
        entry_price: "",
        exit_price: "",
        stop_loss: "",
        take_profit: "",
        quantity: "",
        strategy: "SMC",
        setup_name: "",
        notes: "",
        mood: "Neutral",
        confidence: 7,
      });
    },
    onError: () => toast.error("Failed to log trade"),
  });

  const deleteTrade = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/trades?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trades"] }),
  });

  const closedTrades = trades.filter((t) => t.status === "closed");
  const openTrades = trades.filter((t) => t.status === "open");
  const winners = closedTrades.filter((t) => t.pnl > 0);
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winRate =
    closedTrades.length > 0
      ? ((winners.length / closedTrades.length) * 100).toFixed(1)
      : "0";

  const equityCurve = closedTrades.reduce(
    (acc, t) => {
      const prev = acc[acc.length - 1]?.equity || 100000;
      acc.push({
        date: new Date(t.exit_at || t.entry_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        equity: prev + (t.pnl || 0),
      });
      return acc;
    },
    [{ date: "Start", equity: 100000 }],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.symbol || !form.entry_price || !form.quantity)
      return toast.error("Fill required fields");
    addTrade.mutate(form);
  };

  const tabs = [
    { id: "trades", label: "All Trades" },
    { id: "open", label: `Open (${openTrades.length})` },
    { id: "equity", label: "Equity Curve" },
  ];

  const displayTrades =
    tab === "open" ? openTrades : tab === "trades" ? trades : [];

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
            <BookOpen size={20} color="#3B82F6" />
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              Trade Journal
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            Discipline is the bridge between goals and results
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#3B82F6",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={15} /> Log Trade
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <StatCard
          label="Total P&L"
          value={`${totalPnl >= 0 ? "+" : ""}₹${Math.abs(totalPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          color={totalPnl >= 0 ? "#10B981" : "#EF4444"}
          sub={`${closedTrades.length} trades closed`}
        />
        <StatCard
          label="Win Rate"
          value={`${winRate}%`}
          color={parseFloat(winRate) >= 50 ? "#10B981" : "#EF4444"}
          sub={`${winners.length}W / ${closedTrades.length - winners.length}L`}
        />
        <StatCard
          label="Open Trades"
          value={openTrades.length}
          color="#3B82F6"
          sub="Currently active"
        />
        <StatCard
          label="Avg R:R"
          value={
            closedTrades.length
              ? (
                  closedTrades.reduce((s, t) => s + (t.rr_ratio || 0), 0) /
                  closedTrades.length
                ).toFixed(2) + ":1"
              : "N/A"
          }
          color="#F59E0B"
          sub="Risk-to-reward"
        />
        <StatCard
          label="Best Trade"
          value={
            winners.length
              ? `+₹${Math.max(...winners.map((t) => t.pnl || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
              : "N/A"
          }
          color="#10B981"
        />
        <StatCard
          label="Total Trades"
          value={trades.length}
          color="#fff"
          sub="All time"
        />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid #27272A",
          marginBottom: 20,
        }}
      >
        {tabs.map((t) => (
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

      {/* Equity Curve */}
      {tab === "equity" && (
        <div className="card" style={{ padding: 20, borderRadius: 12 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              margin: "0 0 16px",
            }}
          >
            Equity Curve
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={equityCurve}
                margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
              >
                <XAxis
                  dataKey="date"
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
                  formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Equity"]}
                />
                <ReferenceLine
                  y={100000}
                  stroke="#27272A"
                  strokeDasharray="4 4"
                />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#3B82F6"
                  fill="rgba(59,130,246,0.1)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Trades List */}
      {tab !== "equity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {isLoading &&
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="shimmer"
                style={{ height: 80, borderRadius: 10 }}
              />
            ))}
          {!isLoading && displayTrades.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#3f3f46" }}>
              <BookOpen size={40} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                No trades logged yet
              </div>
              <div style={{ fontSize: 13 }}>
                Start building your journal to track performance
              </div>
            </div>
          )}
          {displayTrades.map((trade) => (
            <div
              key={trade.id}
              className="card"
              style={{ padding: "14px 20px", borderRadius: 10 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        trade.direction === "long"
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(239,68,68,0.1)",
                    }}
                  >
                    {trade.direction === "long" ? (
                      <TrendingUp size={16} color="#10B981" />
                    ) : (
                      <TrendingDown size={16} color="#EF4444" />
                    )}
                  </div>
                  <div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}
                      >
                        {trade.symbol}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#6B7280",
                          backgroundColor: "#1f1f21",
                          padding: "2px 8px",
                          borderRadius: 10,
                        }}
                      >
                        {trade.strategy || "N/A"}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color:
                            trade.status === "open" ? "#3B82F6" : "#6B7280",
                          backgroundColor:
                            trade.status === "open"
                              ? "rgba(59,130,246,0.1)"
                              : "#1f1f21",
                          padding: "2px 8px",
                          borderRadius: 10,
                        }}
                      >
                        {trade.status}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        marginTop: 3,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      Entry: ₹{trade.entry_price} · Qty: {trade.quantity} ·{" "}
                      {trade.instrument_type}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {trade.pnl !== null && (
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: trade.pnl >= 0 ? "#10B981" : "#EF4444",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {trade.pnl >= 0 ? "+" : ""}₹
                        {Math.abs(trade.pnl).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      {trade.rr_ratio && (
                        <div style={{ fontSize: 11, color: "#6B7280" }}>
                          R:R {trade.rr_ratio}:1
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => deleteTrade.mutate(trade.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3f3f46",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
              {trade.notes && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px solid #1f1f21",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: "#3f3f46", marginRight: 6 }}>-</span>{" "}
                  {trade.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Log Trade Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#111113",
              border: "1px solid #27272A",
              borderRadius: 16,
              width: "100%",
              maxWidth: 640,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "1px solid #27272A",
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Log New Trade
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6B7280",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 24 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  {
                    label: "Symbol *",
                    key: "symbol",
                    placeholder: "NIFTY / RELIANCE",
                  },
                  {
                    label: "Entry Price *",
                    key: "entry_price",
                    placeholder: "0.00",
                    type: "number",
                  },
                  {
                    label: "Exit Price",
                    key: "exit_price",
                    placeholder: "0.00 (blank if open)",
                    type: "number",
                  },
                  {
                    label: "Stop Loss",
                    key: "stop_loss",
                    placeholder: "0.00",
                    type: "number",
                  },
                  {
                    label: "Take Profit",
                    key: "take_profit",
                    placeholder: "0.00",
                    type: "number",
                  },
                  {
                    label: "Quantity *",
                    key: "quantity",
                    placeholder: "Qty / Lots",
                    type: "number",
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        display: "block",
                        marginBottom: 6,
                        fontWeight: 500,
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      type={f.type || "text"}
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                      placeholder={f.placeholder}
                      style={{
                        width: "100%",
                        backgroundColor: "#0d0d0f",
                        border: "1px solid #27272A",
                        color: "#fff",
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                {[
                  {
                    label: "Direction",
                    key: "direction",
                    options: ["long", "short"],
                  },
                  {
                    label: "Instrument",
                    key: "instrument_type",
                    options: [
                      "equity",
                      "futures",
                      "options",
                      "currency",
                      "commodity",
                    ],
                  },
                  { label: "Strategy", key: "strategy", options: STRATEGIES },
                ].map((f) => (
                  <div key={f.key}>
                    <label
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        display: "block",
                        marginBottom: 6,
                        fontWeight: 500,
                      }}
                    >
                      {f.label}
                    </label>
                    <select
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        backgroundColor: "#0d0d0f",
                        border: "1px solid #27272A",
                        color: "#A1A1AA",
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: 13,
                        outline: "none",
                      }}
                    >
                      {f.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 500,
                    }}
                  >
                    Mood
                  </label>
                  <select
                    value={form.mood}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, mood: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "#0d0d0f",
                      border: "1px solid #27272A",
                      color: "#A1A1AA",
                      padding: "10px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      outline: "none",
                    }}
                  >
                    {MOODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 500,
                    }}
                  >
                    Confidence: {form.confidence}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form.confidence}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        confidence: parseInt(e.target.value),
                      }))
                    }
                    style={{ width: "100%", marginTop: 8 }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label
                  style={{
                    fontSize: 11,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  Trade Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="Setup rationale, what you saw, lessons learned..."
                  rows={3}
                  style={{
                    width: "100%",
                    backgroundColor: "#0d0d0f",
                    border: "1px solid #27272A",
                    color: "#fff",
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    outline: "none",
                    resize: "vertical",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  type="submit"
                  disabled={addTrade.isLoading}
                  style={{
                    flex: 1,
                    backgroundColor: "#3B82F6",
                    color: "#fff",
                    border: "none",
                    padding: "12px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity: addTrade.isLoading ? 0.7 : 1,
                  }}
                >
                  {addTrade.isLoading ? "Saving..." : "Log Trade"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    backgroundColor: "#1f1f21",
                    border: "1px solid #27272A",
                    color: "#A1A1AA",
                    padding: "12px 20px",
                    borderRadius: 8,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
