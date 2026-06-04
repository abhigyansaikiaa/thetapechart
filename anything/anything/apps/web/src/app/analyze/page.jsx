"use client";
import { useState, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  Brain,
  Clock,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  AlertTriangle,
  Shield,
  Zap,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import useUser from "@/utils/useUser";

const SMC_ICT_PROMPT = `You are an elite institutional trading analyst with 25+ years of experience. You specialize in Smart Money Concepts (SMC), ICT methodology, Wyckoff Theory, and Elliott Wave. Analyze this chart with extreme precision.

Return ONLY valid JSON (no markdown, no explanation outside JSON):
{
  "bias": "Bullish or Bearish or Neutral",
  "confidence": 75,
  "pattern": "chart pattern name",
  "timeframe": "detected timeframe",
  "smc": {
    "order_blocks": "description",
    "fvg": "Fair Value Gaps",
    "bos": true,
    "choch": false,
    "liquidity": "liquidity pools",
    "premium_discount": "premium or discount",
    "analysis": "3-4 sentence SMC analysis"
  },
  "ict": {
    "killzone": "kill zone or null",
    "ote": "OTE zone",
    "judas_swing": false,
    "po3_phase": "Accumulation or Manipulation or Distribution",
    "market_maker_model": "model description",
    "analysis": "3-4 sentence ICT analysis"
  },
  "wyckoff": "Wyckoff phase or null",
  "elliott_wave": "wave count or null",
  "key_levels": ["level1", "level2"],
  "entry": "entry price",
  "stop_loss": "stop loss level",
  "targets": ["TP1", "TP2", "TP3"],
  "rr_ratio": "2.5",
  "invalidation": "what invalidates this setup",
  "narrative": "3 paragraphs about institutional activity, manipulation, and expected move",
  "execution_plan": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "risk_note": "key risk factor"
}`;

function Section({
  title,
  icon: Icon,
  color,
  children,
  open: initOpen = true,
}) {
  const [open, setOpen] = useState(initOpen);
  return (
    <div
      style={{
        border: "1px solid #1f1f21",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 14px",
          backgroundColor: "#141416",
          border: "none",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              backgroundColor: `${color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={13} color={color} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{title}</span>
        </div>
        {open ? (
          <ChevronUp size={13} color="#6B7280" />
        ) : (
          <ChevronDown size={13} color="#6B7280" />
        )}
      </button>
      {open && (
        <div
          style={{
            padding: "12px 14px",
            backgroundColor: "#0d0d0f",
            borderTop: "1px solid #1f1f21",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Badge({ label, type = "neutral" }) {
  const c =
    {
      bullish: {
        bg: "rgba(16,185,129,0.1)",
        color: "#10B981",
        border: "rgba(16,185,129,0.25)",
      },
      bearish: {
        bg: "rgba(239,68,68,0.1)",
        color: "#EF4444",
        border: "rgba(239,68,68,0.25)",
      },
      neutral: {
        bg: "rgba(161,161,170,0.1)",
        color: "#A1A1AA",
        border: "rgba(161,161,170,0.25)",
      },
      info: {
        bg: "rgba(59,130,246,0.1)",
        color: "#3B82F6",
        border: "rgba(59,130,246,0.25)",
      },
      warning: {
        bg: "rgba(245,158,11,0.1)",
        color: "#F59E0B",
        border: "rgba(245,158,11,0.25)",
      },
      purple: {
        bg: "rgba(139,92,246,0.1)",
        color: "#8B5CF6",
        border: "rgba(139,92,246,0.25)",
      },
    }[type] || {};
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        padding: "2px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        margin: "2px 3px 2px 0",
      }}
    >
      {label}
    </span>
  );
}

function AnalysisResult({ analysis }) {
  if (!analysis) return null;
  const {
    bias = "Neutral",
    confidence = 0,
    pattern,
    smc = {},
    ict = {},
    entry,
    stop_loss,
    targets = [],
    rr_ratio,
    timeframe,
    narrative,
    execution_plan = [],
    wyckoff,
    elliott_wave,
    invalidation,
    risk_note,
  } = analysis;
  const bt = bias.toLowerCase().includes("bull")
    ? "bullish"
    : bias.toLowerCase().includes("bear")
      ? "bearish"
      : "neutral";
  const bc =
    bt === "bullish" ? "#10B981" : bt === "bearish" ? "#EF4444" : "#A1A1AA";

  return (
    <div>
      <div
        style={{
          padding: "18px 20px",
          borderRadius: 12,
          marginBottom: 14,
          background:
            bt === "bullish"
              ? "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.02))"
              : bt === "bearish"
                ? "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))"
                : "rgba(161,161,170,0.04)",
          border: `1px solid ${bc}25`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#6B7280",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              AI BIAS ASSESSMENT
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: bc }}>
              {bias}
            </div>
            {pattern && (
              <div style={{ fontSize: 12, color: "#A1A1AA", marginTop: 4 }}>
                Pattern:{" "}
                <span style={{ color: "#D1D5DB", fontWeight: 500 }}>
                  {pattern}
                </span>
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 6 }}>
              CONFIDENCE
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#fff",
                fontFamily: "JetBrains Mono,monospace",
                lineHeight: 1,
              }}
            >
              {confidence}
              <span style={{ fontSize: 14, color: "#6B7280" }}>%</span>
            </div>
            {timeframe && (
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>
                {timeframe}
              </div>
            )}
          </div>
        </div>
        <div style={{ height: 4, borderRadius: 2, backgroundColor: "#1f1f21" }}>
          <div
            style={{
              height: "100%",
              width: `${confidence}%`,
              backgroundColor: bc,
              borderRadius: 2,
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {[
          { label: "ENTRY ZONE", value: entry, color: "#3B82F6", Icon: Target },
          {
            label: "STOP LOSS",
            value: stop_loss,
            color: "#EF4444",
            Icon: Shield,
          },
          {
            label: "TARGET 1",
            value: targets[0],
            color: "#10B981",
            Icon: TrendingUp,
          },
          {
            label: "R:R RATIO",
            value: rr_ratio ? `1 : ${rr_ratio}` : "N/A",
            color: "#F59E0B",
            Icon: Zap,
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: "#111113",
              border: "1px solid #1f1f21",
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 6,
              }}
            >
              <item.Icon size={11} color={item.color} />
              <span
                style={{
                  fontSize: 9,
                  color: "#6B7280",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {item.label}
              </span>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: item.color,
                fontFamily: "JetBrains Mono,monospace",
              }}
            >
              {item.value || "N/A"}
            </div>
          </div>
        ))}
      </div>

      {targets.length > 1 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {targets.map((t, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.12)",
                borderRadius: 8,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#6B7280",
                  fontWeight: 600,
                  marginBottom: 3,
                }}
              >
                TP{i + 1}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#10B981",
                  fontFamily: "JetBrains Mono,monospace",
                  fontWeight: 600,
                }}
              >
                {t}
              </div>
            </div>
          ))}
        </div>
      )}

      {smc && Object.keys(smc).length > 0 && (
        <Section
          title="Smart Money Concepts (SMC)"
          icon={Brain}
          color="#8B5CF6"
        >
          <div style={{ marginBottom: 10 }}>
            {smc.order_blocks && <Badge label="Order Block" type="purple" />}
            {smc.fvg && <Badge label="FVG Present" type="warning" />}
            {smc.bos && <Badge label="BOS ✓" type={bt} />}
            {smc.choch && <Badge label="ChoCH ✓" type="warning" />}
            {smc.premium_discount && (
              <Badge label={smc.premium_discount} type="info" />
            )}
          </div>
          {smc.order_blocks && (
            <div style={{ fontSize: 12, color: "#A1A1AA", marginBottom: 6 }}>
              <span style={{ color: "#8B5CF6" }}>OB: </span>
              {smc.order_blocks}
            </div>
          )}
          {smc.fvg && (
            <div style={{ fontSize: 12, color: "#A1A1AA", marginBottom: 6 }}>
              <span style={{ color: "#F59E0B" }}>FVG: </span>
              {smc.fvg}
            </div>
          )}
          {smc.liquidity && (
            <div style={{ fontSize: 12, color: "#A1A1AA", marginBottom: 8 }}>
              <span style={{ color: "#6B7280" }}>Liquidity: </span>
              {smc.liquidity}
            </div>
          )}
          {smc.analysis && (
            <p
              style={{
                fontSize: 13,
                color: "#D1D5DB",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {smc.analysis}
            </p>
          )}
        </Section>
      )}

      {ict && Object.keys(ict).length > 0 && (
        <Section title="ICT Methodology" icon={Target} color="#3B82F6">
          <div style={{ marginBottom: 10 }}>
            {ict.po3_phase && (
              <Badge label={`Po3: ${ict.po3_phase}`} type="info" />
            )}
            {ict.judas_swing && <Badge label="Judas Swing" type="warning" />}
            {ict.killzone && (
              <Badge label={`Kill Zone: ${ict.killzone}`} type="info" />
            )}
            {ict.ote && <Badge label={`OTE: ${ict.ote}`} type={bt} />}
          </div>
          {ict.market_maker_model && (
            <div style={{ fontSize: 12, color: "#A1A1AA", marginBottom: 8 }}>
              <span style={{ color: "#3B82F6" }}>MM Model: </span>
              {ict.market_maker_model}
            </div>
          )}
          {ict.analysis && (
            <p
              style={{
                fontSize: 13,
                color: "#D1D5DB",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {ict.analysis}
            </p>
          )}
        </Section>
      )}

      {(wyckoff || elliott_wave) && (
        <Section
          title="Wyckoff & Elliott Wave"
          icon={TrendingUp}
          color="#F59E0B"
          open={false}
        >
          {wyckoff && (
            <div style={{ fontSize: 13, color: "#D1D5DB", marginBottom: 6 }}>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                Wyckoff:{" "}
              </span>
              {wyckoff}
            </div>
          )}
          {elliott_wave && (
            <div style={{ fontSize: 13, color: "#D1D5DB" }}>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                Elliott Wave:{" "}
              </span>
              {elliott_wave}
            </div>
          )}
        </Section>
      )}

      {narrative && (
        <Section
          title="What Institutional Money Is Doing"
          icon={Brain}
          color="#10B981"
        >
          <div
            style={{
              fontSize: 13,
              color: "#D1D5DB",
              lineHeight: 1.75,
              whiteSpace: "pre-line",
            }}
          >
            {narrative}
          </div>
        </Section>
      )}

      {execution_plan.length > 0 && (
        <Section title="Execution Plan" icon={CheckCircle} color="#3B82F6">
          <ol style={{ margin: 0, padding: "0 0 0 16px" }}>
            {execution_plan.map((step, i) => (
              <li
                key={i}
                style={{
                  fontSize: 13,
                  color: "#D1D5DB",
                  lineHeight: 1.7,
                  marginBottom: 6,
                }}
              >
                {step}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {invalidation && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 8,
            backgroundColor: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.12)",
            marginBottom: 8,
          }}
        >
          <X
            size={13}
            color="#EF4444"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#EF4444",
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              INVALIDATION
            </div>
            <div style={{ fontSize: 12, color: "#D1D5DB" }}>{invalidation}</div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 14px",
          borderRadius: 8,
          backgroundColor: "rgba(245,158,11,0.04)",
          border: "1px solid rgba(245,158,11,0.12)",
        }}
      >
        <AlertTriangle
          size={13}
          color="#F59E0B"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <p
          style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.6, margin: 0 }}
        >
          {risk_note ||
            "AI analysis for educational purposes only. Never risk more than 1-2% of capital per trade."}
        </p>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("1D");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const userId = user?.id || "demo-user";

  const { data: history = [] } = useQuery({
    queryKey: ["chart-analyses"],
    queryFn: async () => {
      const res = await fetch("/api/chart-analyses");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const toBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const analyzeChart = async () => {
    if (!selectedFile) return toast.error("Upload a chart first");
    setAnalyzing(true);
    setError(null);
    try {
      const base64 = await toBase64(selectedFile);
      const prompt = `Analyze this ${symbol || ""} ${timeframe} chart. ${SMC_ICT_PROMPT}`;

      // Call GPT-4 Vision directly from frontend
      const res = await fetch("/integrations/gpt-vision/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: base64 } },
              ],
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(`Vision API error ${res.status}`);

      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content || "{}";
      let parsed;
      try {
        const m = raw.match(/\{[\s\S]*\}/);
        parsed = m
          ? JSON.parse(m[0])
          : { bias: "Neutral", confidence: 50, narrative: raw };
      } catch {
        parsed = { bias: "Neutral", confidence: 50, narrative: raw };
      }

      setAnalysis(parsed);

      // Save to backend
      try {
        await fetch("/api/analyze-chart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: "local-upload",
            symbol,
            timeframe,
            userId,
            analysis: parsed,
          }),
        });
        queryClient.invalidateQueries({ queryKey: ["chart-analyses"] });
      } catch (e) {
        console.error("Save error:", e);
      }

      toast.success("Chart analyzed successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/"))
      return toast.error("Upload an image file");
    if (file.size > 500 * 1024) return toast.error("Image must be under 500KB");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setError(null);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh", maxWidth: 1300 }}>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg,#8B5CF6,#3B82F6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(139,92,246,0.3)",
          }}
        >
          <Brain size={18} color="#fff" />
        </div>
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            AI Chart Analyzer
          </h1>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            SMC · ICT · Wyckoff analysis powered by GPT-4 Vision
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* Upload Panel */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Symbol (NIFTY, RELIANCE...)"
              style={{
                flex: 1,
                backgroundColor: "#111113",
                border: "1px solid #27272A",
                color: "#fff",
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
              }}
            />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              style={{
                backgroundColor: "#111113",
                border: "1px solid #27272A",
                color: "#A1A1AA",
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
              }}
            >
              {[
                "1m",
                "5m",
                "15m",
                "30m",
                "1H",
                "2H",
                "4H",
                "1D",
                "1W",
                "1M",
              ].map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>

          <div
            onClick={() => !selectedFile && fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? "#3B82F6" : "#27272A"}`,
              borderRadius: 12,
              backgroundColor: dragOver ? "rgba(59,130,246,0.04)" : "#111113",
              cursor: selectedFile ? "default" : "pointer",
              overflow: "hidden",
              minHeight: previewUrl ? "auto" : 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {previewUrl ? (
              <div style={{ position: "relative", width: "100%" }}>
                <img
                  src={previewUrl}
                  alt="chart"
                  style={{
                    width: "100%",
                    maxHeight: 360,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setAnalysis(null);
                    setError(null);
                  }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    border: "1px solid #27272A",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 36 }}>
                <Upload
                  size={32}
                  color="#3B82F6"
                  style={{ marginBottom: 12 }}
                />
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 6,
                  }}
                >
                  Drop chart image here
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>
                  PNG, JPG, WEBP · Max 500KB
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {selectedFile && (
            <button
              onClick={analyzeChart}
              disabled={analyzing}
              style={{
                width: "100%",
                marginTop: 12,
                background: analyzing
                  ? "#1f1f21"
                  : "linear-gradient(135deg,#8B5CF6,#3B82F6)",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: analyzing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {analyzing ? (
                <>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain size={18} />
                  Analyze Chart
                </>
              )}
            </button>
          )}

          {error && (
            <div
              style={{
                marginTop: 10,
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
                display: "flex",
                gap: 8,
              }}
            >
              <AlertTriangle size={13} color="#EF4444" />
              <span style={{ fontSize: 12, color: "#EF4444" }}>{error}</span>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontSize: 10,
                color: "#6B7280",
                fontWeight: 700,
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              RECENT ANALYSES
            </div>
            {history.length === 0 ? (
              <div
                style={{
                  fontSize: 13,
                  color: "#3f3f46",
                  textAlign: "center",
                  padding: "16px 0",
                }}
              >
                No analyses yet
              </div>
            ) : (
              history.slice(0, 6).map((h) => (
                <div
                  key={h.id}
                  onClick={() =>
                    setAnalysis(
                      typeof h.ai_response === "string"
                        ? JSON.parse(h.ai_response)
                        : h.ai_response,
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    marginBottom: 5,
                    backgroundColor: "#111113",
                    border: "1px solid #1f1f21",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}
                    >
                      {h.symbol || "Chart"} · {h.timeframe || ""}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Clock size={9} />
                      {new Date(h.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 10,
                      backgroundColor:
                        h.bias === "Bullish"
                          ? "rgba(16,185,129,0.1)"
                          : h.bias === "Bearish"
                            ? "rgba(239,68,68,0.1)"
                            : "rgba(161,161,170,0.1)",
                      color:
                        h.bias === "Bullish"
                          ? "#10B981"
                          : h.bias === "Bearish"
                            ? "#EF4444"
                            : "#A1A1AA",
                    }}
                  >
                    {h.bias || "?"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Result Panel */}
        <div
          style={{
            backgroundColor: "#0d0d0f",
            borderRadius: 14,
            border: "1px solid #1f1f21",
            padding: 20,
            minHeight: 500,
            position: "sticky",
            top: 24,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {analysis ? (
            <AnalysisResult analysis={analysis} />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: 400,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  backgroundColor: "rgba(139,92,246,0.05)",
                  border: "1px solid rgba(139,92,246,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Brain size={32} color="#27272A" />
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#3f3f46",
                  marginBottom: 8,
                }}
              >
                Analysis will appear here
              </div>
              <div style={{ fontSize: 13, color: "#27272A", maxWidth: 260 }}>
                Upload a chart and click Analyze to get SMC & ICT analysis
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
