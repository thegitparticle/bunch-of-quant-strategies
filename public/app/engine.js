/**
 * Backtest engine — implements all indicator logic, filters, and exit management
 * per the strategy specs from STRATEGIES.md.
 */

// --- Technical Indicators ---

export function sma(closes, period) {
  const result = new Array(closes.length).fill(null)
  for (let i = period - 1; i < closes.length; i++) {
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) sum += closes[j]
    result[i] = sum / period
  }
  return result
}

export function ema(closes, period) {
  const result = new Array(closes.length).fill(null)
  const k = 2 / (period + 1)
  let started = false
  for (let i = 0; i < closes.length; i++) {
    if (!started) {
      if (i === period - 1) {
        let sum = 0
        for (let j = 0; j < period; j++) sum += closes[j]
        result[i] = sum / period
        started = true
      }
    } else {
      result[i] = closes[i] * k + result[i - 1] * (1 - k)
    }
  }
  return result
}

export function atr(highs, lows, closes, period) {
  const result = new Array(closes.length).fill(null)
  const trs = []
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      trs.push(highs[i] - lows[i])
    } else {
      const tr = Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      )
      trs.push(tr)
    }
  }
  for (let i = period - 1; i < trs.length; i++) {
    if (i === period - 1) {
      let sum = 0
      for (let j = 0; j < period; j++) sum += trs[j]
      result[i] = sum / period
    } else {
      result[i] = (result[i - 1] * (period - 1) + trs[i]) / period
    }
  }
  return result
}

export function rsi(closes, period) {
  const result = new Array(closes.length).fill(null)
  if (closes.length < period + 1) return result

  let avgGain = 0
  let avgLoss = 0
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1]
    if (change > 0) avgGain += change
    else avgLoss += Math.abs(change)
  }
  avgGain /= period
  avgLoss /= period

  result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)

  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? Math.abs(change) : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
  }
  return result
}

export function williamsR(highs, lows, closes, period) {
  const result = new Array(closes.length).fill(null)
  for (let i = period - 1; i < closes.length; i++) {
    let hh = -Infinity
    let ll = Infinity
    for (let j = i - period + 1; j <= i; j++) {
      if (highs[j] > hh) hh = highs[j]
      if (lows[j] < ll) ll = lows[j]
    }
    result[i] = hh === ll ? -50 : ((hh - closes[i]) / (hh - ll)) * -100
  }
  return result
}

export function macd(closes, fast, slow, signal) {
  const emaFast = ema(closes, fast)
  const emaSlow = ema(closes, slow)
  const macdLine = new Array(closes.length).fill(null)
  for (let i = 0; i < closes.length; i++) {
    if (emaFast[i] !== null && emaSlow[i] !== null) {
      macdLine[i] = emaFast[i] - emaSlow[i]
    }
  }
  const validMacd = []
  let startIdx = 0
  for (let i = 0; i < macdLine.length; i++) {
    if (macdLine[i] !== null) { startIdx = i; break }
  }
  for (let i = startIdx; i < macdLine.length; i++) validMacd.push(macdLine[i])
  const sigEma = ema(validMacd, signal)
  const signalLine = new Array(closes.length).fill(null)
  for (let i = 0; i < sigEma.length; i++) {
    if (sigEma[i] !== null) signalLine[startIdx + i] = sigEma[i]
  }
  return { macdLine, signalLine }
}

export function bollingerBands(closes, period, mult) {
  const result = { upper: new Array(closes.length).fill(null), lower: new Array(closes.length).fill(null), mid: new Array(closes.length).fill(null) }
  for (let i = period - 1; i < closes.length; i++) {
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) sum += closes[j]
    const mean = sum / period
    let variance = 0
    for (let j = i - period + 1; j <= i; j++) variance += (closes[j] - mean) ** 2
    const std = Math.sqrt(variance / period)
    result.mid[i] = mean
    result.upper[i] = mean + mult * std
    result.lower[i] = mean - mult * std
  }
  return result
}

