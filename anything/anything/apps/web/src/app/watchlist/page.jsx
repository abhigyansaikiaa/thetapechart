"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Star,
  Search,
} from "lucide-react";
import { toast } from "sonner";

const userId = "demo-user";

const MOCK_PRICES = {
  RELIANCE: { price: 2943.5, change: 1.24, volume: "12.4M" },
  TCS: { price: 3821.3, change: -0.43, volume: "3.2M" },
  HDFC: { price: 1723.45, change: 0.87, volume: "8.1M" },
  INFY: { price: 1543.8, change: -1.12, volume: "6.3M" },
  WIPRO: { price: 487.25, change: 2.34, volume: "9.8M" },
  ICICIBANK: { price: 1234.6, change: 0.56, volume: "15.2M" },
  KOTAKBANK: { price: 1876.4, change: -0.78, volume: "4.7M" },
  BHARTIARTL: { price: 1654.2, change: 1.43, volume: "7.5M" },
  AXISBANK: { price: 1143.75, change: -0.23, volume: "11.3M" },
  HDFCBANK: { price: 1843.9, change: 0.34, volume: "18.6M" },
  NIFTY: { price: 24563.05, change: 0.58, volume: "—" },
  BANKNIFTY: { price: 52874.6, change: -0.35, volume: "—" },
  TATAMOTORS: { price: 987.65, change: 3.45, volume: "22.1M" },
  JSWSTEEL: { price: 921.1, change: 2.98, volume: "8.4M" },
};

function getPrice(symbol) {
  return (
    MOCK_PRICES[symbol.toUpperCase()] || {
      price: Math.random() * 1000 + 200,
      change: (Math.random() - 0.5) * 4,
      volume: "1.0M",
    }
  );
}

