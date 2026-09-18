import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Currency = "JPY" | "USD" | "AUD" | "GBP" | "TWD" | "EUR";
type RateStatus = "loading" | "live" | "cached" | "unavailable";

export interface CurrencyMeta {
  code: Currency;
  symbol: string;
  label: string;
}

// Ordered for display. Add new currencies here — everything else (rates,
// formatting, selector UI) picks them up automatically.
export const CURRENCIES: CurrencyMeta[] = [
  { code: "JPY", symbol: "¥", label: "JPY (¥)" },
  { code: "USD", symbol: "US$", label: "USD (US$)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "TWD", symbol: "NT$", label: "TWD (NT$)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
];

const SYMBOLS: Record<Currency, string> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c.symbol])
) as Record<Currency, string>;

interface RateCache {
  rates: Record<string, number>; // <currency code> -> units per 1 JPY
  updatedAt: string; // ISO date the rate was fetched
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<string, number> | null; // units per 1 JPY, keyed by currency code
  rateStatus: RateStatus;
  rateUpdatedAt: string | null;
  /** Converts a JPY amount into `currency` (or a given target). Returns null if no rate is available yet. */
  convertFromJPY: (jpy: number, target?: Currency) => number | null;
  formatAmount: (value: number, currency: Currency) => string;
}

const CURRENCY_STORAGE_KEY = "yh_currency";
const RATE_CACHE_KEY = "yh_exchange_rate_cache_v2";
const RATE_ENDPOINT = "https://open.er-api.com/v6/latest/JPY";
const FETCH_TIMEOUT_MS = 6000;

function formatAmount(value: number, currency: Currency): string {
  return `${SYMBOLS[currency]}${Math.round(value).toLocaleString("en-US")}`;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "JPY",
  setCurrency: () => {},
  rates: null,
  rateStatus: "loading",
  rateUpdatedAt: null,
  convertFromJPY: () => null,
  formatAmount,
});

function readRateCache(): RateCache | null {
  try {
    const raw = localStorage.getItem(RATE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.rates === "object" && typeof parsed.updatedAt === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeRateCache(cache: RateCache) {
  try {
    localStorage.setItem(RATE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — safe to ignore
  }
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("JPY");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [rateUpdatedAt, setRateUpdatedAt] = useState<string | null>(null);
  const [rateStatus, setRateStatus] = useState<RateStatus>("loading");

  // Restore saved currency preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency | null;
      if (saved && CURRENCIES.some((c) => c.code === saved)) setCurrencyState(saved);
    } catch {
      // ignore
    }
  }, []);

  // Load cached rates immediately, then attempt a fresh fetch (once, shared app-wide)
  useEffect(() => {
    const cached = readRateCache();
    if (cached) {
      setRates(cached.rates);
      setRateUpdatedAt(cached.updatedAt);
      setRateStatus("cached");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    fetch(RATE_ENDPOINT, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Exchange rate request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.result !== "success" || typeof data?.rates !== "object") {
          throw new Error("Malformed exchange rate response");
        }
        const nextRates: Record<string, number> = { JPY: 1 };
        for (const { code } of CURRENCIES) {
          if (typeof data.rates[code] === "number") nextRates[code] = data.rates[code];
        }
        const updatedAt = new Date().toISOString().slice(0, 10);
        setRates(nextRates);
        setRateUpdatedAt(updatedAt);
        setRateStatus("live");
        writeRateCache({ rates: nextRates, updatedAt });
      })
      .catch(() => {
        // Network error, timeout, rate limit, or bad payload: fall back silently.
        setRateStatus(cached ? "cached" : "unavailable");
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    } catch {
      // ignore
    }
  };

  const value = useMemo<CurrencyContextType>(() => {
    const convertFromJPY = (jpy: number, target: Currency = currency) => {
      if (target === "JPY") return jpy;
      const r = rates?.[target];
      return typeof r === "number" ? jpy * r : null;
    };
    return {
      currency,
      setCurrency,
      rates,
      rateStatus,
      rateUpdatedAt,
      convertFromJPY,
      formatAmount,
    };
  }, [currency, rates, rateStatus, rateUpdatedAt]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
