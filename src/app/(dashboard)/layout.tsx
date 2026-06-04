import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
