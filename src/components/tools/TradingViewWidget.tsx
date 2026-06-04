"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  theme?: "dark" | "light";
  height?: number;
}

function TradingViewWidgetInner({ symbol, theme = "dark", height = 610 }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: theme,
      style: "1", // Candlestick
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      hide_side_toolbar: false,
      withdateranges: true,
      details: true,
      hotlist: true,
      studies: [
        "STD;EMA",
        "STD;RSI",
        "STD;MACD",
        "STD;Bollinger_Bands",
      ],
      backgroundColor: "rgba(10, 10, 11, 1)",
      gridColor: "rgba(31, 31, 33, 0.5)",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container w-full rounded-xl overflow-hidden border border-border" style={{ height }}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

export const TradingViewWidget = memo(TradingViewWidgetInner);
