"use client";
import { Home, Search, Brain, BarChart2, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#1f1f21",
            fontFamily: "JetBrains Mono, monospace",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 10px",
          }}
        >
          This page doesn't exist
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: "0 0 32px",
            lineHeight: 1.7,
          }}
        >
          Just like a trade that vanished at the order block — this page isn't
          here. Maybe it was a liquidity sweep. Let's get you back on track.
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#3B82F6",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Home size={14} /> Dashboard
          </a>
          <a
            href="/analyze"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#111113",
              border: "1px solid #27272A",
              color: "#A1A1AA",
              padding: "10px 18px",
              borderRadius: 8,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            <Brain size={14} /> AI Analyzer
          </a>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { href: "/journal", icon: BookOpen, label: "Journal" },
            { href: "/screener", icon: Search, label: "Screener" },
            { href: "/options", icon: BarChart2, label: "Options" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: "#6B7280",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #1f1f21",
              }}
            >
              <l.icon size={12} /> {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
