export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  entry: number;
  exit: number;
  sl: number;
  tp: number;
  size: number;
  instrument: string;
  strategy: string;
  screenshotUrl?: string;
  notes?: string;
  pnl: number;
  rrRatio: number;
  status: 'OPEN' | 'CLOSED';
  createdAt: Date;
}
