import React, { useEffect, useMemo, useState, useCallback, useRef } from 'https://esm.sh/react@18.2.0'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import htm from 'https://esm.sh/htm@3.1.1'
import { STRATEGIES } from './strategies.js'
import { runBacktest } from './engine.js'

const html = htm.bind(React.createElement)

function getTradesPerDay(result) {
  if (!result || !result.recentTrades) return 0
  return result.recentTrades.length / 30
}

// --- Data Fetching ---

async function fetchCandles(coin, interval, days) {
  const res = await fetch(`/api/candles?coin=${coin}&interval=${interval}&days=${days}`)
  if (!res.ok) throw new Error(`Failed to fetch ${coin} ${interval}`)
  const raw = await res.json()
  if (!Array.isArray(raw)) throw new Error(`Invalid response for ${coin} ${interval}`)
  return raw.map(c => ({
    time: c.t,
    open: parseFloat(c.o),
    high: parseFloat(c.h),
    low: parseFloat(c.l),
    close: parseFloat(c.c),
    volume: parseFloat(c.v)
  }))
}

// --- App ---

function App() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({ done: 0, total: 35 })
  const [selectedStrategy, setSelectedStrategy] = useState(null)
  const [filterAsset, setFilterAsset] = useState('ALL')
  const [filterIndicator, setFilterIndicator] = useState('ALL')
  const [sortBy, setSortBy] = useState('none')
  const [error, setError] = useState(null)

  useEffect(() => {
    runAllBacktests()
  }, [])

  async function runAllBacktests() {
    setLoading(true)
    setError(null)
    const candleCache = {}
    const allResults = {}
    let done = 0

    // Group strategies by asset+timeframe to minimize API calls
    const groups = {}
    for (const strat of STRATEGIES) {
      const key = `${strat.asset}_${strat.timeframe}`
      if (!groups[key]) groups[key] = []
      groups[key].push(strat)
    }

    try {
      for (const [key, strats] of Object.entries(groups)) {
        const [coin, interval] = key.split('_')
        // Fetch enough data for warmup (300 days for 1d, 100 days for 4h)
        const days = interval === '1d' ? 400 : 120
        if (!candleCache[key]) {
          candleCache[key] = await fetchCandles(coin, interval, days)
        }
        const candles = candleCache[key]

        for (const strat of strats) {
          try {
            const result = runBacktest(candles, strat)
            // Filter trades to last 30 days for display
            const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
            const recentTrades = result.trades.filter(t => t.entryTime >= cutoff)
            allResults[strat.id] = {
              ...result,
              recentTrades,
              candles,
              strategy: strat
            }
          } catch (e) {
            console.error(`Backtest failed for #${strat.id}:`, e)
            allResults[strat.id] = { error: e.message, strategy: strat }
          }
          done++
          setProgress({ done, total: STRATEGIES.length })
          setResults({ ...allResults })
        }
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const filteredStrategies = useMemo(() => {
    const filtered = STRATEGIES.filter(s => {
      if (filterAsset !== 'ALL' && s.asset !== filterAsset) return false
      if (filterIndicator !== 'ALL' && s.spec.indicator !== filterIndicator) return false
      return true
    })
    if (sortBy === 'none') return filtered
    return [...filtered].sort((a, b) => {
      const ra = results[a.id]
      const rb = results[b.id]
      if (!ra || !ra.stats) return (!rb || !rb.stats) ? 0 : 1
      if (!rb || !rb.stats) return -1
      if (sortBy === 'pnl_desc') return rb.stats.totalPnl - ra.stats.totalPnl
      if (sortBy === 'pnl_asc') return ra.stats.totalPnl - rb.stats.totalPnl
      if (sortBy === 'tpd_desc') return getTradesPerDay(rb) - getTradesPerDay(ra)
      if (sortBy === 'tpd_asc') return getTradesPerDay(ra) - getTradesPerDay(rb)
      return 0
    })
  }, [filterAsset, filterIndicator, sortBy, results])

  const aggregateStats = useMemo(() => {
    const completed = Object.values(results).filter(r => r.stats)
    if (completed.length === 0) return null
    const totalPnl = completed.reduce((sum, r) => sum + r.stats.totalPnl, 0) / completed.length
    const avgWinRate = completed.reduce((sum, r) => sum + r.stats.winRate, 0) / completed.length
    const totalTrades = completed.reduce((sum, r) => sum + r.stats.tradeCount, 0)
    const avgDD = completed.reduce((sum, r) => sum + r.stats.maxDrawdown, 0) / completed.length
    return { totalPnl, avgWinRate, totalTrades, avgDD, count: completed.length }
  }, [results])

  if (selectedStrategy) {
    const r = results[selectedStrategy.id]
    return html`
      <div className="page">

        <${Header} />
        <main className="container">
          <button className="button button-orange" style=${{ marginBottom: '16px' }} onClick=${() => setSelectedStrategy(null)}>
            ← BACK TO LIST
          </button>
          <${StrategyDetail} strategy=${selectedStrategy} result=${r} />
        </main>
        <${Footer} />
      </div>
    `
  }

  return html`
    <div className="page">
      <div className="scanline" aria-hidden="true"></div>
      <${Header} />
      <main className="container">
        ${loading && html`
          <div className="card" style=${{ marginBottom: '16px', textAlign: 'center' }}>
            <div className="card-label mono">RUNNING BACKTESTS</div>
            <div className="card-value">${progress.done} / ${progress.total}</div>
            <div className="progress-bar">
              <div className="progress-fill" style=${{ width: `${(progress.done / progress.total) * 100}%` }}></div>
            </div>
          </div>
        `}
        ${error && html`
          <div className="card card-error" style=${{ marginBottom: '16px' }}>
            <div className="card-label mono">ERROR</div>
            <div className="mono" style=${{ color: '#ef4444' }}>${error}</div>
          </div>
        `}
        ${aggregateStats && html`
          <section className="grid grid-4" style=${{ marginBottom: '24px' }}>
            <${StatCard} label="AVG PNL (30D)" value=${`${aggregateStats.totalPnl >= 0 ? '+' : ''}${aggregateStats.totalPnl.toFixed(1)}%`} positive=${aggregateStats.totalPnl >= 0} />
            <${StatCard} label="AVG WIN RATE" value=${`${aggregateStats.avgWinRate.toFixed(0)}%`} positive=${aggregateStats.avgWinRate >= 50} />
            <${StatCard} label="TOTAL TRADES" value=${aggregateStats.totalTrades.toString()} />
            <${StatCard} label="AVG MAX DD" value=${`${aggregateStats.avgDD.toFixed(1)}%`} positive=${false} />
          </section>
        `}
        <section className="filter-bar">
          <div className="filter-group">
            <span className="mono muted filter-label">ASSET:</span>
            ${['ALL', 'BTC', 'ETH', 'SOL', 'HYPE'].map(a => html`
              <button key=${a} className=${`button ${filterAsset === a ? 'button-active' : ''}`} onClick=${() => setFilterAsset(a)}>${a}</button>
            `)}
          </div>
          <div className="filter-group">
            <span className="mono muted filter-label">INDICATOR:</span>
            ${['ALL', 'williams_r', 'macd', 'bollinger', 'supertrend'].map(ind => html`
              <button key=${ind} className=${`button ${filterIndicator === ind ? 'button-active' : ''}`} onClick=${() => setFilterIndicator(ind)}>${ind === 'ALL' ? 'ALL' : ind.toUpperCase()}</button>
            `)}
          </div>
          <div className="filter-group">
            <span className="mono muted filter-label">SORT:</span>
            <button className=${`button ${sortBy === 'none' ? 'button-active' : ''}`} onClick=${() => setSortBy('none')}>DEFAULT</button>
            <button className=${`button ${sortBy.startsWith('pnl') ? 'button-active' : ''}`} onClick=${() => setSortBy(sortBy === 'pnl_desc' ? 'pnl_asc' : 'pnl_desc')}>
              PNL ${sortBy === 'pnl_desc' ? '↓' : sortBy === 'pnl_asc' ? '↑' : ''}
            </button>
            <button className=${`button ${sortBy.startsWith('tpd') ? 'button-active' : ''}`} onClick=${() => setSortBy(sortBy === 'tpd_desc' ? 'tpd_asc' : 'tpd_desc')}>
              TRADES/DAY ${sortBy === 'tpd_desc' ? '↓' : sortBy === 'tpd_asc' ? '↑' : ''}
            </button>
          </div>
        </section>
        <section className="strategy-grid">
          ${filteredStrategies.map(s => html`
            <${StrategyCard} key=${s.id} strategy=${s} result=${results[s.id]} onClick=${() => setSelectedStrategy(s)} />
          `)}
        </section>
      </main>
      <${Footer} />
    </div>
  `
}

// --- Components ---

function Header() {
  return html`
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <h1>MATH STRATEGIES</h1>
          <span className="muted mono">Hyperliquid • 35 Strategies • 30-Day Backtest</span>
        </div>
        <div className="controls">
          <${ThemeToggle} />
          <${CompactToggle} />
        </div>
      </div>
    </header>
  `
}

function Footer() {
  return html`
    <footer className="footer">
      <div className="container">
        <p className="muted mono">Hyperliquid Perpetuals • BTC / ETH / SOL / HYPE • Cloudflare Pages</p>
      </div>
    </footer>
  `
}

function StatCard({ label, value, positive }) {
  const colorClass = positive === true ? 'stat-positive' : positive === false ? 'stat-negative' : ''
  return html`
    <div className="card">
      <div className="card-label mono">${label}</div>
      <div className=${`card-value ${colorClass}`}>${value}</div>
    </div>
  `
}

function StrategyCard({ strategy, result, onClick }) {
  const s = strategy
  const r = result
  const hasData = r && r.stats
  const isLoading = !r

  return html`
    <div className="card strategy-card" onClick=${onClick}>
      <div className="strategy-card-header">
        <span className="strategy-num mono">#${s.id}</span>
        <span className=${`asset-badge asset-${s.asset.toLowerCase()}`}>${s.asset}</span>
        <span className="tf-badge mono">${s.timeframe}</span>
        ${s.side !== 'both' && html`<span className=${`side-badge side-${s.side}`}>${s.side.toUpperCase()}</span>`}
      </div>
      <div className="strategy-card-name">${s.spec.indicator.toUpperCase()}</div>
      ${isLoading && html`<div className="mono muted">Loading...</div>`}
      ${hasData && html`
        <div className="strategy-card-stats">
          <div className="stat-row">
            <span className="mono muted">PnL</span>
            <span className=${`mono ${r.stats.totalPnl >= 0 ? 'stat-positive' : 'stat-negative'}`}>
              ${r.stats.totalPnl >= 0 ? '+' : ''}${r.stats.totalPnl.toFixed(1)}%
            </span>
          </div>
          <div className="stat-row">
            <span className="mono muted">Win</span>
            <span className="mono">${r.stats.winRate.toFixed(0)}%</span>
          </div>
          <div className="stat-row">
            <span className="mono muted">Trades</span>
            <span className="mono">${r.stats.tradeCount}</span>
          </div>
          <div className="stat-row">
            <span className="mono muted">Trades/D</span>
            <span className="mono">${getTradesPerDay(r).toFixed(1)}</span>
          </div>
          <div className="stat-row">
            <span className="mono muted">MaxDD</span>
            <span className="mono stat-negative">${r.stats.maxDrawdown.toFixed(1)}%</span>
          </div>
        </div>
        <${MiniEquityCurve} data=${r.equityCurve} />
      `}
      ${r && r.error && html`<div className="mono" style=${{ color: '#ef4444', fontSize: '0.7rem' }}>Error</div>`}
    </div>
  `
}

function MiniEquityCurve({ data }) {
  if (!data || data.length === 0) return null
  const last100 = data.slice(-100)
  const min = Math.min(...last100)
  const max = Math.max(...last100)
  const range = max - min || 1
  const h = 40
  const w = 120
  const points = last100.map((v, i) => {
    const x = (i / (last100.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  const isPositive = last100[last100.length - 1] >= last100[0]

  return html`
    <svg className="mini-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polyline points=${points} fill="none" stroke=${isPositive ? 'var(--brand-green)' : '#ef4444'} strokeWidth="1.5" />
    </svg>
  `
}

// --- Strategy Detail ---

function StrategyDetail({ strategy, result }) {
  const s = strategy
  const r = result

  if (!r || !r.stats) {
    return html`<div className="card"><div className="mono muted">Loading or no data...</div></div>`
  }

  return html`
    <div className="detail-view">
      <div className="detail-header">
        <h2 className="detail-title">
          <span className="strategy-num mono">#${s.id}</span>
          ${' '}${s.spec.indicator.toUpperCase()} — ${s.asset} ${s.timeframe}
          ${s.side !== 'both' ? ` (${s.side}-only)` : ''}
        </h2>
      </div>
      <section className="grid grid-4" style=${{ marginBottom: '24px' }}>
        <${StatCard} label="TOTAL PNL" value=${`${r.stats.totalPnl >= 0 ? '+' : ''}${r.stats.totalPnl.toFixed(2)}%`} positive=${r.stats.totalPnl >= 0} />
        <${StatCard} label="WIN RATE" value=${`${r.stats.winRate.toFixed(0)}%`} positive=${r.stats.winRate >= 50} />
        <${StatCard} label="TRADES" value=${r.stats.tradeCount.toString()} />
        <${StatCard} label="MAX DRAWDOWN" value=${`${r.stats.maxDrawdown.toFixed(2)}%`} positive=${false} />
      </section>
      <section className="grid grid-4" style=${{ marginBottom: '24px' }}>
        <${StatCard} label="BUY & HOLD" value=${`${r.stats.buyHold >= 0 ? '+' : ''}${r.stats.buyHold.toFixed(2)}%`} positive=${r.stats.buyHold >= 0} />
        <${StatCard} label="FINAL EQUITY" value=${`$${r.stats.finalEquity.toFixed(0)}`} positive=${r.stats.finalEquity >= 1000} />
        <${StatCard} label="HOLDOUT SHARPE" value=${s.holdout.sharpe ? `+${s.holdout.sharpe}` : 'N/A'} />
        <${StatCard} label="HOLDOUT WIN%" value=${s.holdout.win_rate ? `${s.holdout.win_rate}%` : 'N/A'} />
      </section>
      <div className="card" style=${{ marginBottom: '24px' }}>
        <div className="card-label mono">EQUITY CURVE</div>
        <${EquityChart} data=${r.equityCurve} candles=${r.candles} />
      </div>
      <div className="card" style=${{ marginBottom: '24px' }}>
        <div className="card-label mono">PRICE CHART WITH TRADES</div>
        <${PriceChart} candles=${r.candles} trades=${r.trades} />
      </div>
      <div className="card" style=${{ marginBottom: '24px' }}>
        <div className="card-label mono">TRADE LOG (${r.trades.length} TRADES)</div>
        <${TradeTable} trades=${r.trades} />
      </div>
      <div className="card">
        <div className="card-label mono">STRATEGY SPEC</div>
        <pre className="spec-json mono">${JSON.stringify(s.spec, null, 2)}</pre>
      </div>
    </div>
  `
}

function EquityChart({ data, candles }) {
  if (!data || data.length === 0) return null
  const h = 200
  const w = 800
  const min = Math.min(...data) * 0.99
  const max = Math.max(...data) * 1.01
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  const areaPoints = `0,${h} ${points} ${w},${h}`
  const isPositive = data[data.length - 1] >= data[0]
  const color = isPositive ? 'var(--brand-green)' : '#ef4444'

  return html`
    <svg className="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polygon points=${areaPoints} fill=${color} opacity="0.1" />
      <polyline points=${points} fill="none" stroke=${color} strokeWidth="1.5" />
      <line x1="0" y1=${h - ((1000 - min) / range) * h} x2=${w} y2=${h - ((1000 - min) / range) * h} stroke="var(--muted)" strokeWidth="0.5" strokeDasharray="4,4" />
    </svg>
    <div className="chart-labels mono muted">
      <span>$${min.toFixed(0)}</span>
      <span>Start: $1,000</span>
      <span>$${max.toFixed(0)}</span>
    </div>
  `
}

function PriceChart({ candles, trades }) {
  if (!candles || candles.length === 0) return null
  const last200 = candles.slice(-200)
  const startIdx = candles.length - last200.length
  const closes = last200.map(c => c.close)
  const h = 200
  const w = 800
  const min = Math.min(...last200.map(c => c.low)) * 0.998
  const max = Math.max(...last200.map(c => c.high)) * 1.002
  const range = max - min || 1

  const points = closes.map((v, i) => {
    const x = (i / (closes.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  // Trade markers
  const markers = trades.filter(t => t.entryBar >= startIdx).map(t => {
    const entryX = ((t.entryBar - startIdx) / (last200.length - 1)) * w
    const entryY = h - ((t.entryPrice - min) / range) * h
    const exitX = ((t.exitBar - startIdx) / (last200.length - 1)) * w
    const exitY = h - ((t.exitPrice - min) / range) * h
    return { ...t, entryX, entryY, exitX, exitY }
  })

  return html`
    <svg className="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polyline points=${points} fill="none" stroke="var(--muted)" strokeWidth="1" opacity="0.6" />
      ${markers.map((m, i) => html`
        <g key=${i}>
          <line x1=${m.entryX} y1=${m.entryY} x2=${m.exitX} y2=${m.exitY}
            stroke=${m.pnlPct >= 0 ? 'var(--brand-green)' : '#ef4444'} strokeWidth="1" opacity="0.5" />
          <circle cx=${m.entryX} cy=${m.entryY} r="3"
            fill=${m.direction === 1 ? 'var(--brand-green)' : '#ef4444'} />
          <circle cx=${m.exitX} cy=${m.exitY} r="2"
            fill=${m.pnlPct >= 0 ? 'var(--brand-green)' : '#ef4444'} opacity="0.6" />
        </g>
      `)}
    </svg>
    <div className="chart-labels mono muted">
      <span>$${min.toFixed(2)}</span>
      <span>${last200.length} bars</span>
      <span>$${max.toFixed(2)}</span>
    </div>
  `
}

function TradeTable({ trades }) {
  if (!trades || trades.length === 0) {
    return html`<div className="mono muted" style=${{ padding: '12px' }}>No trades in backtest period</div>`
  }

  return html`
    <div className="trade-table-wrap">
      <table className="trade-table mono">
        <thead>
          <tr>
            <th>#</th>
            <th>DIR</th>
            <th>ENTRY</th>
            <th>EXIT</th>
            <th>PNL</th>
            <th>REASON</th>
            <th>EQUITY</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          ${trades.map((t, i) => html`
            <tr key=${i} className=${t.pnlPct >= 0 ? 'row-win' : 'row-loss'}>
              <td>${i + 1}</td>
              <td className=${t.direction === 1 ? 'stat-positive' : 'stat-negative'}>
                ${t.direction === 1 ? 'LONG' : 'SHORT'}
              </td>
              <td>$${t.entryPrice.toFixed(2)}</td>
              <td>$${t.exitPrice.toFixed(2)}</td>
              <td className=${t.pnlPct >= 0 ? 'stat-positive' : 'stat-negative'}>
                ${t.pnlPct >= 0 ? '+' : ''}${t.pnlPct.toFixed(2)}%
              </td>
              <td>${t.exitReason.toUpperCase()}</td>
              <td>$${t.equityAfter.toFixed(0)}</td>
              <td>${new Date(t.entryTime).toLocaleDateString()}</td>
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `
}

// --- Utility Components ---

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  return html`
    <button className="button button-green" onClick=${() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      ${theme === 'dark' ? 'LIGHT' : 'DARK'}
    </button>
  `
}

function CompactToggle() {
  const [dense, setDense] = useState(() => {
    try { return localStorage.getItem('dense') === '1' } catch { return false }
  })

  useEffect(() => {
    const root = document.documentElement
    if (dense) {
      root.classList.add('dense')
      localStorage.setItem('dense', '1')
    } else {
      root.classList.remove('dense')
      localStorage.removeItem('dense')
    }
  }, [dense])

  return html`
    <button className="button button-orange" onClick=${() => setDense(!dense)}>COMPACT</button>
  `
}

// --- Mount ---

const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Root element #app not found')
const root = createRoot(rootElement)
root.render(html`<${App} />`)