export function supertrend(highs, lows, closes, period, mult) {
  const atrVals = atr(highs, lows, closes, period)
  const st = new Array(closes.length).fill(null)
  const direction = new Array(closes.length).fill(0) // 1=up, -1=down
  
  for (let i = period; i < closes.length; i++) {
    if (atrVals[i] === null) continue
    const hl2 = (highs[i] + lows[i]) / 2
    let upperBand = hl2 + mult * atrVals[i]
    let lowerBand = hl2 - mult * atrVals[i]

    if (i > period && st[i - 1] !== null) {
      if (direction[i - 1] === 1) {
        lowerBand = Math.max(lowerBand, st[i - 1])
        if (closes[i] < lowerBand) {
          st[i] = upperBand
          direction[i] = -1
        } else {
          st[i] = lowerBand
          direction[i] = 1
        }
      } else {
        upperBand = Math.min(upperBand, st[i - 1])
        if (closes[i] > upperBand) {
          st[i] = lowerBand
          direction[i] = 1
        } else {
          st[i] = upperBand
          direction[i] = -1
        }
      }
    } else {
      st[i] = closes[i] > hl2 ? lowerBand : upperBand
      direction[i] = closes[i] > hl2 ? 1 : -1
    }
  }
  return { st, direction }
}

// --- Signal Generation ---

function generateSignals(candles, spec) {
  const closes = candles.map(c => c.close)
  const highs = candles.map(c => c.high)
  const lows = candles.map(c => c.low)
  const n = closes.length
  const signals = new Array(n).fill(0) // 1=long, -1=short, 0=neutral

  if (spec.indicator === 'williams_r') {
    const { period, oversold, overbought } = spec.params
    const wr = williamsR(highs, lows, closes, period)
    for (let i = 1; i < n; i++) {
      if (wr[i] === null || wr[i - 1] === null) continue
      if (wr[i] > oversold && wr[i - 1] <= oversold) signals[i] = 1
      if (wr[i] < overbought && wr[i - 1] >= overbought) signals[i] = -1
    }
  } else if (spec.indicator === 'macd') {
    const { fast, slow, signal } = spec.params
    const { macdLine, signalLine } = macd(closes, fast, slow, signal)
    for (let i = 1; i < n; i++) {
      if (macdLine[i] === null || signalLine[i] === null || macdLine[i - 1] === null || signalLine[i - 1] === null) continue
      if (macdLine[i] > signalLine[i] && macdLine[i - 1] <= signalLine[i - 1]) signals[i] = 1
      if (macdLine[i] < signalLine[i] && macdLine[i - 1] >= signalLine[i - 1]) signals[i] = -1
    }
  } else if (spec.indicator === 'bollinger') {
    const { period, mult } = spec.params
    const bb = bollingerBands(closes, period, mult)
    for (let i = 0; i < n; i++) {
      if (bb.lower[i] === null) continue
      if (closes[i] <= bb.lower[i]) signals[i] = 1
      if (closes[i] >= bb.upper[i]) signals[i] = -1
    }
  } else if (spec.indicator === 'supertrend') {
    const { period, mult } = spec.params
    const { direction } = supertrend(highs, lows, closes, period, mult)
    for (let i = 1; i < n; i++) {
      if (direction[i] === 0 || direction[i - 1] === 0) continue
      if (direction[i] === 1 && direction[i - 1] === -1) signals[i] = 1
      if (direction[i] === -1 && direction[i - 1] === 1) signals[i] = -1
    }
  }

  return signals
}

// --- Filter Application ---

function applyFilters(candles, signals, filters) {
  const closes = candles.map(c => c.close)
  const highs = candles.map(c => c.high)
  const lows = candles.map(c => c.low)
  const n = closes.length
  const filtered = [...signals]

  for (const filter of filters) {
    if (filter.type === 'ema_trend') {
      const emaVals = ema(closes, filter.period)
      for (let i = 0; i < n; i++) {
        if (filtered[i] === 0 || emaVals[i] === null) continue
        const trend = closes[i] > emaVals[i] ? 1 : -1
        if (filtered[i] !== trend) filtered[i] = 0
      }
    } else if (filter.type === 'rsi_band') {
      const rsiVals = rsi(closes, filter.period)
      for (let i = 0; i < n; i++) {
        if (filtered[i] === 0 || rsiVals[i] === null) continue
        if (rsiVals[i] < filter.lo || rsiVals[i] > filter.hi) filtered[i] = 0
      }
    } else if (filter.type === 'atr_regime') {
      const atr14 = atr(highs, lows, closes, 14)
      const atr56 = atr(highs, lows, closes, 56)
      for (let i = 0; i < n; i++) {
        if (filtered[i] === 0 || atr14[i] === null || atr56[i] === null) continue
        const ratio = atr14[i] / atr56[i]
        if (ratio > filter.max_ratio) filtered[i] = 0
      }
    }
  }

  return filtered
}

// --- Backtest Engine ---

