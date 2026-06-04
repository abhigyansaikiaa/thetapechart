import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  BookOpen,
  Bell,
  MessageSquare,
  GraduationCap,
  FileText,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Globe,
  Landmark,
  Brain,
  Menu,
  X,
  PieChart,
  LogIn,
  LogOut,
  Zap,
  User,
} from "lucide-react";
import useUser from "@/utils/useUser";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Brain, label: "AI Analyzer", path: "/analyze", highlight: true },
  { icon: Search, label: "Screener", path: "/screener" },
  { icon: Bell, label: "Watchlist", path: "/watchlist" },
  { icon: BookOpen, label: "Journal", path: "/journal" },
  { icon: BarChart3, label: "Options", path: "/options" },
  { icon: Globe, label: "Macro", path: "/macro" },
  { icon: TrendingUp, label: "News", path: "/news" },
  { icon: MessageSquare, label: "AI Mentor", path: "/mentor" },
  { icon: PieChart, label: "Mutual Funds", path: "/mf" },
  { icon: Landmark, label: "Fundamental", path: "/fundamental/RELIANCE" },
  { icon: GraduationCap, label: "Learn", path: "/learn" },
  { icon: FileText, label: "Blog", path: "/blog" },
  { icon: Wrench, label: "Tools", path: "/tools" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Navigation() {
  const [pathname, setPathname] = useState("/");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useUser();

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    // Broadcast collapsed state to main content via body class
    document.body.classList.toggle("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const sidebarWidth = collapsed ? 64 : 240;

  const NavItem = ({ icon: Icon, label, path, highlight }) => {
    const active = isActive(path);
    return (
      <a
        href={path}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: collapsed ? "10px 0" : "9px 12px",
          justifyContent: collapsed ? "center" : "flex-start",
          margin: "1px 8px",
          borderRadius: 8,
          textDecoration: "none",
          backgroundColor: active
            ? "rgba(59,130,246,0.12)"
            : highlight && !active
              ? "rgba(139,92,246,0.06)"
              : "transparent",
          color: active ? "#3B82F6" : "#A1A1AA",
          fontWeight: active ? 600 : 400,
          fontSize: 13,
          transition: "all 0.15s ease",
          borderLeft: active ? "2px solid #3B82F6" : "2px solid transparent",
          whiteSpace: "nowrap",
          position: "relative",
        }}
        title={collapsed ? label : undefined}
      >
        <Icon
          size={17}
          style={{
            flexShrink: 0,
            color: active
              ? "#3B82F6"
              : highlight && !active
                ? "#8B5CF6"
                : "#6B7280",
          }}
        />
        {!collapsed && (
          <span style={{ color: active ? "#3B82F6" : "#D1D5DB" }}>{label}</span>
        )}
        {highlight && !active && !collapsed && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 9,
              fontWeight: 700,
              color: "#8B5CF6",
              backgroundColor: "rgba(139,92,246,0.12)",
              padding: "1px 6px",
              borderRadius: 10,
              letterSpacing: "0.04em",
            }}
          >
            AI
          </span>
        )}
      </a>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: sidebarWidth,
          backgroundColor: "#0d0d0f",
          borderRight: "1px solid #1f1f21",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
        className="ae-sidebar"
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? "16px 0" : "16px 16px",
            borderBottom: "1px solid #1f1f21",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            minHeight: 60,
            gap: 8,
          }}
        >
          {!collapsed && (
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                  boxShadow: "0 0 12px rgba(59,130,246,0.3)",
                }}
              >
                A
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    color: "#fff",
                    letterSpacing: "-0.3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  AlphaEdge
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6B7280",
                    marginTop: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  AI Trading Intelligence
                </div>
              </div>
            </a>
          )}
          {collapsed && (
            <a href="/" style={{ textDecoration: "none" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                A
              </div>
            </a>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "1px solid #27272A",
              borderRadius: 6,
              color: "#6B7280",
              cursor: "pointer",
              padding: "4px 6px",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              transition: "color 0.15s",
            }}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav
          style={{
            flex: 1,
            padding: "8px 0",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* Market status pill */}
          {!collapsed && (
            <div
              style={{
                margin: "4px 8px 8px",
                padding: "6px 10px",
                backgroundColor: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.15)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                  boxShadow: "0 0 6px rgba(16,185,129,0.6)",
                }}
              />
              <span style={{ fontSize: 11, color: "#10B981", fontWeight: 500 }}>
                NSE Live
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  marginLeft: "auto",
                  fontFamily: "JetBrains Mono,monospace",
                }}
              >
                {new Date().toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}{" "}
                IST
              </span>
            </div>
          )}

          {navItems.map(({ icon: Icon, label, path, highlight }) => (
            <NavItem
              key={path}
              icon={Icon}
              label={label}
              path={path}
              highlight={highlight}
            />
          ))}
        </nav>

        {/* User Section */}
        <div
          style={{
            borderTop: "1px solid #1f1f21",
            padding: collapsed ? "12px 0" : "12px 10px",
          }}
        >
          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: collapsed ? "0" : "0",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {user.name
                  ? user.name[0].toUpperCase()
                  : user.email?.[0]?.toUpperCase() || "U"}
              </div>
              {!collapsed && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#fff",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name || "Trader"}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6B7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </div>
                </div>
              )}
              {!collapsed && (
                <a
                  href="/account/logout"
                  title="Sign Out"
                  style={{
                    color: "#6B7280",
                    display: "flex",
                    padding: 4,
                  }}
                >
                  <LogOut size={14} />
                </a>
              )}
            </div>
          ) : (
            <a
              href="/account/signin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: collapsed ? "8px 0" : "8px 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                backgroundColor: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: 8,
                textDecoration: "none",
                color: "#3B82F6",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <LogIn size={15} />
              {!collapsed && "Sign In"}
            </a>
          )}
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          backgroundColor: "#0d0d0f",
          borderBottom: "1px solid #1f1f21",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 50,
        }}
        className="ae-mobile-bar"
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            A
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>
            AlphaEdge
          </span>
        </a>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#A1A1AA",
            cursor: "pointer",
            display: "flex",
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 49 }}>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.75)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 56,
              left: 0,
              bottom: 0,
              width: 240,
              backgroundColor: "#0d0d0f",
              borderRight: "1px solid #1f1f21",
              padding: "8px 0",
              overflowY: "auto",
            }}
          >
            {navItems.map(({ icon: Icon, label, path }) => {
              const active = isActive(path);
              return (
                <a
                  key={path}
                  href={path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    margin: "1px 8px",
                    borderRadius: 8,
                    textDecoration: "none",
                    backgroundColor: active
                      ? "rgba(59,130,246,0.12)"
                      : "transparent",
                    color: active ? "#3B82F6" : "#D1D5DB",
                    fontWeight: active ? 600 : 400,
                    fontSize: 13,
                    borderLeft: active
                      ? "2px solid #3B82F6"
                      : "2px solid transparent",
                  }}
                >
                  <Icon
                    size={17}
                    style={{ color: active ? "#3B82F6" : "#6B7280" }}
                  />
                  <span>{label}</span>
                </a>
              );
            })}
            <div
              style={{
                borderTop: "1px solid #1f1f21",
                margin: "8px 8px 0",
                padding: "12px 8px 0",
              }}
            >
              {user ? (
                <a
                  href="/account/logout"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 4px",
                    color: "#6B7280",
                    textDecoration: "none",
                    fontSize: 13,
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </a>
              ) : (
                <a
                  href="/account/signin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    backgroundColor: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: 8,
                    color: "#3B82F6",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <LogIn size={14} /> Sign In
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .ae-sidebar { display: flex !important; } .ae-mobile-bar { display: none !important; } }
        @media (max-width: 768px) { .ae-sidebar { display: none !important; } .ae-mobile-bar { display: flex !important; } }
      `}</style>
    </>
  );
}
