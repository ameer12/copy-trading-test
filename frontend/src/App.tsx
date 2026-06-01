import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Side = 'BUY' | 'SELL';
type SymbolCode = 'BTCUSDT' | 'ETHUSDT' | 'SOLUSDT';

type Order = {
  followerId: string;
  followerName?: string;
  leaderTradeId: string;
  symbol: SymbolCode;
  side: Side;
  quantity: number;
  estimatedFillPrice: number;
  notional: number;
  marginRequired: number;
  status: 'ACCEPTED' | 'REJECTED';
  rejectionReason?: string;
};

type Summary = {
  acceptedCount: number;
  rejectedCount: number;
  totalNotional: number;
  totalMargin: number;
};

type Follower = {
  id: string;
  name: string;
  equity: number;
  availableBalance: number;
  copyRatio: number;
  maxLeverage: number;
  maxNotionalPerTrade: number;
  allowedSymbols: SymbolCode[];
};

const API_URL = 'http://localhost:4000/api';

function App() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [form, setForm] = useState({
    symbol: 'BTCUSDT' as SymbolCode,
    side: 'BUY' as Side,
    quantity: 0.5,
    price: 68000,
    leverage: 5
  });
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/followers`).then((res) => res.json()).then(setFollowers);
  }, []);

  function validate(): string {
    if (form.quantity <= 0) return 'Quantity must be greater than 0.';
    if (form.price <= 0) return 'Price must be greater than 0.';
    if (form.leverage < 1 || form.leverage > 125) return 'Leverage must be between 1 and 125.';
    return '';
  }

  async function simulateTrade(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSummary(null);

    const msg = validate();
    if (msg) { setValidationError(msg); return; }
    setValidationError('');
    setLoading(true);

    const response = await fetch(`${API_URL}/simulate-copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setLoading(false);
    const payload = await response.json();

    if (!response.ok) {
      setError('Please check quantity, price, and leverage.');
      return;
    }

    setOrders(payload.orders);
    setSummary(payload.summary);
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Demo</p>
        <h1>Copy Trading Simulator</h1>
        <p className="subtitle">Run a leader order and review copied follower orders with risk checks.</p>
      </section>

      <section className="grid">
        <form className="card" onSubmit={simulateTrade}>
          <h2>Leader trade</h2>
          <label>
            Symbol
            <select value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value as SymbolCode })}>
              <option>BTCUSDT</option>
              <option>ETHUSDT</option>
              <option>SOLUSDT</option>
            </select>
          </label>
          <label>
            Side
            <select value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value as Side })}>
              <option>BUY</option>
              <option>SELL</option>
            </select>
          </label>
          <label>
            Quantity
            <input type="number" step="0.001" min="0.001" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
          </label>
          <label>
            Price (USDT)
            <input type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </label>
          <label>
            Leverage (1–125×)
            <input type="number" min="1" max="125" value={form.leverage} onChange={(e) => setForm({ ...form, leverage: Number(e.target.value) })} />
          </label>
          <button disabled={loading}>{loading ? 'Running…' : 'Run simulation'}</button>
          {validationError && <p className="error">{validationError}</p>}
          {error && <p className="error">{error}</p>}
          <p className="hint">
            BUY slippage increases fill price · SELL slippage decreases fill price · Margin = Notional ÷ Follower leverage
          </p>
        </form>

        <section className="card">
          <h2>Followers</h2>
          <div className="followers">
            {followers.map((follower) => (
              <article key={follower.id} className="follower">
                <strong>{follower.name}</strong>
                <span>Balance ${follower.availableBalance.toLocaleString()} · Ratio {follower.copyRatio}x</span>
                <span>Max lev {follower.maxLeverage}x · Max trade ${follower.maxNotionalPerTrade.toLocaleString()}</span>
                <span>Symbols: {follower.allowedSymbols.join(', ')}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      {summary && (
        <section className="summary-bar">
          <div className="summary-item"><span>Accepted</span><strong className="accepted-text">{summary.acceptedCount}</strong></div>
          <div className="summary-item"><span>Rejected</span><strong className="rejected-text">{summary.rejectedCount}</strong></div>
          <div className="summary-item"><span>Total Notional</span><strong>${summary.totalNotional.toLocaleString()}</strong></div>
          <div className="summary-item"><span>Total Margin</span><strong>${summary.totalMargin.toLocaleString()}</strong></div>
        </section>
      )}

      <section className="card table-card">
        <h2>Copied orders</h2>
        <table>
          <thead>
            <tr>
              <th>Follower</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Qty</th>
              <th>Fill price</th>
              <th>Notional</th>
              <th>Margin req.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={`${order.followerId}-${order.leaderTradeId}`}>
                <td>{order.followerName ?? order.followerId}</td>
                <td>{order.symbol}</td>
                <td>{order.side}</td>
                <td>{order.quantity}</td>
                <td>${order.estimatedFillPrice.toLocaleString()}</td>
                <td>${order.notional.toLocaleString()}</td>
                <td>${order.marginRequired.toLocaleString()}</td>
                <td>
                  <span className={order.status === 'ACCEPTED' ? 'accepted' : 'rejected'}>
                    {order.status}
                  </span>
                  {order.rejectionReason && <small>{order.rejectionReason}</small>}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="empty">No results yet. Run a simulation.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