export default function WatchlistPage() {
  const qc = useQueryClient();
  const [activeList, setActiveList] = useState(null);
  const [newSymbol, setNewSymbol] = useState("");
  const [newListName, setNewListName] = useState("");
  const [showNewList, setShowNewList] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(null);

  const { data: watchlists = [] } = useQuery({
    queryKey: ["watchlists", userId],
    queryFn: async () => {
      const res = await fetch(`/api/watchlist?userId=${userId}`);
      return res.json();
    },
    onSuccess: (data) => {
      if (!activeList && data.length > 0) setActiveList(data[0].id);
    },
  });

  const updateList = useMutation({
    mutationFn: async ({ id, symbols }) => {
      const res = await fetch("/api/watchlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, symbols }),
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlists"] }),
  });

  const createList = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: newListName || "New Watchlist" }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["watchlists"] });
      setShowNewList(false);
      setNewListName("");
      setActiveList(data.id);
    },
  });

  const currentList = watchlists.find((w) => w.id === activeList);
  const symbols = currentList?.symbols || [];

  const addSymbol = () => {
    if (!newSymbol.trim() || !currentList) return;
    const sym = newSymbol.toUpperCase().trim();
    if (symbols.includes(sym))
      return toast.error("Symbol already in watchlist");
    updateList.mutate({ id: currentList.id, symbols: [...symbols, sym] });
    setNewSymbol("");
  };

  const removeSymbol = (sym) => {
    updateList.mutate({
      id: currentList.id,
      symbols: symbols.filter((s) => s !== sym),
    });
  };

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <Star size={20} color="#F59E0B" />
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              Watchlist
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            Track your key stocks and F&O instruments
          </p>
        </div>
        <button
          onClick={() => setShowNewList(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#111113",
            border: "1px solid #27272A",
            color: "#A1A1AA",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <Plus size={14} /> New Watchlist
        </button>
      </div>

      {/* Watchlist Tabs */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}
      >
        {watchlists.map((w) => (
          <button
            key={w.id}
            onClick={() => setActiveList(w.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              backgroundColor: activeList === w.id ? "#3B82F6" : "#111113",
              border: `1px solid ${activeList === w.id ? "#3B82F6" : "#27272A"}`,
              color: activeList === w.id ? "#fff" : "#A1A1AA",
              cursor: "pointer",
            }}
          >
            {w.name}{" "}
            <span style={{ opacity: 0.7, fontSize: 11 }}>
              ({w.symbols?.length || 0})
            </span>
          </button>
        ))}
        {showNewList && (
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name..."
              onKeyDown={(e) => e.key === "Enter" && createList.mutate()}
              style={{
                backgroundColor: "#111113",
                border: "1px solid #3B82F6",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 12,
                outline: "none",
              }}
            />
            <button
              onClick={() => createList.mutate()}
              style={{
                backgroundColor: "#3B82F6",
                border: "none",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Create
            </button>
          </div>
        )}
      </div>

      {/* Add Symbol */}
      {currentList && (
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, position: "relative", maxWidth: 320 }}>
            <Search
              size={14}
              color="#6B7280"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && addSymbol()}
              placeholder="Add symbol (e.g. RELIANCE)"
              style={{
                width: "100%",
                backgroundColor: "#111113",
                border: "1px solid #27272A",
                color: "#fff",
                padding: "10px 12px 10px 36px",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={addSymbol}
            style={{
              backgroundColor: "#3B82F6",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      )}

      {/* Stocks Table */}
      {symbols.length === 0 && currentList && (
        <div style={{ textAlign: "center", padding: 60, color: "#3f3f46" }}>
          <Bell size={40} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
            No stocks added yet
          </div>
          <div style={{ fontSize: 13 }}>
            Add symbols above to start tracking
          </div>
        </div>
      )}

      {symbols.length > 0 && (
        <div className="card" style={{ borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #27272A" }}>
                {[
                  "Symbol",
                  "Price",
                  "Change",
                  "Volume",
                  "Chart",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      color: "#6B7280",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {symbols.map((sym, i) => {
                const data = getPrice(sym);
                const positive = data.change >= 0;
                return (
                  <tr
                    key={sym}
                    style={{
                      borderBottom:
                        i < symbols.length - 1 ? "1px solid #1f1f21" : "none",
                      transition: "background 0.1s",
                    }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}
                      >
                        {sym}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>NSE</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fff",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        ₹
                        {data.price.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          color: positive ? "#10B981" : "#EF4444",
                        }}
                      >
                        {positive ? (
                          <TrendingUp size={13} />
                        ) : (
                          <TrendingDown size={13} />
                        )}
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        >
                          {positive ? "+" : ""}
                          {data.change.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#A1A1AA",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {data.volume}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <a
                        href={`https://www.tradingview.com/chart/?symbol=NSE:${sym}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 11,
                          color: "#3B82F6",
                          textDecoration: "none",
                          padding: "3px 8px",
                          border: "1px solid rgba(59,130,246,0.3)",
                          borderRadius: 6,
                          backgroundColor: "rgba(59,130,246,0.06)",
                        }}
                      >
                        TV Chart →
                      </a>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setShowAlertModal(sym)}
                          style={{
                            background: "none",
                            border: "1px solid #27272A",
                            color: "#6B7280",
                            cursor: "pointer",
                            padding: "5px 8px",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Bell size={13} />
                        </button>
                        <button
                          onClick={() => removeSymbol(sym)}
                          style={{
                            background: "none",
                            border: "1px solid #27272A",
                            color: "#6B7280",
                            cursor: "pointer",
                            padding: "5px 8px",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: "#111113",
              border: "1px solid #27272A",
              borderRadius: 16,
              padding: 24,
              width: 360,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Set Alert: {showAlertModal}
              </h3>
              <button
                onClick={() => setShowAlertModal(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6B7280",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                CURRENT PRICE
              </label>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                ₹
                {getPrice(showAlertModal).price.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                TARGET PRICE
              </label>
              <input
                placeholder="Enter target price"
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
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                TRIGGER WHEN
              </label>
              <select
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
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
              </select>
            </div>
            <button
              onClick={() => {
                toast.success(`Alert set for ${showAlertModal}`);
                setShowAlertModal(null);
              }}
              style={{
                width: "100%",
                backgroundColor: "#3B82F6",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Set Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
