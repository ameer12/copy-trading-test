import { FollowerAccount, LeaderTrade } from './types.js';

export const leaderTrades: LeaderTrade[] = [
  { id: 'lt_101', symbol: 'BTCUSDT', side: 'BUY', quantity: 0.5, price: 68000, leverage: 5, timestamp: new Date().toISOString() },
  { id: 'lt_102', symbol: 'ETHUSDT', side: 'SELL', quantity: 3, price: 3600, leverage: 3, timestamp: new Date().toISOString() },
  { id: 'lt_103', symbol: 'SOLUSDT', side: 'BUY', quantity: 40, price: 155, leverage: 2, timestamp: new Date().toISOString() }
];

export const followers: FollowerAccount[] = [
  {
    id: 'f_001',
    name: 'Alice Conservative',
    equity: 10000,
    availableBalance: 8000,
    copyRatio: 0.25,
    maxLeverage: 3,
    maxNotionalPerTrade: 5000,
    allowedSymbols: ['BTCUSDT', 'ETHUSDT']
  },
  {
    id: 'f_002',
    name: 'Ben Aggressive',
    equity: 50000,
    availableBalance: 32000,
    copyRatio: 1.2,
    maxLeverage: 10,
    maxNotionalPerTrade: 75000,
    allowedSymbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']
  },
  {
    id: 'f_003',
    name: 'Cara Low Balance',
    equity: 1200,
    availableBalance: 150,
    copyRatio: 0.5,
    maxLeverage: 2,
    maxNotionalPerTrade: 1000,
    allowedSymbols: ['BTCUSDT', 'SOLUSDT']
  }
];
