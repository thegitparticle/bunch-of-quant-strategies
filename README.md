# Quant Strategies — Hyperliquid Backtester

A no-build React dashboard that runs 35 pre-validated quant/technical strategies against live Hyperliquid perpetual data. Each strategy is backtested on the last 30+ days of candle data for BTC, ETH, SOL, and HYPE.

## Features

- **35 strategies**: Williams %R, MACD, Bollinger Mean-Reversion, SuperTrend
- **4 assets**: BTC, ETH, SOL, HYPE on Hyperliquid perpetuals
- **Real-time backtesting**: Fetches live candle data from Hyperliquid API
- **Charts**: Equity curves, price charts with trade markers
- **Trade log**: Every entry/exit with PnL, direction, and exit reason
- **Dark/Light mode**: Industrial minimalism design
- **Filter/sort**: By asset, indicator type

## Architecture

- **Frontend**: No-build React 18 + HTM (browser-native ES modules)
- **Backend**: Cloudflare Pages Functions proxy Hyperliquid candle API
- **Engine**: Client-side backtest engine (indicators, filters, exits)
- **Data**: Hyperliquid public API (no auth required)

## Local development

```bash
npm run dev
```

Starts a Node.js dev server on port 5173 that serves static files and proxies `/api/candles` to the Hyperliquid API.

## Production deployment (Cloudflare Pages)

Deploy as a Cloudflare Pages project. The `functions/` directory handles the API proxy. Static files are served directly.

## Strategy Indicators

| Indicator | Count | Description |
|-----------|-------|-------------|
| Williams %R | 17 | Reversal signals from oversold/overbought territory |
| MACD | 12 | Crossover signals (MACD line vs signal line) |
| Bollinger | 5 | Mean-reversion at band touches |
| SuperTrend | 1 | Trend-flip signals |

## Filters

- `ema_trend`: Only trade in direction of EMA trend
- `rsi_band`: Only trade when RSI is within specified band
- `atr_regime`: Only trade when ATR ratio is within threshold

## Exit Rules

- Take-profit: N× ATR from entry
- Stop-loss: N× ATR from entry
- Time stop: Exit after max_bars if neither TP/SL hit
- Cooldown: Wait N bars after position close
