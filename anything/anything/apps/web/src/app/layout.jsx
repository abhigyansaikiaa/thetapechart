import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "../components/Navigation";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0A0A0B",
          color: "#ffffff",
          fontFamily: '"Inter", -apple-system, sans-serif',
        }}
      >
        <Navigation />
        <main className="ae-main">{children}</main>
        <Toaster position="top-right" theme="dark" richColors />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #0A0A0B; color: #fff; font-family: 'Inter', -apple-system, sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0d0d0f; }
        ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3B82F6; }
        /* Sidebar-aware layout */
        .ae-main { padding-left: 240px; min-height: 100vh; transition: padding-left 0.2s ease; }
        body.sidebar-collapsed .ae-main { padding-left: 64px; }
        @media (max-width: 768px) { .ae-main { padding-left: 0 !important; padding-top: 56px; } body.sidebar-collapsed .ae-main { padding-left: 0 !important; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse-ring { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .shimmer { background: linear-gradient(90deg, #111113 25%, #1a1a1c 50%, #111113 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
        .card { background: #111113; border: 1px solid #27272A; border-radius: 12px; transition: border-color 0.15s; }
        .card:hover { border-color: #3f3f46; }
        .positive { color: #10B981; }
        .negative { color: #EF4444; }
        .mono { font-family: 'JetBrains Mono', monospace !important; }
        a { color: inherit; text-decoration: none; }
        button { cursor: pointer; font-family: inherit; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #3B82F6 !important; }
      `}</style>
    </QueryClientProvider>
  );
}
