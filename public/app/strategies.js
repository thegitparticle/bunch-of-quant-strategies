export const STRATEGIES = [
  {
    "id": 1,
    "title": "WILLIAMS_R BTC 4h",
    "asset": "BTC",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 2.43,
      "pnl_pct": 26.0,
      "win_rate": 77,
      "trades": 13,
      "cadence_per_month": 2.2,
      "max_dd_pct": 3.3,
      "buy_hold_pct": -23.4
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 28,
        "oversold": -85,
        "overbought": -25
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 90
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 40.0,
          "hi": 100.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 3.2,
        "sl_kind": "atr",
        "sl": 2.2,
        "atr_period": 14,
        "max_bars": 36,
        "cooldown_bars": 14
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 2,
    "title": "WILLIAMS_R SOL 4h (cross-asset from BTC)",
    "asset": "SOL",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 1.91,
      "pnl_pct": 30.5,
      "win_rate": 67,
      "trades": 12,
      "cadence_per_month": 2.0,
      "max_dd_pct": 9.8,
      "buy_hold_pct": -43.8
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 28,
        "oversold": -85,
        "overbought": -25
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 90
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 40.0,
          "hi": 100.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 3.2,
        "sl_kind": "atr",
        "sl": 2.2,
        "atr_period": 14,
        "max_bars": 36,
        "cooldown_bars": 14
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 3,
    "title": "WILLIAMS_R SOL 4h short-only (cross-asset from BTC)",
    "asset": "SOL",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 1.73,
      "pnl_pct": 27.7,
      "win_rate": 64,
      "trades": 11,
      "cadence_per_month": 1.8,
      "max_dd_pct": 9.8,
      "buy_hold_pct": -43.8
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 28,
        "oversold": -85,
        "overbought": -25
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 90
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 40.0,
          "hi": 100.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 3.2,
        "sl_kind": "atr",
        "sl": 2.2,
        "atr_period": 14,
        "max_bars": 36,
        "cooldown_bars": 14
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 4,
    "title": "MACD BTC 4h (cross-asset from ETH)",
    "asset": "BTC",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 1.61,
      "pnl_pct": 22.6,
      "win_rate": 63,
      "trades": 27,
      "cadence_per_month": 4.5,
      "max_dd_pct": 7.4,
      "buy_hold_pct": -23.4
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 12,
        "slow": 40,
        "signal": 9
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.4
        },
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 45.8,
          "hi": 65.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.2,
        "sl_kind": "atr",
        "sl": 1.8,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 10
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 5,
    "title": "BOLLINGER HYPE 4h",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 1.5,
      "pnl_pct": 20.0,
      "win_rate": 73,
      "trades": 11,
      "cadence_per_month": 1.8,
      "max_dd_pct": 7.5,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "Bollinger Mean-Reversion",
      "indicator": "bollinger",
      "params": {
        "period": 25,
        "mult": 1.8
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 200
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 35.0,
          "hi": 65.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.18
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 8,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 6,
    "title": "MACD HYPE 4h (cross-asset from ETH)",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 1.47,
      "pnl_pct": 41.0,
      "win_rate": 52,
      "trades": 25,
      "cadence_per_month": 4.2,
      "max_dd_pct": 13.9,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 12,
        "slow": 40,
        "signal": 9
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.4
        },
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 45.8,
          "hi": 65.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.2,
        "sl_kind": "atr",
        "sl": 1.8,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 10
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 7,
    "title": "MACD BTC 4h short-only (cross-asset from ETH)",
    "asset": "BTC",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 1.44,
      "pnl_pct": 11.7,
      "win_rate": 70,
      "trades": 10,
      "cadence_per_month": 1.7,
      "max_dd_pct": 4.6,
      "buy_hold_pct": -23.4
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 12,
        "slow": 40,
        "signal": 9
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.4
        },
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 45.8,
          "hi": 65.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.2,
        "sl_kind": "atr",
        "sl": 1.8,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 10
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 8,
    "title": "WILLIAMS_R HYPE 4h (cross-asset from BTC)",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 1.33,
      "pnl_pct": 43.6,
      "win_rate": 53,
      "trades": 15,
      "cadence_per_month": 2.5,
      "max_dd_pct": 18.6,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 28,
        "oversold": -85,
        "overbought": -25
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 90
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 40.0,
          "hi": 100.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 3.2,
        "sl_kind": "atr",
        "sl": 2.2,
        "atr_period": 14,
        "max_bars": 36,
        "cooldown_bars": 14
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 9,
    "title": "WILLIAMS_R HYPE 4h short-only (cross-asset from BTC)",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 1.25,
      "pnl_pct": 34.4,
      "win_rate": 55,
      "trades": 11,
      "cadence_per_month": 1.8,
      "max_dd_pct": 12.9,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 28,
        "oversold": -85,
        "overbought": -25
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 90
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 40.0,
          "hi": 100.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 3.2,
        "sl_kind": "atr",
        "sl": 2.2,
        "atr_period": 14,
        "max_bars": 36,
        "cooldown_bars": 14
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 10,
    "title": "WILLIAMS_R SOL 4h short-only (cross-asset from HYPE)",
    "asset": "SOL",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 1.23,
      "pnl_pct": 13.3,
      "win_rate": 80,
      "trades": 10,
      "cadence_per_month": 1.7,
      "max_dd_pct": 7.5,
      "buy_hold_pct": -43.8
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -80,
        "overbought": -20
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.15
        },
        {
          "type": "ema_trend",
          "period": 48
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.5,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 11,
    "title": "MACD ETH 4h short-only",
    "asset": "ETH",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 1.07,
      "pnl_pct": 15.3,
      "win_rate": 60,
      "trades": 15,
      "cadence_per_month": 2.5,
      "max_dd_pct": 9.0,
      "buy_hold_pct": -35.5
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 12,
        "slow": 40,
        "signal": 9
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.4
        },
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 45.8,
          "hi": 65.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.2,
        "sl_kind": "atr",
        "sl": 1.8,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 10
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 12,
    "title": "WILLIAMS_R ETH 4h (cross-asset from HYPE)",
    "asset": "ETH",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.97,
      "pnl_pct": 13.6,
      "win_rate": 70,
      "trades": 20,
      "cadence_per_month": 3.3,
      "max_dd_pct": 7.8,
      "buy_hold_pct": -35.5
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -80,
        "overbought": -20
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.15
        },
        {
          "type": "ema_trend",
          "period": 48
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.5,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 13,
    "title": "MACD BTC 4h long-only (cross-asset from ETH)",
    "asset": "BTC",
    "timeframe": "4h",
    "side": "long",
    "holdout": {
      "sharpe": 0.96,
      "pnl_pct": 10.9,
      "win_rate": 59,
      "trades": 17,
      "cadence_per_month": 2.8,
      "max_dd_pct": 6.7,
      "buy_hold_pct": -23.4
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 12,
        "slow": 40,
        "signal": 9
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.4
        },
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 45.8,
          "hi": 65.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.2,
        "sl_kind": "atr",
        "sl": 1.8,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 10
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "long"
    }
  },
  {
    "id": 14,
    "title": "WILLIAMS_R SOL 1d (cross-asset from AAPL)",
    "asset": "SOL",
    "timeframe": "1d",
    "side": "both",
    "holdout": {
      "sharpe": 0.87,
      "pnl_pct": 20.5,
      "win_rate": 50,
      "trades": 6,
      "cadence_per_month": 0.7,
      "max_dd_pct": 14.9,
      "buy_hold_pct": -47.2
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -83.0,
        "overbought": -20
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.1
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 32.0,
          "hi": 68.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.6,
        "sl_kind": "atr",
        "sl": 1.1,
        "atr_period": 14,
        "max_bars": 32,
        "cooldown_bars": 6
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 15,
    "title": "WILLIAMS_R SOL 4h (cross-asset from HYPE)",
    "asset": "SOL",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.81,
      "pnl_pct": 12.5,
      "win_rate": 74,
      "trades": 19,
      "cadence_per_month": 3.2,
      "max_dd_pct": 14.6,
      "buy_hold_pct": -43.8
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -80,
        "overbought": -20
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.15
        },
        {
          "type": "ema_trend",
          "period": 48
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.5,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 16,
    "title": "MACD HYPE 4h",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.79,
      "pnl_pct": 29.1,
      "win_rate": 50,
      "trades": 34,
      "cadence_per_month": 5.7,
      "max_dd_pct": 25.5,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 15,
        "slow": 32,
        "signal": 10
      },
      "filters": [
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 20.0,
          "hi": 60.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.6
        },
        {
          "type": "ema_trend",
          "period": 9
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.0,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 14,
        "max_bars": 38,
        "cooldown_bars": 5
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 17,
    "title": "WILLIAMS_R ETH 4h short-only (cross-asset from HYPE)",
    "asset": "ETH",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 0.76,
      "pnl_pct": 8.7,
      "win_rate": 73,
      "trades": 11,
      "cadence_per_month": 1.8,
      "max_dd_pct": 7.1,
      "buy_hold_pct": -35.5
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -80,
        "overbought": -20
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.15
        },
        {
          "type": "ema_trend",
          "period": 48
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.5,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 18,
    "title": "MACD HYPE 4h long-only",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "long",
    "holdout": {
      "sharpe": 0.72,
      "pnl_pct": 17.9,
      "win_rate": 53,
      "trades": 15,
      "cadence_per_month": 2.5,
      "max_dd_pct": 11.7,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 15,
        "slow": 32,
        "signal": 10
      },
      "filters": [
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 20.0,
          "hi": 60.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.6
        },
        {
          "type": "ema_trend",
          "period": 9
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.0,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 14,
        "max_bars": 38,
        "cooldown_bars": 5
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "long"
    }
  },
  {
    "id": 19,
    "title": "BOLLINGER BTC 4h short-only (cross-asset from HYPE)",
    "asset": "BTC",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 0.65,
      "pnl_pct": 4.0,
      "win_rate": 70,
      "trades": 10,
      "cadence_per_month": 1.7,
      "max_dd_pct": 4.8,
      "buy_hold_pct": -23.4
    },
    "spec": {
      "name": "Bollinger Mean-Reversion",
      "indicator": "bollinger",
      "params": {
        "period": 25,
        "mult": 1.8
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 200
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 35.0,
          "hi": 65.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.18
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 8,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 20,
    "title": "WILLIAMS_R SOL 1d long-only (cross-asset from AAPL)",
    "asset": "SOL",
    "timeframe": "1d",
    "side": "long",
    "holdout": {
      "sharpe": 0.58,
      "pnl_pct": 13.5,
      "win_rate": 40,
      "trades": 5,
      "cadence_per_month": 0.6,
      "max_dd_pct": 14.9,
      "buy_hold_pct": -47.2
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -83.0,
        "overbought": -20
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.1
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 32.0,
          "hi": 68.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.6,
        "sl_kind": "atr",
        "sl": 1.1,
        "atr_period": 14,
        "max_bars": 32,
        "cooldown_bars": 6
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "long"
    }
  },
  {
    "id": 21,
    "title": "BOLLINGER SOL 4h (cross-asset from HYPE)",
    "asset": "SOL",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.54,
      "pnl_pct": 4.7,
      "win_rate": 60,
      "trades": 10,
      "cadence_per_month": 1.7,
      "max_dd_pct": 9.0,
      "buy_hold_pct": -43.8
    },
    "spec": {
      "name": "Bollinger Mean-Reversion",
      "indicator": "bollinger",
      "params": {
        "period": 25,
        "mult": 1.8
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 200
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 35.0,
          "hi": 65.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.18
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 8,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 22,
    "title": "BOLLINGER SOL 4h short-only (cross-asset from HYPE)",
    "asset": "SOL",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 0.54,
      "pnl_pct": 4.7,
      "win_rate": 60,
      "trades": 10,
      "cadence_per_month": 1.7,
      "max_dd_pct": 9.0,
      "buy_hold_pct": -43.8
    },
    "spec": {
      "name": "Bollinger Mean-Reversion",
      "indicator": "bollinger",
      "params": {
        "period": 25,
        "mult": 1.8
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 200
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 35.0,
          "hi": 65.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.18
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 8,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 23,
    "title": "MACD ETH 4h short-only (cross-asset from HYPE)",
    "asset": "ETH",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 0.5,
      "pnl_pct": 9.1,
      "win_rate": 46,
      "trades": 26,
      "cadence_per_month": 4.3,
      "max_dd_pct": 14.2,
      "buy_hold_pct": -35.5
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 15,
        "slow": 32,
        "signal": 10
      },
      "filters": [
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 20.0,
          "hi": 60.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.6
        },
        {
          "type": "ema_trend",
          "period": 9
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.0,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 14,
        "max_bars": 38,
        "cooldown_bars": 5
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 24,
    "title": "WILLIAMS_R BTC 4h short-only (cross-asset from HYPE)",
    "asset": "BTC",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 0.46,
      "pnl_pct": 4.1,
      "win_rate": 64,
      "trades": 11,
      "cadence_per_month": 1.8,
      "max_dd_pct": 5.9,
      "buy_hold_pct": -23.4
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -80,
        "overbought": -20
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.15
        },
        {
          "type": "ema_trend",
          "period": 48
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.5,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 25,
    "title": "BOLLINGER BTC 4h (cross-asset from HYPE)",
    "asset": "BTC",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.45,
      "pnl_pct": 3.1,
      "win_rate": 60,
      "trades": 15,
      "cadence_per_month": 2.5,
      "max_dd_pct": 4.8,
      "buy_hold_pct": -23.4
    },
    "spec": {
      "name": "Bollinger Mean-Reversion",
      "indicator": "bollinger",
      "params": {
        "period": 25,
        "mult": 1.8
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 200
        },
        {
          "type": "rsi_band",
          "period": 14,
          "lo": 35.0,
          "hi": 65.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.18
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 8,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 26,
    "title": "MACD HYPE 4h short-only",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "short",
    "holdout": {
      "sharpe": 0.41,
      "pnl_pct": 11.2,
      "win_rate": 47,
      "trades": 19,
      "cadence_per_month": 3.2,
      "max_dd_pct": 21.9,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 15,
        "slow": 32,
        "signal": 10
      },
      "filters": [
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 20.0,
          "hi": 60.0
        },
        {
          "type": "atr_regime",
          "max_ratio": 1.6
        },
        {
          "type": "ema_trend",
          "period": 9
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.0,
        "sl_kind": "atr",
        "sl": 1.4,
        "atr_period": 14,
        "max_bars": 38,
        "cooldown_bars": 5
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "short"
    }
  },
  {
    "id": 27,
    "title": "WILLIAMS_R BTC 1d (cross-asset from SPY)",
    "asset": "BTC",
    "timeframe": "1d",
    "side": "both",
    "holdout": {
      "sharpe": 0.36,
      "pnl_pct": 6.0,
      "win_rate": 57,
      "trades": 7,
      "cadence_per_month": 0.8,
      "max_dd_pct": 17.6,
      "buy_hold_pct": -32.4
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -85,
        "overbought": -1
      },
      "filters": [
        {
          "type": "rsi_band",
          "period": 2,
          "lo": 2,
          "hi": 98
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.0,
        "atr_period": 14,
        "max_bars": 30,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 28,
    "title": "SUPERTREND HYPE 4h (cross-asset from BTC)",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.32,
      "pnl_pct": 7.5,
      "win_rate": 58,
      "trades": 12,
      "cadence_per_month": 2.0,
      "max_dd_pct": 17.0,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "SuperTrend Flip",
      "indicator": "supertrend",
      "params": {
        "period": 15,
        "mult": 4.2
      },
      "filters": [
        {
          "type": "ema_trend",
          "period": 100
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.05,
        "sl_kind": "atr",
        "sl": 2.0,
        "atr_period": 14,
        "max_bars": 80,
        "cooldown_bars": 11
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 29,
    "title": "WILLIAMS_R ETH 1d (cross-asset from SPY)",
    "asset": "ETH",
    "timeframe": "1d",
    "side": "both",
    "holdout": {
      "sharpe": 0.25,
      "pnl_pct": 6.2,
      "win_rate": 57,
      "trades": 7,
      "cadence_per_month": 0.8,
      "max_dd_pct": 25.6,
      "buy_hold_pct": -45.3
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -85,
        "overbought": -1
      },
      "filters": [
        {
          "type": "rsi_band",
          "period": 2,
          "lo": 2,
          "hi": 98
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.0,
        "atr_period": 14,
        "max_bars": 30,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 30,
    "title": "WILLIAMS_R ETH 1d long-only (cross-asset from SPY)",
    "asset": "ETH",
    "timeframe": "1d",
    "side": "long",
    "holdout": {
      "sharpe": 0.25,
      "pnl_pct": 6.2,
      "win_rate": 57,
      "trades": 7,
      "cadence_per_month": 0.8,
      "max_dd_pct": 25.6,
      "buy_hold_pct": -45.3
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -85,
        "overbought": -1
      },
      "filters": [
        {
          "type": "rsi_band",
          "period": 2,
          "lo": 2,
          "hi": 98
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.0,
        "atr_period": 14,
        "max_bars": 30,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "long"
    }
  },
  {
    "id": 31,
    "title": "MACD SOL 4h (cross-asset from ETH)",
    "asset": "SOL",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.24,
      "pnl_pct": 5.1,
      "win_rate": 48,
      "trades": 29,
      "cadence_per_month": 4.8,
      "max_dd_pct": 16.0,
      "buy_hold_pct": -43.8
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 12,
        "slow": 40,
        "signal": 9
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.4
        },
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 45.8,
          "hi": 65.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.2,
        "sl_kind": "atr",
        "sl": 1.8,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 10
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 32,
    "title": "MACD ETH 4h",
    "asset": "ETH",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.12,
      "pnl_pct": 2.5,
      "win_rate": 47,
      "trades": 32,
      "cadence_per_month": 5.3,
      "max_dd_pct": 19.9,
      "buy_hold_pct": -35.5
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 12,
        "slow": 40,
        "signal": 9
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.4
        },
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 45.8,
          "hi": 65.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.2,
        "sl_kind": "atr",
        "sl": 1.8,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 10
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 33,
    "title": "WILLIAMS_R BTC 4h (cross-asset from HYPE)",
    "asset": "BTC",
    "timeframe": "4h",
    "side": "both",
    "holdout": {
      "sharpe": 0.12,
      "pnl_pct": 1.3,
      "win_rate": 63,
      "trades": 19,
      "cadence_per_month": 3.2,
      "max_dd_pct": 9.4,
      "buy_hold_pct": -23.4
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -80,
        "overbought": -20
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.15
        },
        {
          "type": "ema_trend",
          "period": 48
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.5,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05
    }
  },
  {
    "id": 34,
    "title": "MACD HYPE 4h long-only (cross-asset from ETH)",
    "asset": "HYPE",
    "timeframe": "4h",
    "side": "long",
    "holdout": {
      "sharpe": 0.08,
      "pnl_pct": 1.8,
      "win_rate": 35,
      "trades": 17,
      "cadence_per_month": 2.8,
      "max_dd_pct": 13.9,
      "buy_hold_pct": -10.8
    },
    "spec": {
      "name": "MACD Classic",
      "indicator": "macd",
      "params": {
        "fast": 12,
        "slow": 40,
        "signal": 9
      },
      "filters": [
        {
          "type": "atr_regime",
          "max_ratio": 1.4
        },
        {
          "type": "rsi_band",
          "period": 10,
          "lo": 45.8,
          "hi": 65.0
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 2.2,
        "sl_kind": "atr",
        "sl": 1.8,
        "atr_period": 14,
        "max_bars": 24,
        "cooldown_bars": 10
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "long"
    }
  },
  {
    "id": 35,
    "title": "WILLIAMS_R BTC 1d long-only (cross-asset from SPY)",
    "asset": "BTC",
    "timeframe": "1d",
    "side": "long",
    "holdout": {
      "sharpe": 0.01,
      "pnl_pct": 0.2,
      "win_rate": 50,
      "trades": 6,
      "cadence_per_month": 0.7,
      "max_dd_pct": 17.6,
      "buy_hold_pct": -32.4
    },
    "spec": {
      "name": "Williams %R Reversal",
      "indicator": "williams_r",
      "params": {
        "period": 14,
        "oversold": -85,
        "overbought": -1
      },
      "filters": [
        {
          "type": "rsi_band",
          "period": 2,
          "lo": 2,
          "hi": 98
        }
      ],
      "exit": {
        "tp_kind": "atr",
        "tp": 1.5,
        "sl_kind": "atr",
        "sl": 2.0,
        "atr_period": 14,
        "max_bars": 30,
        "cooldown_bars": 4
      },
      "fees_pct_per_leg": 0.05,
      "side_only": "long"
    }
  }
];
