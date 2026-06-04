import { create } from 'zustand'
import { MarketIndex, SectorData, StockData } from '@/types/market'

interface MarketState {
  indices: MarketIndex[];
  topGainers: StockData[];
  topLosers: StockData[];
  sectors: SectorData[];
  fearGreedIndex: number;
  isLoading: boolean;
  setIndices: (indices: MarketIndex[]) => void;
  setTopGainersLosers: (gainers: StockData[], losers: StockData[]) => void;
  setSectors: (sectors: SectorData[]) => void;
  setFearGreedIndex: (value: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  indices: [],
  topGainers: [],
  topLosers: [],
  sectors: [],
  fearGreedIndex: 50,
  isLoading: true,
  setIndices: (indices) => set({ indices }),
  setTopGainersLosers: (gainers, losers) => set({ topGainers: gainers, topLosers: losers }),
  setSectors: (sectors) => set({ sectors }),
  setFearGreedIndex: (value) => set({ fearGreedIndex: value }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
