import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { auth } from "@clerk/nextjs/server";
import { validateDeviceLock } from "@/lib/security/deviceTracking";
import { Lock } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  
  let isDeviceValid = true;
  if (userId) {
    const { isValid } = await validateDeviceLock(userId);
    isDeviceValid = isValid;
  }

  if (!isDeviceValid) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 text-center flex flex-col items-center border border-negative/20 shadow-2xl shadow-negative/5">
          <div className="w-16 h-16 rounded-full bg-negative/10 flex items-center justify-center mb-6 text-negative">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Device Locked</h1>
          <p className="text-foreground-secondary mb-6 text-sm">
            Your account is locked to your original device to prevent account sharing. You cannot access The Tape Chart from this new device.
          </p>
          <div className="p-3 bg-surface rounded text-xs text-foreground-muted w-full border border-border/50 text-left">
            <p className="font-bold text-white mb-1">Security Policy:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Accounts cannot be shared between multiple people.</li>
              <li>You may only use the device you originally signed up with.</li>
              <li>Contact support if you have genuinely lost access to your original device.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex pt-16">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-w-0 bg-background relative">
          <div className="flex-grow flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 pb-24 md:pb-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      <MobileTabBar />
      <BackToTop />
    </div>
  );
}
