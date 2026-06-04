"use client";
import { useState } from "react";
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  Target,
  BarChart2,
  DollarSign,
  Percent,
  Activity,
} from "lucide-react";

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  type = "number",
  min,
  max,
  step,
}) {
  return (
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
        {label}
      </label>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        {prefix && (
          <span
            style={{
              position: "absolute",
              left: 12,
              fontSize: 13,
              color: "#6B7280",
            }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          style={{
            width: "100%",
            backgroundColor: "#0d0d0f",
            border: "1px solid #27272A",
            color: "#fff",
            padding: `10px ${suffix ? "40px" : "12px"} 10px ${prefix ? "28px" : "12px"}`,
            borderRadius: 8,
            fontSize: 13,
            outline: "none",
          }}
        />
        {suffix && (
          <span
            style={{
              position: "absolute",
              right: 12,
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #1f1f21",
      }}
    >
      <span style={{ fontSize: 13, color: "#A1A1AA" }}>{label}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: highlight || "#fff",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ToolCard({
  id,
  title,
  icon: Icon,
  color,
  description,
  active,
  onSelect,
}) {
  return (
    <button
      onClick={() => onSelect(id)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        backgroundColor: active ? "rgba(59,130,246,0.08)" : "#111113",
        border: `1px solid ${active ? "#3B82F6" : "#27272A"}`,
        transition: "all 0.15s",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={color} />
      </div>
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: active ? "#fff" : "#D1D5DB",
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </button>
  );
}

// ============ TOOL CALCULATORS ============

function PositionSizeCalc() {
  const [capital, setCapital] = useState("1000000");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("500");
  const [sl, setSl] = useState("485");

  const riskAmount = (parseFloat(capital) * parseFloat(riskPct)) / 100;
  const riskPerShare = Math.abs(parseFloat(entry) - parseFloat(sl));
  const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
  const totalValue = shares * parseFloat(entry);
  const capitalUsed = (totalValue / parseFloat(capital)) * 100;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <InputField
          label="Trading Capital (₹)"
          value={capital}
          onChange={setCapital}
          prefix="₹"
        />
        <InputField
          label="Risk per Trade"
          value={riskPct}
          onChange={setRiskPct}
          suffix="%"
          min="0.1"
          max="5"
          step="0.1"
        />
        <InputField
          label="Entry Price (₹)"
          value={entry}
          onChange={setEntry}
          prefix="₹"
        />
        <InputField
          label="Stop Loss Price (₹)"
          value={sl}
          onChange={setSl}
          prefix="₹"
        />
      </div>
      <div
        style={{
          backgroundColor: "#0d0d0f",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #27272A",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          CALCULATION RESULT
        </div>
        <ResultRow
          label="Risk Amount"
          value={`₹${riskAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          highlight="#EF4444"
        />
        <ResultRow
          label="Risk Per Share"
          value={`₹${riskPerShare.toFixed(2)}`}
        />
        <ResultRow
          label="Position Size"
          value={`${shares.toLocaleString()} shares`}
          highlight="#3B82F6"
        />
        <ResultRow
          label="Total Value"
          value={`₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
        />
        <ResultRow
          label="Capital Deployed"
          value={`${capitalUsed.toFixed(1)}%`}
          highlight={capitalUsed > 30 ? "#F59E0B" : "#10B981"}
        />
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "rgba(59,130,246,0.06)",
            borderRadius: 8,
            border: "1px solid rgba(59,130,246,0.2)",
            fontSize: 12,
            color: "#A1A1AA",
            lineHeight: 1.6,
          }}
        >
          Buy <strong style={{ color: "#fff" }}>{shares}</strong> shares of the
          instrument at ₹{parseFloat(entry).toFixed(2)}, with stop loss at ₹
          {parseFloat(sl).toFixed(2)}. Maximum loss: ₹
          {riskAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}.
        </div>
      </div>
    </div>
  );
}

function RRCalc() {
  const [entry, setEntry] = useState("500");
  const [sl, setSl] = useState("490");
  const [tp, setTp] = useState("530");
  const [qty, setQty] = useState("100");

  const risk = Math.abs(parseFloat(entry) - parseFloat(sl)) * parseFloat(qty);
  const reward = Math.abs(parseFloat(tp) - parseFloat(entry)) * parseFloat(qty);
  const rr = risk > 0 ? (reward / risk).toFixed(2) : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <InputField
          label="Entry Price"
          value={entry}
          onChange={setEntry}
          prefix="₹"
        />
        <InputField label="Stop Loss" value={sl} onChange={setSl} prefix="₹" />
        <InputField
          label="Take Profit"
          value={tp}
          onChange={setTp}
          prefix="₹"
        />
        <InputField label="Quantity" value={qty} onChange={setQty} />
      </div>
      <div
        style={{
          backgroundColor: "#0d0d0f",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #27272A",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          RISK:REWARD ANALYSIS
        </div>
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color:
                parseFloat(rr) >= 2
                  ? "#10B981"
                  : parseFloat(rr) >= 1
                    ? "#F59E0B"
                    : "#EF4444",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            1:{rr}
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 8 }}>
            {parseFloat(rr) >= 2
              ? "✅ Excellent setup"
              : parseFloat(rr) >= 1.5
                ? "✓ Acceptable setup"
                : "⚠️ Poor R:R — skip this trade"}
          </div>
        </div>
        <ResultRow
          label="Max Loss"
          value={`-₹${risk.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          highlight="#EF4444"
        />
        <ResultRow
          label="Potential Profit"
          value={`+₹${reward.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          highlight="#10B981"
        />
      </div>
    </div>
  );
}

function SIPCalc() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const n = parseFloat(years) * 12;
  const r = parseFloat(rate) / 100 / 12;
  const corpus = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = parseFloat(monthly) * n;
  const gains = corpus - invested;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <InputField
          label="Monthly SIP Amount"
          value={monthly}
          onChange={setMonthly}
          prefix="₹"
        />
        <InputField
          label="Expected Annual Return"
          value={rate}
          onChange={setRate}
          suffix="%"
        />
        <InputField
          label="Investment Duration"
          value={years}
          onChange={setYears}
          suffix="yrs"
        />
      </div>
      <div
        style={{
          backgroundColor: "#0d0d0f",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #27272A",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          SIP PROJECTION
        </div>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#10B981",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            ₹{(corpus / 100000).toFixed(2)}L
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
            Projected Corpus
          </div>
        </div>
        <ResultRow
          label="Total Invested"
          value={`₹${(invested / 100000).toFixed(2)}L`}
        />
        <ResultRow
          label="Total Gains"
          value={`₹${(gains / 100000).toFixed(2)}L`}
          highlight="#10B981"
        />
        <ResultRow
          label="Return Multiple"
          value={`${(corpus / invested).toFixed(2)}x`}
          highlight="#3B82F6"
        />
        <ResultRow label="XIRR (approx)" value={`${rate}%`} />
      </div>
    </div>
  );
}

function GrahamCalc() {
  const [eps, setEps] = useState("50");
  const [bvps, setBvps] = useState("300");

  const graham = Math.sqrt(22.5 * parseFloat(eps) * parseFloat(bvps));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <InputField
          label="EPS (Earnings Per Share)"
          value={eps}
          onChange={setEps}
          prefix="₹"
        />
        <InputField
          label="BVPS (Book Value Per Share)"
          value={bvps}
          onChange={setBvps}
          prefix="₹"
        />
        <div
          style={{
            backgroundColor: "rgba(59,130,246,0.06)",
            borderRadius: 8,
            padding: 14,
            border: "1px solid rgba(59,130,246,0.2)",
            fontSize: 12,
            color: "#A1A1AA",
            lineHeight: 1.7,
          }}
        >
          Formula: √(22.5 × EPS × BVPS)
          <br />
          Graham's Number represents the maximum price a defensive investor
          should pay for a stock.
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#0d0d0f",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #27272A",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          GRAHAM NUMBER
        </div>
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#F59E0B",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            ₹{graham.toFixed(2)}
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 8 }}>
            Intrinsic Value Estimate
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#A1A1AA",
            lineHeight: 1.7,
            padding: "12px 0",
            borderTop: "1px solid #27272A",
          }}
        >
          Stocks trading below this price may offer a margin of safety using
          Benjamin Graham's classic formula.
        </div>
      </div>
    </div>
  );
}

function PivotCalc() {
  const [high, setHigh] = useState("500");
  const [low, setLow] = useState("480");
  const [close, setClose] = useState("492");

  const h = parseFloat(high),
    l = parseFloat(low),
    c = parseFloat(close);
  const pp = (h + l + c) / 3;
  const r1 = 2 * pp - l,
    r2 = pp + (h - l),
    r3 = h + 2 * (pp - l);
  const s1 = 2 * pp - h,
    s2 = pp - (h - l),
    s3 = l - 2 * (h - pp);

  const levels = [
    { label: "R3", value: r3, color: "#EF4444" },
    { label: "R2", value: r2, color: "#F87171" },
    { label: "R1", value: r1, color: "#FCA5A5" },
    { label: "PP", value: pp, color: "#3B82F6" },
    { label: "S1", value: s1, color: "#86EFAC" },
    { label: "S2", value: s2, color: "#4ADE80" },
    { label: "S3", value: s3, color: "#10B981" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <InputField
          label="Previous Day High"
          value={high}
          onChange={setHigh}
          prefix="₹"
        />
        <InputField
          label="Previous Day Low"
          value={low}
          onChange={setLow}
          prefix="₹"
        />
        <InputField
          label="Previous Day Close"
          value={close}
          onChange={setClose}
          prefix="₹"
        />
      </div>
      <div
        style={{
          backgroundColor: "#0d0d0f",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #27272A",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          CLASSIC PIVOT POINTS
        </div>
        {levels.map((lv) => (
          <div
            key={lv.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #1f1f21",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: lv.color }}>
              {lv.label}
            </span>
            <span
              style={{
                fontSize: 14,
                color: "#fff",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              ₹{lv.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CAGRCalc() {
  const [initial, setInitial] = useState("100000");
  const [final, setFinal] = useState("250000");
  const [years, setYears] = useState("5");

  const cagr =
    (Math.pow(parseFloat(final) / parseFloat(initial), 1 / parseFloat(years)) -
      1) *
    100;
  const absolute =
    ((parseFloat(final) - parseFloat(initial)) / parseFloat(initial)) * 100;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <InputField
          label="Initial Investment"
          value={initial}
          onChange={setInitial}
          prefix="₹"
        />
        <InputField
          label="Final Value"
          value={final}
          onChange={setFinal}
          prefix="₹"
        />
        <InputField
          label="Number of Years"
          value={years}
          onChange={setYears}
          suffix="yrs"
        />
      </div>
      <div
        style={{
          backgroundColor: "#0d0d0f",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #27272A",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          CAGR RESULT
        </div>
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#10B981",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {cagr.toFixed(2)}%
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
            Compound Annual Growth Rate
          </div>
        </div>
        <ResultRow
          label="Absolute Return"
          value={`${absolute.toFixed(2)}%`}
          highlight="#3B82F6"
        />
        <ResultRow
          label="Total Gain"
          value={`₹${(parseFloat(final) - parseFloat(initial)).toLocaleString("en-IN")}`}
          highlight="#10B981"
        />
      </div>
    </div>
  );
}

const TOOLS = [
  {
    id: "position",
    title: "Position Size Calculator",
    icon: Target,
    color: "#3B82F6",
    description: "Capital · Risk% · Entry · SL → Lot size",
    component: PositionSizeCalc,
  },
  {
    id: "rr",
    title: "Risk:Reward Calculator",
    icon: Activity,
    color: "#10B981",
    description: "Entry · SL · TP → R:R ratio & P&L",
    component: RRCalc,
  },
  {
    id: "sip",
    title: "SIP Returns Calculator",
    icon: PiggyBank,
    color: "#8B5CF6",
    description: "Monthly SIP · Rate · Years → Corpus",
    component: SIPCalc,
  },
  {
    id: "graham",
    title: "Graham Number Calculator",
    icon: Calculator,
    color: "#F59E0B",
    description: "EPS · BVPS → Intrinsic Value",
    component: GrahamCalc,
  },
  {
    id: "pivot",
    title: "Pivot Point Calculator",
    icon: BarChart2,
    color: "#EC4899",
    description: "High · Low · Close → R1/R2/R3, S1/S2/S3",
    component: PivotCalc,
  },
  {
    id: "cagr",
    title: "CAGR Calculator",
    icon: TrendingUp,
    color: "#14B8A6",
    description: "Initial · Final · Years → Annual Growth",
    component: CAGRCalc,
  },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState("position");
  const active = TOOLS.find((t) => t.id === activeTool);
  const ActiveComponent = active?.component;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 280,
          flexShrink: 0,
          borderRight: "1px solid #27272A",
          padding: "24px 16px",
          overflowY: "auto",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 4px",
            }}
          >
            Free Tools
          </h1>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            Professional trading calculators
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TOOLS.map((t) => (
            <ToolCard
              key={t.id}
              {...t}
              active={activeTool === t.id}
              onSelect={setActiveTool}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 10,
            backgroundColor: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.2)",
            fontSize: 12,
            color: "#A1A1AA",
            lineHeight: 1.6,
          }}
        >
          More tools coming: Options Greeks, Black-Scholes, Fibonacci, Brokerage
          Calculator
        </div>
      </div>

      {/* Calculator Panel */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {active && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: `${active.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <active.icon size={22} color={active.color} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {active.title}
                </h2>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                  {active.description}
                </p>
              </div>
            </div>
            <div style={{ maxWidth: 800 }}>
              <ActiveComponent />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
