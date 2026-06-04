import { ChartDataPoint } from "../api/marketDataService";

export interface LineData {
  time: number;
  value: number;
}

export function calculateSMA(data: ChartDataPoint[], period: number): LineData[] {
  const result: LineData[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}

export function calculateEMA(data: ChartDataPoint[], period: number): LineData[] {
  const result: LineData[] = [];
  if (data.length < period) return result;

  const multiplier = 2 / (period + 1);
  
  // Calculate initial SMA
  let initialSmaSum = 0;
  for (let i = 0; i < period; i++) {
    initialSmaSum += data[i].close;
  }
  let prevEma = initialSmaSum / period;
  result.push({ time: data[period - 1].time, value: prevEma });

  for (let i = period; i < data.length; i++) {
    const currentEma = (data[i].close - prevEma) * multiplier + prevEma;
    result.push({ time: data[i].time, value: currentEma });
    prevEma = currentEma;
  }

  return result;
}
