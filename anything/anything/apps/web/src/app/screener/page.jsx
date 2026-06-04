"use client";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Download,
  SlidersHorizontal,
} from "lucide-react";

const STOCKS = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sector: "Energy",
    mcap: 1983450,
    pe: 26.4,
    pb: 2.1,
    roe: 9.8,
    roce: 11.2,
    de: 0.34,
    rsi: 58,
    macd: "Buy",
    ema20: "Above",
    ema50: "Above",
    ema200: "Above",
    fii: 2.3,
    revenue_growth: 12.4,
    profit_growth: 15.8,
    promoter: 50.3,
    vol_spike: false,
    week52h: 98.2,
    price: 2943.5,
    change: 1.24,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy",
    sector: "IT",
    mcap: 1423800,
    pe: 31.2,
    pb: 12.8,
    roe: 47.8,
    roce: 62.1,
    de: 0.0,
    rsi: 42,
    macd: "Sell",
    ema20: "Below",
    ema50: "Below",
    ema200: "Above",
    fii: -1.2,
    revenue_growth: 8.2,
    profit_growth: 10.4,
    promoter: 72.4,
    vol_spike: false,
    week52h: 78.5,
    price: 3821.3,
    change: -0.43,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    sector: "Banking",
    mcap: 1312400,
    pe: 19.8,
    pb: 2.9,
    roe: 17.4,
    roce: 18.2,
    de: 6.2,
    rsi: 63,
    macd: "Buy",
    ema20: "Above",
    ema50: "Above",
    ema200: "Above",
    fii: 3.8,
    revenue_growth: 18.7,
    profit_growth: 22.1,
    promoter: 0,
    vol_spike: true,
    week52h: 91.3,
    price: 1843.9,
    change: 0.34,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    sector: "Banking",
    mcap: 872300,
    pe: 17.2,
    pb: 2.8,
    roe: 18.9,
    roce: 19.8,
    de: 5.8,
    rsi: 71,
    macd: "Buy",
    ema20: "Above",
    ema50: "Above",
    ema200: "Above",
    fii: 5.1,
    revenue_growth: 21.3,
    profit_growth: 28.7,
    promoter: 0,
    vol_spike: true,
    week52h: 95.6,
    price: 1234.6,
    change: 0.56,
  },
  {
    symbol: "INFY",
    name: "Infosys",
    sector: "IT",
    mcap: 632100,
    pe: 23.4,
    pb: 7.1,
    roe: 32.1,
    roce: 42.3,
    de: 0.0,
    rsi: 38,
    macd: "Sell",
    ema20: "Below",
    ema50: "Above",
    ema200: "Above",
    fii: -2.8,
    revenue_growth: 4.2,
    profit_growth: 6.1,
    promoter: 14.8,
    vol_spike: false,
    week52h: 72.4,
    price: 1543.8,
    change: -1.12,
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    sector: "Auto",
    mcap: 358200,
    pe: 8.7,
    pb: 2.4,
    roe: 31.2,
    roce: 24.8,
    de: 1.2,
    rsi: 78,
    macd: "Buy",
    ema20: "Above",
    ema50: "Above",
    ema200: "Above",
    fii: 8.2,
    revenue_growth: 24.6,
    profit_growth: 142.3,
    promoter: 46.4,
    vol_spike: true,
    week52h: 99.1,
    price: 987.65,
    change: 3.45,
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    sector: "Telecom",
    mcap: 921400,
    pe: 84.3,
    pb: 9.2,
    roe: 12.3,
    roce: 13.1,
    de: 2.1,
    rsi: 65,
    macd: "Buy",
    ema20: "Above",
    ema50: "Above",
    ema200: "Above",
    fii: 1.9,
    revenue_growth: 16.8,
    profit_growth: 185.4,
    promoter: 55.9,
    vol_spike: false,
    week52h: 94.2,
    price: 1654.2,
    change: 1.43,
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd",
    sector: "IT",
    mcap: 254800,
    pe: 21.8,
    pb: 3.9,
    roe: 18.4,
    roce: 23.7,
    de: 0.05,
    rsi: 44,
    macd: "Neutral",
    ema20: "Above",
    ema50: "Below",
    ema200: "Below",
    fii: -0.8,
    revenue_growth: 1.2,
    profit_growth: 2.4,
    promoter: 72.9,
    vol_spike: false,
    week52h: 65.3,
    price: 487.25,
    change: 2.34,
  },
  {
    symbol: "JSWSTEEL",
    name: "JSW Steel",
    sector: "Metal",
    mcap: 224600,
    pe: 16.3,
    pb: 2.8,
    roe: 18.2,
    roce: 21.4,
    de: 0.89,
    rsi: 81,
    macd: "Buy",
    ema20: "Above",
    ema50: "Above",
    ema200: "Above",
    fii: 6.4,
    revenue_growth: 8.9,
    profit_growth: 34.2,
    promoter: 44.7,
    vol_spike: true,
    week52h: 97.8,
    price: 921.1,
    change: 2.98,
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical",
    sector: "Pharma",
    mcap: 412300,
    pe: 42.1,
    pb: 6.3,
    roe: 16.2,
    roce: 19.8,
    de: 0.1,
    rsi: 55,
    macd: "Neutral",
    ema20: "Above",
    ema50: "Above",
    ema200: "Above",
    fii: 2.1,
    revenue_growth: 14.3,
    profit_growth: 22.8,
    promoter: 54.5,
    vol_spike: false,
    week52h: 87.4,
    price: 1742.3,
    change: 0.82,
  },
];

