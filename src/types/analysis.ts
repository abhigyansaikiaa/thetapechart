export interface ChartAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  symbol?: string;
  timeframe?: string;
  aiResponse: {
    patterns: string[];
    smc: any;
    ict: any;
    bias: 'Bullish' | 'Bearish' | 'Neutral';
    confidence: number;
    entryZone: string;
    stopLoss: string;
    takeProfit: string[];
    riskReward: string;
    narrative: string;
    executionPlan: string[];
  };
  createdAt: Date;
}