export function runBacktest(candles, strategy) {
  const { spec, side } = strategy
  const closes = candles.map(c => c.close)
  const highs = candles.map(c => c.high)
  const lows = candles.map(c => c.low)
  const n = closes.length

  let signals = generateSignals(candles, spec)
  
  // Apply side restriction
  if (side === 'long') {
    signals = signals.map(s => s === -1 ? 0 : s)
  } else if (side === 'short') {
    signals = signals.map(s => s === 1 ? 0 : s)
  }

  // Apply filters
  signals = applyFilters(candles, signals, spec.filters || [])

  // ATR for TP/SL
  const atrVals = atr(highs, lows, closes, spec.exit.atr_period || 14)

  const feesPerLeg = spec.fees_pct_per_leg / 100
  const slippagePerLeg = 0.0002 // 2 bps

  let equity = 1000
  const equityCurve = new Array(n).fill(1000)
  const trades = []
  let position = null
  let cooldownUntil = 0

  for (let i = 1; i < n; i++) {
    equityCurve[i] = equity

    // Check exits if in position
    if (position) {
      let exitPrice = null
      let exitReason = null

      if (position.direction === 1) {
        if (lows[i] <= position.sl) {
          exitPrice = position.sl
          exitReason = 'sl'
        } else if (highs[i] >= position.tp) {
          exitPrice = position.tp
          exitReason = 'tp'
        }
      } else {
        if (highs[i] >= position.sl) {
          exitPrice = position.sl
          exitReason = 'sl'
        } else if (lows[i] <= position.tp) {
          exitPrice = position.tp
          exitReason = 'tp'
        }
      }

      // Time stop
      if (!exitPrice && (i - position.entryBar) >= spec.exit.max_bars) {
        exitPrice = closes[i]
        exitReason = 'time'
      }

      if (exitPrice) {
        const grossPnl = position.direction === 1
          ? (exitPrice - position.entryPrice) / position.entryPrice
          : (position.entryPrice - exitPrice) / position.entryPrice
        const netPnl = grossPnl - feesPerLeg - slippagePerLeg
        equity *= (1 + netPnl)
        equityCurve[i] = equity

        trades.push({
          entryBar: position.entryBar,
          exitBar: i,
          entryTime: candles[position.entryBar].time,
          exitTime: candles[i].time,
          entryPrice: position.entryPrice,
          exitPrice,
          direction: position.direction,
          pnlPct: netPnl * 100,
          exitReason,
          equityAfter: equity
        })

        cooldownUntil = i + spec.exit.cooldown_bars
        position = null
      }
    }

    // Check entry
    if (!position && i >= cooldownUntil && signals[i] !== 0 && atrVals[i] !== null) {
      const dir = signals[i]
      const entryPrice = closes[i]
      const atrVal = atrVals[i]

      const tp = dir === 1
        ? entryPrice + spec.exit.tp * atrVal
        : entryPrice - spec.exit.tp * atrVal
      const sl = dir === 1
        ? entryPrice - spec.exit.sl * atrVal
        : entryPrice + spec.exit.sl * atrVal

      // Deduct entry fee
      equity *= (1 - feesPerLeg - slippagePerLeg)
      equityCurve[i] = equity

      position = { entryBar: i, entryPrice, direction: dir, tp, sl }
    }
  }

  // Close open position at end
  if (position) {
    const lastClose = closes[n - 1]
    const grossPnl = position.direction === 1
      ? (lastClose - position.entryPrice) / position.entryPrice
      : (position.entryPrice - lastClose) / position.entryPrice
    const netPnl = grossPnl - feesPerLeg - slippagePerLeg
    equity *= (1 + netPnl)
    equityCurve[n - 1] = equity

    trades.push({
      entryBar: position.entryBar,
      exitBar: n - 1,
      entryTime: candles[position.entryBar].time,
      exitTime: candles[n - 1].time,
      entryPrice: position.entryPrice,
      exitPrice: lastClose,
      direction: position.direction,
      pnlPct: netPnl * 100,
      exitReason: 'open',
      equityAfter: equity
    })
  }

  // Compute stats
  const totalPnl = ((equity - 1000) / 1000) * 100
  const wins = trades.filter(t => t.pnlPct > 0).length
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0

  // Max drawdown
  let peak = 1000
  let maxDD = 0
  for (let i = 0; i < n; i++) {
    if (equityCurve[i] > peak) peak = equityCurve[i]
    const dd = (peak - equityCurve[i]) / peak
    if (dd > maxDD) maxDD = dd
  }

  // Buy & hold
  const buyHold = ((closes[n - 1] - closes[0]) / closes[0]) * 100

  return {
    equity,
    equityCurve,
    trades,
    stats: {
      totalPnl,
      winRate,
      tradeCount: trades.length,
      maxDrawdown: maxDD * 100,
      buyHold,
      finalEquity: equity
    }
  }
}