const SECTORS = [
  "All",
  "IT",
  "Banking",
  "Energy",
  "Auto",
  "Pharma",
  "Metal",
  "Telecom",
  "FMCG",
  "Realty",
];

export default function ScreenerPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [filters, setFilters] = useState({
    minRsi: "",
    maxRsi: "",
    minRoe: "",
    minRoce: "",
    maxDe: "",
    macd: "All",
    ema200: "All",
    volSpike: false,
    fiiPositive: false,
    maxPe: "",
    minRevenueGrowth: "",
  });
  const [showFilters, setShowFilters] = useState(true);
  const [watchlist, setWatchlist] = useState(new Set());
  const [sortKey, setSortKey] = useState("mcap");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    let data = STOCKS.filter((s) => {
      if (
        search &&
        !s.symbol.includes(search.toUpperCase()) &&
        !s.name.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (sector !== "All" && s.sector !== sector) return false;
      if (filters.minRsi && s.rsi < parseFloat(filters.minRsi)) return false;
      if (filters.maxRsi && s.rsi > parseFloat(filters.maxRsi)) return false;
      if (filters.minRoe && s.roe < parseFloat(filters.minRoe)) return false;
      if (filters.minRoce && s.roce < parseFloat(filters.minRoce)) return false;
      if (filters.maxDe && s.de > parseFloat(filters.maxDe)) return false;
      if (filters.maxPe && s.pe > parseFloat(filters.maxPe)) return false;
      if (
        filters.minRevenueGrowth &&
        s.revenue_growth < parseFloat(filters.minRevenueGrowth)
      )
        return false;
      if (filters.macd !== "All" && s.macd !== filters.macd) return false;
      if (filters.ema200 !== "All" && s.ema200 !== filters.ema200) return false;
      if (filters.volSpike && !s.vol_spike) return false;
      if (filters.fiiPositive && s.fii <= 0) return false;
      return true;
    });
    data.sort((a, b) => {
      const val =
        sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
      return isNaN(val) ? 0 : val;
    });
    return data;
  }, [search, sector, filters, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ label, key }) => (
    <th
      onClick={() => handleSort(key)}
      style={{
        padding: "12px 12px",
        textAlign: "left",
        fontSize: 11,
        color: sortKey === key ? "#3B82F6" : "#6B7280",
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        letterSpacing: "0.05em",
      }}
    >
      {label} {sortKey === key ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
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
            <Search size={20} color="#3B82F6" />
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              Stock Screener
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            Filter {filtered.length} stocks from {STOCKS.length} total · NSE
            Universe
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: showFilters ? "rgba(59,130,246,0.1)" : "#111113",
              border: `1px solid ${showFilters ? "#3B82F6" : "#27272A"}`,
              color: showFilters ? "#3B82F6" : "#A1A1AA",
              padding: "8px 14px",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <button
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
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Sector Pills */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {SECTORS.map((s) => (
          <button
            key={s}
            onClick={() => setSector(s)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              backgroundColor: sector === s ? "#3B82F6" : "#111113",
              border: `1px solid ${sector === s ? "#3B82F6" : "#27272A"}`,
              color: sector === s ? "#fff" : "#A1A1AA",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <div
          className="card"
          style={{ padding: 20, borderRadius: 12, marginBottom: 20 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <Filter size={14} color="#6B7280" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
              Advanced Filters
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            {[
              { label: "RSI Min", key: "minRsi", placeholder: "0" },
              { label: "RSI Max", key: "maxRsi", placeholder: "100" },
              { label: "Min ROE %", key: "minRoe", placeholder: "15" },
              { label: "Min ROCE %", key: "minRoce", placeholder: "15" },
              { label: "Max D/E", key: "maxDe", placeholder: "1.0" },
              { label: "Max P/E", key: "maxPe", placeholder: "50" },
              {
                label: "Min Rev Growth %",
                key: "minRevenueGrowth",
                placeholder: "10",
              },
            ].map((f) => (
              <div key={f.key}>
                <label
                  style={{
                    fontSize: 10,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 5,
                    fontWeight: 500,
                  }}
                >
                  {f.label}
                </label>
                <input
                  type="number"
                  placeholder={f.placeholder}
                  value={filters[f.key]}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    backgroundColor: "#0d0d0f",
                    border: "1px solid #27272A",
                    color: "#fff",
                    padding: "8px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    outline: "none",
                  }}
                />
              </div>
            ))}
            <div>
              <label
                style={{
                  fontSize: 10,
                  color: "#6B7280",
                  display: "block",
                  marginBottom: 5,
                  fontWeight: 500,
                }}
              >
                MACD Signal
              </label>
              <select
                value={filters.macd}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, macd: e.target.value }))
                }
                style={{
                  width: "100%",
                  backgroundColor: "#0d0d0f",
                  border: "1px solid #27272A",
                  color: "#A1A1AA",
                  padding: "8px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  outline: "none",
                }}
              >
                {["All", "Buy", "Sell", "Neutral"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 10,
                  color: "#6B7280",
                  display: "block",
                  marginBottom: 5,
                  fontWeight: 500,
                }}
              >
                EMA 200
              </label>
              <select
                value={filters.ema200}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, ema200: e.target.value }))
                }
                style={{
                  width: "100%",
                  backgroundColor: "#0d0d0f",
                  border: "1px solid #27272A",
                  color: "#A1A1AA",
                  padding: "8px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  outline: "none",
                }}
              >
                {["All", "Above", "Below"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#A1A1AA",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.volSpike}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, volSpike: e.target.checked }))
                  }
                />{" "}
                Vol. Spike
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#A1A1AA",
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.fiiPositive}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, fiiPositive: e.target.checked }))
                  }
                />{" "}
                FII Buying
              </label>
            </div>
          </div>
          <button
            onClick={() =>
              setFilters({
                minRsi: "",
                maxRsi: "",
                minRoe: "",
                minRoce: "",
                maxDe: "",
                macd: "All",
                ema200: "All",
                volSpike: false,
                fiiPositive: false,
                maxPe: "",
                minRevenueGrowth: "",
              })
            }
            style={{
              marginTop: 14,
              fontSize: 12,
              color: "#6B7280",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 320, marginBottom: 16 }}>
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search symbol or company..."
          style={{
            width: "100%",
            backgroundColor: "#111113",
            border: "1px solid #27272A",
            color: "#fff",
            padding: "9px 12px 9px 36px",
            borderRadius: 8,
            fontSize: 13,
            outline: "none",
          }}
        />
      </div>

      {/* Results Table */}
      <div className="card" style={{ borderRadius: 12, overflow: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #27272A" }}>
              <SortHeader label="SYMBOL" key="symbol" />
              <SortHeader label="PRICE" key="price" />
              <SortHeader label="CHG%" key="change" />
              <SortHeader label="MCAP (Cr)" key="mcap" />
              <SortHeader label="P/E" key="pe" />
              <SortHeader label="ROE%" key="roe" />
              <SortHeader label="ROCE%" key="roce" />
              <SortHeader label="D/E" key="de" />
              <SortHeader label="RSI" key="rsi" />
              <th
                style={{
                  padding: "12px 12px",
                  textAlign: "left",
                  fontSize: 11,
                  color: "#6B7280",
                  fontWeight: 600,
                }}
              >
                MACD
              </th>
              <th
                style={{
                  padding: "12px 12px",
                  textAlign: "left",
                  fontSize: 11,
                  color: "#6B7280",
                  fontWeight: 600,
                }}
              >
                EMA 200
              </th>
              <SortHeader label="FII%" key="fii" />
              <th
                style={{
                  padding: "12px 12px",
                  textAlign: "left",
                  fontSize: 11,
                  color: "#6B7280",
                  fontWeight: 600,
                }}
              >
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr
                key={s.symbol}
                style={{
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #1f1f21" : "none",
                }}
              >
                <td style={{ padding: "13px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    {s.symbol}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>
                    {s.sector}
                  </div>
                </td>
                <td
                  style={{
                    padding: "13px 12px",
                    fontSize: 13,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#fff",
                  }}
                >
                  ₹{s.price.toLocaleString("en-IN")}
                </td>
                <td style={{ padding: "13px 12px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: s.change >= 0 ? "#10B981" : "#EF4444",
                      fontFamily: "JetBrains Mono, monospace",
                      fontWeight: 600,
                    }}
                  >
                    {s.change >= 0 ? "+" : ""}
                    {s.change.toFixed(2)}%
                  </span>
                </td>
                <td
                  style={{
                    padding: "13px 12px",
                    fontSize: 12,
                    color: "#A1A1AA",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  ₹{(s.mcap / 100).toFixed(0)}Cr
                </td>
                <td
                  style={{
                    padding: "13px 12px",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono, monospace",
                    color: s.pe > 40 ? "#F59E0B" : "#fff",
                  }}
                >
                  {s.pe}
                </td>
                <td
                  style={{
                    padding: "13px 12px",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono, monospace",
                    color: s.roe > 20 ? "#10B981" : "#fff",
                  }}
                >
                  {s.roe}%
                </td>
                <td
                  style={{
                    padding: "13px 12px",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono, monospace",
                    color: s.roce > 20 ? "#10B981" : "#fff",
                  }}
                >
                  {s.roce}%
                </td>
                <td
                  style={{
                    padding: "13px 12px",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono, monospace",
                    color: s.de > 1 ? "#F59E0B" : "#fff",
                  }}
                >
                  {s.de}
                </td>
                <td style={{ padding: "13px 12px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "JetBrains Mono, monospace",
                      color:
                        s.rsi > 70
                          ? "#EF4444"
                          : s.rsi < 30
                            ? "#10B981"
                            : "#fff",
                    }}
                  >
                    {s.rsi}
                  </span>
                </td>
                <td style={{ padding: "13px 12px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 10,
                      fontWeight: 500,
                      backgroundColor:
                        s.macd === "Buy"
                          ? "rgba(16,185,129,0.1)"
                          : s.macd === "Sell"
                            ? "rgba(239,68,68,0.1)"
                            : "rgba(161,161,170,0.1)",
                      color:
                        s.macd === "Buy"
                          ? "#10B981"
                          : s.macd === "Sell"
                            ? "#EF4444"
                            : "#A1A1AA",
                    }}
                  >
                    {s.macd}
                  </span>
                </td>
                <td style={{ padding: "13px 12px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: s.ema200 === "Above" ? "#10B981" : "#EF4444",
                    }}
                  >
                    {s.ema200}
                  </span>
                </td>
                <td style={{ padding: "13px 12px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "JetBrains Mono, monospace",
                      color: s.fii >= 0 ? "#10B981" : "#EF4444",
                    }}
                  >
                    {s.fii >= 0 ? "+" : ""}
                    {s.fii}%
                  </span>
                </td>
                <td style={{ padding: "13px 12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => {
                        setWatchlist((p) => {
                          const n = new Set(p);
                          n.has(s.symbol)
                            ? n.delete(s.symbol)
                            : n.add(s.symbol);
                          return n;
                        });
                      }}
                      style={{
                        fontSize: 11,
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: `1px solid ${watchlist.has(s.symbol) ? "#F59E0B" : "#27272A"}`,
                        backgroundColor: watchlist.has(s.symbol)
                          ? "rgba(245,158,11,0.1)"
                          : "transparent",
                        color: watchlist.has(s.symbol) ? "#F59E0B" : "#6B7280",
                        cursor: "pointer",
                      }}
                    >
                      {watchlist.has(s.symbol) ? "★" : "☆"} Watch
                    </button>
                    <a
                      href={`/fundamental/${s.symbol}`}
                      style={{
                        fontSize: 11,
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: "1px solid #27272A",
                        color: "#3B82F6",
                        textDecoration: "none",
                        backgroundColor: "rgba(59,130,246,0.06)",
                      }}
                    >
                      Analyze
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
