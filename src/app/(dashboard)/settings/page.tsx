"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Settings2, User, Shield, Bell, Key, CreditCard } from "lucide-react";

export default function SettingsPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Settings2 className="text-accent" size={28} />
            </div>
            Settings & Preferences
          </h1>
          <p className="text-foreground-secondary text-sm">
            Manage your account, billing, and application preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
          
          {/* Settings Sidebar */}
          <div className="space-y-1">
            {[
              { id: "profile", name: "Profile", icon: User, active: true },
              { id: "security", name: "Security", icon: Shield },
              { id: "notifications", name: "Notifications", icon: Bell },
              { id: "api-keys", name: "API Keys", icon: Key },
              { id: "billing", name: "Billing", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    tab.active 
                      ? "bg-accent/10 text-accent" 
                      : "text-foreground-secondary hover:text-white hover:bg-surface-hover"
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Settings Content Area */}
          <div className="md:col-span-3 space-y-6">
            
            {/* Profile Section */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4 border-b border-border/50 pb-4">Profile Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
                    <User size={32} className="text-foreground-muted" />
                  </div>
                  <div>
                    <button className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-hover border border-border rounded-md text-sm text-white transition-colors mb-1">
                      Change Avatar
                    </button>
                    <p className="text-xs text-foreground-muted">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground-secondary mb-1">First Name</label>
                    <input type="text" defaultValue="John" className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground-secondary mb-1">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-1">Email Address</label>
                  <input type="email" defaultValue="john.doe@example.com" disabled className="w-full bg-surface border border-border rounded-md px-3 py-2 text-foreground-muted cursor-not-allowed" />
                  <p className="text-xs text-foreground-muted mt-1">To change your email address, please visit the Security tab.</p>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="px-6 py-2 bg-accent hover:bg-accent-hover text-white rounded-md font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Trading Preferences */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4 border-b border-border/50 pb-4">Trading Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-1">Default Chart Layout</label>
                  <select className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                    <option>Single Chart</option>
                    <option>2 Charts (Split)</option>
                    <option>4 Charts (Grid)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-1">Base Currency</label>
                  <select className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-white focus:outline-none focus:border-accent">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
