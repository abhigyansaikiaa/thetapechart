"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Tag,
  Calendar,
  Share2,
} from "lucide-react";

export default function BlogPostPage({ params }) {
  const { slug } = params;

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog?slug=${slug}`);
      if (!res.ok) throw new Error("Post not found");
      const data = await res.json();
      return Array.isArray(data) ? data[0] : data;
    },
  });

  if (isLoading) {
    return (
      <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
        <div
          className="shimmer"
          style={{ height: 24, width: 200, borderRadius: 8, marginBottom: 24 }}
        />
        <div
          className="shimmer"
          style={{
            height: 48,
            width: "80%",
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
        <div
          className="shimmer"
          style={{
            height: 20,
            width: "60%",
            borderRadius: 8,
            marginBottom: 32,
          }}
        />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="shimmer"
            style={{ height: 16, borderRadius: 4, marginBottom: 12 }}
          />
        ))}
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        style={{
          padding: 40,
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <BookOpen size={48} color="#27272A" style={{ marginBottom: 16 }} />
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 10,
          }}
        >
          Article not found
        </h1>
        <p style={{ color: "#6B7280", marginBottom: 24 }}>
          This article may have been moved or doesn't exist.
        </p>
        <a
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#3B82F6",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          <ArrowLeft size={14} /> Back to Blog
        </a>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("# "))
        return (
          <h1
            key={i}
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              margin: "32px 0 16px",
              letterSpacing: "-0.5px",
            }}
          >
            {line.slice(2)}
          </h1>
        );
      if (line.startsWith("## "))
        return (
          <h2
            key={i}
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              margin: "28px 0 12px",
              letterSpacing: "-0.3px",
            }}
          >
            {line.slice(3)}
          </h2>
        );
      if (line.startsWith("### "))
        return (
          <h3
            key={i}
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#E5E7EB",
              margin: "20px 0 10px",
            }}
          >
            {line.slice(4)}
          </h3>
        );
      if (line.startsWith("- "))
        return (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <span style={{ color: "#3B82F6", fontWeight: 700, flexShrink: 0 }}>
              —
            </span>
            <p
              style={{
                fontSize: 15,
                color: "#D1D5DB",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {line.slice(2)}
            </p>
          </div>
        );
      if (line.startsWith("**") && line.endsWith("**"))
        return (
          <p
            key={i}
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              lineHeight: 1.7,
            }}
          >
            {line.slice(2, -2)}
          </p>
        );
      if (line === "") return <div key={i} style={{ height: 8 }} />;
      return (
        <p
          key={i}
          style={{
            fontSize: 15,
            color: "#D1D5DB",
            lineHeight: 1.75,
            margin: "0 0 12px",
          }}
        >
          {line}
        </p>
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Back */}
      <div
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #1f1f21",
          backgroundColor: "#0d0d0f",
        }}
      >
        <a
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#6B7280",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> Back to Blog
        </a>
      </div>

      <div
        style={{ maxWidth: 760, margin: "0 auto", padding: "40px 40px 80px" }}
      >
        {/* Category */}
        <div style={{ marginBottom: 16 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#3B82F6",
              backgroundColor: "rgba(59,130,246,0.1)",
              padding: "4px 10px",
              borderRadius: 20,
              letterSpacing: "0.06em",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 16px",
            lineHeight: 1.2,
            letterSpacing: "-0.8px",
          }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
            paddingBottom: 32,
            borderBottom: "1px solid #1f1f21",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "linear-gradient(135deg,#3B82F6,#6366F1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              A
            </div>
            <span style={{ fontSize: 13, color: "#A1A1AA", fontWeight: 500 }}>
              AlphaEdge Research
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#6B7280",
              fontSize: 12,
            }}
          >
            <Calendar size={12} />
            {new Date(post.published_at || post.created_at).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "long", year: "numeric" },
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#6B7280",
              fontSize: 12,
            }}
          >
            <Clock size={12} />
            {post.reading_time || 5} min read
          </div>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
            }}
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#111113",
              border: "1px solid #27272A",
              color: "#6B7280",
              padding: "5px 10px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            <Share2 size={12} /> Share
          </button>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div
            style={{
              backgroundColor: "rgba(59,130,246,0.05)",
              border: "1px solid rgba(59,130,246,0.15)",
              borderLeft: "3px solid #3B82F6",
              borderRadius: "0 10px 10px 0",
              padding: "14px 18px",
              marginBottom: 32,
            }}
          >
            <p
              style={{
                fontSize: 15,
                color: "#93C5FD",
                lineHeight: 1.7,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Content */}
        <div>{renderContent(post.content)}</div>

        {/* Footer */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid #1f1f21",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <a
              href="/blog"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#6B7280",
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              <ArrowLeft size={13} /> More articles
            </a>
            <a
              href="/mentor"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#111113",
                border: "1px solid #27272A",
                color: "#A1A1AA",
                padding: "8px 14px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Ask AI Mentor about this →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
