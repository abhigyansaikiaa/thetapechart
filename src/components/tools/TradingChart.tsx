"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries } from "lightweight-charts";
import { fetchBinanceData, fetchYahooData, subscribeBinanceLive, ChartDataPoint } from "@/lib/api/marketDataService";
import { Loader2 } from "lucide-react";

interface TradingChartProps {
  symbol: string;
  assetType: "crypto" | "stock" | "forex";
  interval: string;
}

export function TradingChart({ symbol, assetType, interval }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0A0A0B" },
        textColor: "#A1A1AA",
      },
      grid: {
        vertLines: { color: "#1F1F21" },
        horzLines: { color: "#1F1F21" },
      },
      crosshair: {
        mode: 0,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      autoSize: true,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      downColor: "#EF4444",
      borderVisible: false,
      wickUpColor: "#10B981",
      wickDownColor: "#EF4444",
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Fetch historical data
    async function loadData() {
      setLoading(true);
      setNoData(false);
      let data: ChartDataPoint[] = [];
      
      if (assetType === "crypto") {
        data = await fetchBinanceData(symbol, interval, 1000);
      } else {
        // Map interval to yahoo format
        let yahooInterval = "1d";
        let range = "1y";
        if (interval === "1m") { yahooInterval = "1m"; range = "5d"; }
        if (interval === "5m") { yahooInterval = "5m"; range = "1mo"; }
        if (interval === "15m") { yahooInterval = "15m"; range = "1mo"; }
        if (interval === "1h") { yahooInterval = "1h"; range = "1mo"; }
        
        data = await fetchYahooData(symbol, yahooInterval, range);
      }

      if (data.length > 0) {
        candlestickSeries.setData(data as any);
      } else {
        setNoData(true);
      }
      setLoading(false);
    }

    loadData();

    // Setup live subscription for crypto
    let cleanup: () => void;
    if (assetType === "crypto" && interval === "1m") {
      cleanup = subscribeBinanceLive(symbol, "1m", (tick) => {
        candlestickSeries.update(tick as any);
      });
    }

    return () => {
      if (cleanup) cleanup();
      chart.remove();
    };
  }, [symbol, assetType, interval]);

  return (
    <div className="relative w-full h-[500px] border border-border rounded-xl overflow-hidden bg-[#0A0A0B]">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}
      {noData && !loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-center px-4">
          <p className="text-white font-bold mb-2">No Market Data Available</p>
          <p className="text-foreground-secondary text-sm">Yahoo Finance may not provide data for this specific timeframe ({interval}) outside of market hours. Try switching to a higher timeframe like 1d or 1h.</p>
        </div>
      )}
      {/* Chart Top Bar overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4 bg-surface-elevated/80 backdrop-blur px-4 py-2 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg">{symbol}</span>
          <span className="text-xs text-foreground-muted bg-surface px-2 py-0.5 rounded uppercase">{assetType}</span>
        </div>
        <div className="w-px h-4 bg-border"></div>
        <span className="text-sm font-medium text-foreground-secondary">{interval}</span>
      </div>
      
      {/* Chart container */}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
