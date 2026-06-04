"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { Menu, Bell, X } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Analyze", href: "/analyze" },
  { name: "Screener", href: "/screener" },
  { name: "Options", href: "/options" },
  { name: "Blog", href: "/blog" },
];

export function NavbarClient() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
                    layoutId="navbar-active"
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

          
          <div className="hidden sm:block">
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-border"
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground-secondary hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-xl border-t border-border/50 overflow-y-auto pb-32 px-4 pt-4 flex flex-col gap-2 z-40"
          style={{ WebkitBackdropFilter: "blur(24px)" }}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground-secondary hover:text-white py-3 px-4 rounded-lg hover:bg-surface transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/terminal"
            onClick={() => setMobileMenuOpen(false)}
            className="text-foreground-secondary hover:text-white py-3 px-4 rounded-lg hover:bg-surface transition-colors font-medium mt-2 border-t border-border/50"
          >
            Stock Terminal
          </Link>
          <Link
            href="/mentor"
            onClick={() => setMobileMenuOpen(false)}
            className="text-accent hover:text-accent-hover py-3 px-4 rounded-lg hover:bg-accent/10 transition-colors font-bold"
          >
            AI Mentor
          </Link>
        </div>
      )}
    </header>
  );
}
