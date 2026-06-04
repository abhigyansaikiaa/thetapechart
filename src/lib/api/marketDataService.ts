export interface ChartDataPoint {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  value?: number; // for volume/line charts
}

/**
 * Fetches historical data from Binance (Crypto only)
 * Symbol format: "BTCUSDT", "ETHUSDT"
 */
export async function fetchBinanceData(symbol: string, interval = "1h", limit = 1000): Promise<ChartDataPoint[]> {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
    const data = await res.json();
    
    return data.map((d: any) => ({
      time: Math.floor(d[0] / 1000), // convert ms to seconds
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
    }));
  } catch (error) {
    console.error(`Failed to fetch Binance data for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetches historical data from Yahoo Finance via local proxy (Stocks, Forex, Indices)
 * Symbol format: "RELIANCE.NS", "EURUSD=X", "^NSEI"
 */
export async function fetchYahooData(symbol: string, interval = "1d", range = "1mo"): Promise<ChartDataPoint[]> {
  try {
    const res = await fetch(`/api/proxy/yahoo?symbol=${symbol}&interval=${interval}&range=${range}`);
    const data = await res.json();

    if (!data.chart?.result?.[0]) return [];

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    if (!timestamps || !quotes) return [];

    const chartData: ChartDataPoint[] = [];
    let lastValidClose = 0;
    
    for (let i = 0; i < timestamps.length; i++) {
      let o = quotes.open[i];
      let h = quotes.high[i];
      let l = quotes.low[i];
      let c = quotes.close[i];

      if (o === null || c === null) {
        if (lastValidClose === 0) continue; // Skip leading nulls
        o = lastValidClose;
        h = lastValidClose;
        l = lastValidClose;
        c = lastValidClose;
      } else {
        lastValidClose = c;
      }

      chartData.push({
        time: timestamps[i],
        open: o,
        high: h,
        low: l,
        close: c,
      });
    }
    
    // Sort by time just in case
    return chartData.sort((a, b) => a.time - b.time);
  } catch (error) {
    console.error(`Failed to fetch Yahoo data for ${symbol}:`, error);
    return [];
  }
}

/**
 * Connects to Binance WebSocket for live price updates
 * Returns a cleanup function
 */
export function subscribeBinanceLive(symbol: string, interval = "1m", onUpdate: (data: ChartDataPoint) => void) {
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);
  
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.e === "kline") {
      const k = msg.k;
      onUpdate({
        time: Math.floor(k.t / 1000),
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      });
    }
  };

  return () => ws.close();
}
