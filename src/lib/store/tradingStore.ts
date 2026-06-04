import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Trade {
  id: string;
  symbol: string;
  direction: "Long" | "Short";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  status: "Open" | "Closed";
  exitPrice?: number;
  pnl?: number;
  openedAt: number;
  closedAt?: number;
}

interface TradingState {
  balance: number;
  trades: Trade[];
  openTrade: (trade: Omit<Trade, "id" | "status" | "openedAt">) => void;
  closeTrade: (id: string, exitPrice: number) => void;
  resetBalance: (amount: number) => void;
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set) => ({
      balance: 100000, // $100k starting paper balance
      trades: [],

      openTrade: (trade) =>
        set((state) => {
          const newTrade: Trade = {
            ...trade,
            id: Math.random().toString(36).substring(7),
            status: "Open" as const,
            openedAt: Date.now(),
          };
          return { trades: [...state.trades, newTrade] };
        }),

      closeTrade: (id, exitPrice) =>
        set((state) => {
          const trade = state.trades.find((t) => t.id === id);
          if (!trade || trade.status === "Closed") return state;

          // Calculate PnL
          let pnl = 0;
          if (trade.direction === "Long") {
            pnl = (exitPrice - trade.entryPrice) * trade.quantity;
          } else {
            pnl = (trade.entryPrice - exitPrice) * trade.quantity;
          }

          const updatedTrades = state.trades.map((t) =>
            t.id === id
              ? { ...t, status: "Closed" as const, exitPrice, pnl, closedAt: Date.now() }
              : t
          );

          return {
            trades: updatedTrades,
            balance: state.balance + pnl,
          };
        }),

      resetBalance: (amount) => set({ balance: amount, trades: [] }),
    }),
    {
      name: "alphaedge-paper-trading",
    }
  )
);
