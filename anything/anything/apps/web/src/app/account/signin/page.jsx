"use client";
import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Eye, EyeOff, TrendingUp, Lock, Mail, AlertCircle } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const msgs = {
        CredentialsSignin: "Incorrect email or password.",
        AccessDenied: "Access denied.",
        Configuration: "Server error. Try again later.",
      };
      setError(msgs[err.message] || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0A0B",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              marginBottom: 16,
              boxShadow: "0 0 40px rgba(59,130,246,0.3)",
            }}
          >
            <TrendingUp size={28} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
            Sign in to your AlphaEdge account
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "#111113",
            border: "1px solid #27272A",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          <form onSubmit={onSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 12,
                  color: "#A1A1AA",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                EMAIL ADDRESS
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  color="#6B7280"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@example.com"
                  autoComplete="email"
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "#0d0d0f",
                    border: "1px solid #27272A",
                    borderRadius: 10,
                    color: "#fff",
                    padding: "12px 14px 12px 42px",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
                  onBlur={(e) => (e.target.style.borderColor = "#27272A")}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label
                style={{
                  fontSize: 12,
                  color: "#A1A1AA",
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  color="#6B7280"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "#0d0d0f",
                    border: "1px solid #27272A",
                    borderRadius: 10,
                    color: "#fff",
                    padding: "12px 44px 12px 42px",
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
                  onBlur={(e) => (e.target.style.borderColor = "#27272A")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#6B7280",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  backgroundColor: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginBottom: 16,
                  marginTop: 8,
                }}
              >
                <AlertCircle
                  size={14}
                  color="#EF4444"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span style={{ fontSize: 13, color: "#EF4444" }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "13px",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: error ? 0 : 20,
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.15s",
                letterSpacing: "-0.2px",
                boxSizing: "border-box",
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: "#27272A" }} />
            <span style={{ fontSize: 12, color: "#3f3f46" }}>OR</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "#27272A" }} />
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#6B7280",
              margin: 0,
            }}
          >
            Don't have an account?{" "}
            <a
              href="/account/signup"
              style={{
                color: "#3B82F6",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Create account
            </a>
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#3f3f46",
            marginTop: 20,
            lineHeight: 1.6,
          }}
        >
          For educational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
}
