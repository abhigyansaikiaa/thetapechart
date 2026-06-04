"use client";
import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Download,
  Trash2,
  ChevronRight,
  Save,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import useUser from "@/utils/useUser";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "trading", label: "Trading Defaults", icon: Settings },
  { id: "security", label: "Data & Security", icon: Shield },
];

function FormField({ label, value, onChange, type = "text", options }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          fontSize: 12,
          color: "#6B7280",
          display: "block",
          marginBottom: 8,
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "#0d0d0f",
            border: "1px solid #27272A",
            color: "#fff",
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "#0d0d0f",
            border: "1px solid #27272A",
            color: "#fff",
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
          }}
        />
      )}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: "1px solid #1f1f21",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
          {label}
        </div>
        {desc && (
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>
            {desc}
          </div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          position: "relative",
          backgroundColor: checked ? "#3B82F6" : "#27272A",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: "#fff",
            position: "absolute",
            top: 3,
            left: checked ? 22 : 3,
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { data: authUser } = useUser();
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    style: "swing",
    level: "intermediate",
    capital: "10L-50L",
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    inappAlerts: true,
    priceAlerts: true,
    morningBrief: true,
    weeklyReport: false,
    tradeReminders: true,
  });
  const [trading, setTrading] = useState({
    defaultLotSize: "1",
    timezone: "Asia/Kolkata",
    currency: "INR",
    riskPerTrade: "1",
  });

  // Pre-populate with real auth data
  useEffect(() => {
    if (authUser) {
      setProfile((p) => ({
        ...p,
        name: authUser.name || p.name,
        email: authUser.email || p.email,
      }));
    }
  }, [authUser]);

  const handleSave = () => {
    toast.success("Settings saved");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
        }}
      >
        <Settings size={20} color="#3B82F6" />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
          Settings
        </h1>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}
      >
        {/* Nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                backgroundColor:
                  section === s.id ? "rgba(59,130,246,0.1)" : "transparent",
                borderLeft: `2px solid ${section === s.id ? "#3B82F6" : "transparent"}`,
                color: section === s.id ? "#fff" : "#A1A1AA",
                fontSize: 14,
                fontWeight: section === s.id ? 600 : 400,
              }}
            >
              <s.icon size={16} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: 28, borderRadius: 14 }}>
          {section === "profile" && (
            <>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 24px",
                }}
              >
                Profile Settings
              </h2>
              <FormField
                label="Display Name"
                value={profile.name}
                onChange={(v) => setProfile((p) => ({ ...p, name: v }))}
              />
              <FormField
                label="Email Address"
                value={profile.email}
                onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                type="email"
              />
              <FormField
                label="Trading Style"
                value={profile.style}
                onChange={(v) => setProfile((p) => ({ ...p, style: v }))}
                options={[
                  { value: "scalp", label: "Scalper (< 1 day)" },
                  { value: "intraday", label: "Intraday (1 day)" },
                  { value: "swing", label: "Swing Trader (2-14 days)" },
                  { value: "positional", label: "Positional (weeks-months)" },
                  { value: "investor", label: "Long-term Investor" },
                ]}
              />
              <FormField
                label="Experience Level"
                value={profile.level}
                onChange={(v) => setProfile((p) => ({ ...p, level: v }))}
                options={[
                  { value: "beginner", label: "Beginner (< 1 year)" },
                  { value: "intermediate", label: "Intermediate (1-3 years)" },
                  { value: "advanced", label: "Advanced (3-7 years)" },
                  { value: "expert", label: "Expert (7+ years)" },
                ]}
              />
              <FormField
                label="Trading Capital Range"
                value={profile.capital}
                onChange={(v) => setProfile((p) => ({ ...p, capital: v }))}
                options={[
                  { value: "<1L", label: "Under ₹1 Lakh" },
                  { value: "1L-10L", label: "₹1L - ₹10L" },
                  { value: "10L-50L", label: "₹10L - ₹50L" },
                  { value: "50L-2Cr", label: "₹50L - ₹2Cr" },
                  { value: ">2Cr", label: "Above ₹2 Crore" },
                ]}
              />
            </>
          )}

          {section === "notifications" && (
            <>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 24px",
                }}
              >
                Notification Preferences
              </h2>
              <Toggle
                label="Email Price Alerts"
                desc="Get notified by email when price targets are hit"
                checked={notifications.emailAlerts}
                onChange={(v) =>
                  setNotifications((p) => ({ ...p, emailAlerts: v }))
                }
              />
              <Toggle
                label="In-App Alerts"
                desc="Show alerts within the dashboard"
                checked={notifications.inappAlerts}
                onChange={(v) =>
                  setNotifications((p) => ({ ...p, inappAlerts: v }))
                }
              />
              <Toggle
                label="Morning Brief"
                desc="Daily market summary at 9:00 AM IST"
                checked={notifications.morningBrief}
                onChange={(v) =>
                  setNotifications((p) => ({ ...p, morningBrief: v }))
                }
              />
              <Toggle
                label="Weekly Performance Report"
                desc="Sunday evening summary of your trade journal"
                checked={notifications.weeklyReport}
                onChange={(v) =>
                  setNotifications((p) => ({ ...p, weeklyReport: v }))
                }
              />
              <Toggle
                label="Trade Entry Reminders"
                desc="Remind me of open setups in my watchlist"
                checked={notifications.tradeReminders}
                onChange={(v) =>
                  setNotifications((p) => ({ ...p, tradeReminders: v }))
                }
              />
            </>
          )}

          {section === "trading" && (
            <>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 24px",
                }}
              >
                Trading Defaults
              </h2>
              <FormField
                label="Default Lot Size"
                value={trading.defaultLotSize}
                onChange={(v) =>
                  setTrading((p) => ({ ...p, defaultLotSize: v }))
                }
                type="number"
              />
              <FormField
                label="Risk per Trade"
                value={trading.riskPerTrade}
                onChange={(v) => setTrading((p) => ({ ...p, riskPerTrade: v }))}
                type="number"
              />
              <FormField
                label="Timezone"
                value={trading.timezone}
                onChange={(v) => setTrading((p) => ({ ...p, timezone: v }))}
                options={[
                  { value: "Asia/Kolkata", label: "IST (Asia/Kolkata)" },
                  { value: "America/New_York", label: "EST (New York)" },
                  { value: "Europe/London", label: "GMT (London)" },
                ]}
              />
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: 10,
                  backgroundColor: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  fontSize: 13,
                  color: "#A1A1AA",
                  lineHeight: 1.7,
                }}
              >
                💡 Your position size calculator will use these defaults
                automatically in every new calculation.
              </div>
            </>
          )}

          {section === "security" && (
            <>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 24px",
                }}
              >
                Data & Security
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <button
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    backgroundColor: "#0d0d0f",
                    border: "1px solid #27272A",
                    borderRadius: 10,
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <Download size={16} color="#10B981" />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        Export All Data
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                      >
                        Download trades, analyses, and settings as JSON
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#6B7280" />
                </button>
                <button
                  onClick={() => toast.success("Data cleared")}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    backgroundColor: "#0d0d0f",
                    border: "1px solid #27272A",
                    borderRadius: 10,
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <Shield size={16} color="#F59E0B" />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        Privacy Settings
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                      >
                        Control what data is stored and processed
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#6B7280" />
                </button>
                <button
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    backgroundColor: "rgba(239,68,68,0.04)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 10,
                    cursor: "pointer",
                    color: "#EF4444",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <Trash2 size={16} />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        Delete Account
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#EF4444",
                          marginTop: 2,
                          opacity: 0.7,
                        }}
                      >
                        Permanently delete all data — cannot be undone
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}

          {section !== "security" && (
            <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#3B82F6",
                  color: "#fff",
                  border: "none",
                  padding: "11px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
