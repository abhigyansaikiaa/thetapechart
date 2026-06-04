"use client";

import { useState, useEffect } from "react";

export function PositionSizeCalculator() {
  const [accountSize, setAccountSize] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entryPrice, setEntryPrice] = useState(100);
  const [stopLoss, setStopLoss] = useState(95);

  const [results, setResults] = useState({
    riskAmount: 0,
    positionSize: 0,
    totalPositionValue: 0,
    leverageRequired: 1,
  });

  useEffect(() => {
    const riskAmount = (accountSize * riskPercent) / 100;
    const riskPerShare = Math.abs(entryPrice - stopLoss);
    
    let positionSize = 0;
    let totalPositionValue = 0;
    
    if (riskPerShare > 0) {
      positionSize = Math.floor(riskAmount / riskPerShare);
      totalPositionValue = positionSize * entryPrice;
    }

    setResults({
      riskAmount,
      positionSize,
      totalPositionValue,
      leverageRequired: totalPositionValue / accountSize,
    });
  }, [accountSize, riskPercent, entryPrice, stopLoss]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white mb-2">Input Parameters</h2>
        
        <div>
          <label className="block text-sm font-medium text-foreground-secondary mb-1">Account Size (₹)</label>
          <input 
            type="number" 
            value={accountSize} 
            onChange={e => setAccountSize(Number(e.target.value))}
            className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-white focus:border-accent outline-none font-numeric"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground-secondary mb-1">Risk Percentage (%)</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0.1" max="10" step="0.1"
              value={riskPercent} 
              onChange={e => setRiskPercent(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <span className="font-numeric text-white w-12 text-right">{riskPercent}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">Entry Price (₹)</label>
            <input 
              type="number" 
              value={entryPrice} 
              onChange={e => setEntryPrice(Number(e.target.value))}
              className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-white focus:border-accent outline-none font-numeric"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">Stop Loss (₹)</label>
            <input 
              type="number" 
              value={stopLoss} 
              onChange={e => setStopLoss(Number(e.target.value))}
              className="w-full bg-surface-elevated border border-border rounded-md px-3 py-2 text-white focus:border-accent outline-none font-numeric"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="glass-card p-6 bg-surface-elevated border-l-4 border-l-accent flex flex-col justify-center space-y-6">
        <div>
          <p className="text-sm font-medium text-foreground-secondary mb-1">Recommended Quantity (Shares)</p>
          <p className="text-4xl font-bold font-numeric text-white">{results.positionSize.toLocaleString()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div>
            <p className="text-xs font-medium text-foreground-secondary mb-1">Amount at Risk</p>
            <p className="text-lg font-bold font-numeric text-negative">₹{results.riskAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground-secondary mb-1">Total Position Value</p>
            <p className="text-lg font-bold font-numeric text-white">₹{results.totalPositionValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {results.leverageRequired > 1 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-md text-xs text-warning">
            <span className="font-bold">Leverage Warning:</span> You need {(results.leverageRequired).toFixed(1)}x leverage to take this position size with your current account balance.
          </div>
        )}
      </div>
    </div>
  );
}
