"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, User, LogOut, ShieldCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Analyze", href: "/analyze" },
  { name: "Screener", href: "/screener" },
  { name: "Options", href: "/options" },
  { name: "Blog", href: "/blog" },
];

export function NavbarMock() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-end justify-center gap-1 mr-1 h-6">
            <div className="w-1.5 h-3 bg-foreground-muted rounded-t-sm"></div>
            <div className="w-1.5 h-6 bg-white rounded-t-sm shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>
            <div className="w-1.5 h-4 bg-foreground-muted rounded-t-sm"></div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white hidden sm:block uppercase">
            THE TAPE<span className="text-foreground-muted font-light ml-1.5">CHART</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-white ${
                  isActive ? "text-white" : "text-foreground-secondary"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-mock"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full font-medium">
            <ShieldCheck size={10} /> Mock Auth Mode
          </div>

          <button className="text-foreground-secondary hover:text-white transition-colors relative">
            <Bell size={20} />
            {/* Notification Badge indicator */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-negative rounded-full animate-pulse-glow" />
          </button>
          
          <div className="hidden sm:block relative" ref={dropdownRef}>
            {isSignedIn ? (
              <>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-8 h-8 rounded-full border border-border bg-surface-elevated hover:bg-surface-hover flex items-center justify-center text-white text-xs font-bold transition-all overflow-hidden"
                >
                  JD
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-surface-elevated border border-border rounded-lg shadow-xl py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-border/50">
                        <p className="text-sm font-semibold text-white">John Doe</p>
                        <p className="text-xs text-foreground-secondary truncate">john.doe@mock.com</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsSignedIn(false);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-negative hover:bg-surface flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <button 
                onClick={() => setIsSignedIn(true)}
                className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-foreground-secondary hover:text-white transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
