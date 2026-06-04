"use client";
import useAuth from "@/utils/useAuth";
import { LogOut, TrendingUp } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
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
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 380 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "linear-gradient(135deg, #3B82F6, #6366F1)",
            marginBottom: 24,
          }}
        >
          <TrendingUp size={28} color="#fff" />
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 10px",
          }}
        >
          Sign out of AlphaEdge?
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}
        >
          Your watchlists, journal, and analyses are saved and ready for when
          you return.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={handleSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <LogOut size={16} /> Yes, Sign Out
          </button>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#111113",
              border: "1px solid #27272A",
              color: "#A1A1AA",
              padding: "12px 24px",
              borderRadius: 10,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
