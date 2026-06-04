"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, ChevronRight, BookOpen, Search } from "lucide-react";

const CATEGORIES = [
  "All",
  "SMC Concepts",
  "ICT Methodology",
  "Options Trading",
  "Mutual Funds",
  "Macro Economy",
  "Trade Setups",
  "Trader Psychology",
  "Risk Management",
];

const CATEGORY_COLORS = {
  "SMC Concepts": "#8B5CF6",
  "ICT Methodology": "#3B82F6",
  "Options Trading": "#F59E0B",
  "Mutual Funds": "#10B981",
  "Macro Economy": "#EC4899",
  "Trade Setups": "#14B8A6",
  "Trader Psychology": "#F97316",
  "Risk Management": "#EF4444",
  "Stock Analysis": "#6366F1",
};

function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || "#6B7280";
}

function BlogCard({ post }) {
  const color = getCategoryColor(post.category);
  return (
    <a
      href={`/blog/${post.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="card"
        style={{
          borderRadius: 12,
          overflow: "hidden",
          transition: "border-color 0.15s, transform 0.15s",
          cursor: "pointer",
        }}
      >
        {post.featured_image ? (
          <div
            style={{
              height: 180,
              backgroundImage: `url(${post.featured_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#1a1a1c",
            }}
          />
        ) : (
          <div
            style={{
              height: 160,
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #27272A",
            }}
          >
            <BookOpen size={40} color={color} style={{ opacity: 0.4 }} />
          </div>
        )}
        <div style={{ padding: "18px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color,
                backgroundColor: `${color}15`,
                padding: "2px 10px",
                borderRadius: 20,
                border: `1px solid ${color}30`,
                letterSpacing: "0.03em",
              }}
            >
              {post.category?.toUpperCase()}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Clock size={10} /> {post.reading_time} min read
            </span>
          </div>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 8px",
              lineHeight: 1.5,
            }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                margin: "0 0 12px",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, color: "#3f3f46" }}>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Draft"}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#3B82F6",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Read more <ChevronRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function FeaturedPost({ post }) {
  const color = getCategoryColor(post.category);
  return (
    <a
      href={`/blog/${post.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="card"
        style={{
          borderRadius: 14,
          padding: "28px 32px",
          marginBottom: 24,
          background: `linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 100%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color,
              backgroundColor: `${color}15`,
              padding: "3px 10px",
              borderRadius: 20,
              border: `1px solid ${color}30`,
            }}
          >
            {post.category?.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#F59E0B",
              backgroundColor: "rgba(245,158,11,0.1)",
              padding: "3px 10px",
              borderRadius: 20,
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            FEATURED
          </span>
        </div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 10px",
            lineHeight: 1.4,
            maxWidth: 600,
          }}
        >
          {post.title}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "#A1A1AA",
            margin: "0 0 16px",
            lineHeight: 1.7,
            maxWidth: 620,
          }}
        >
          {post.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 12,
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Clock size={12} /> {post.reading_time} min read
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#3B82F6",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontWeight: 600,
            }}
          >
            Read article <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function BlogPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", category],
    queryFn: async () => {
      const res = await fetch(`/api/blog?category=${category}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const filtered = posts.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()),
  );
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 8px",
          }}
        >
          Trading Intelligence Blog
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Hard-won market insights · SMC · ICT · Options · Macro · Psychology
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 380, marginBottom: 20 }}>
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
          placeholder="Search articles..."
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

      {/* Category Pills */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              backgroundColor: category === c ? "#3B82F6" : "#111113",
              border: `1px solid ${category === c ? "#3B82F6" : "#27272A"}`,
              color: category === c ? "#fff" : "#A1A1AA",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shimmer"
              style={{ height: 300, borderRadius: 12 }}
            />
          ))}
        </div>
      ) : (
        <>
          {featured && <FeaturedPost post={featured} />}
          {rest.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 16,
              }}
            >
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#3f3f46" }}>
              <BookOpen size={40} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                No articles found
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
