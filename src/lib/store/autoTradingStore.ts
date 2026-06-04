import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StrategyConfig {
  useSMA: boolean;
  smaPeriod1: number;
  smaPeriod2: number;
  useRSI: boolean;
  rsiOversold: number;
  rsiOverbought: number;
  maxRiskPerTradePercent: number;
  maxDailyLoss: number;
}

interface AutoTradingState {
  isAutoTrading: boolean;
  botProfile: string; // The text prompt for Gemini ML
  strategy: StrategyConfig;
  toggleAutoTrade: () => void;
  updateProfile: (profile: string) => void;
  updateStrategy: (config: Partial<StrategyConfig>) => void;
}

export const useAutoTradingStore = create<AutoTradingState>()(
  persist(
    (set) => ({
      isAutoTrading: false,
      botProfile: "I am a trend-following ICT sniper. I look for deep liquidity sweeps on higher timeframes and only enter trades when the RSI is oversold and price is reversing off a major Order Block. My risk management is strict.",
      strategy: {
        useSMA: true,
        smaPeriod1: 9,
        smaPeriod2: 21,
        useRSI: true,
        rsiOversold: 30,
        rsiOverbought: 70,
        maxRiskPerTradePercent: 1,
        maxDailyLoss: 5000,
      },
      toggleAutoTrade: () => set((state) => ({ isAutoTrading: !state.isAutoTrading })),
      updateProfile: (botProfile) => set({ botProfile }),
      updateStrategy: (config) => set((state) => ({ strategy: { ...state.strategy, ...config } })),
    }),
    {
      name: "alphaedge-bot-config",
    }
  )
);
