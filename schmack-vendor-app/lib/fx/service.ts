import { db } from "@/lib/db";
const FX_API_BASE = "https://api.exchangerate.host/convert";
const MAX_CACHE_AGE_MS = 1000 * 60 * 60 * 6;
export async function getFxRate(baseCurrency: string, quoteCurrency: string) {
  if (baseCurrency === quoteCurrency) return 1;
  const cached = await db.exchangeRateCache.findUnique({ where: { baseCurrency_quoteCurrency: { baseCurrency, quoteCurrency } } });
  if (cached) {
    const age = Date.now() - new Date(cached.fetchedAt).getTime();
    if (age < MAX_CACHE_AGE_MS) return Number(cached.rate);
  }
  try {
    const response = await fetch(`${FX_API_BASE}?from=${baseCurrency}&to=${quoteCurrency}`, { next: { revalidate: 60 * 60 } });
    const data = await response.json();
    const rate = Number(data?.result ?? 1);
    await db.exchangeRateCache.upsert({
      where: { baseCurrency_quoteCurrency: { baseCurrency, quoteCurrency } },
      update: { rate, fetchedAt: new Date() },
      create: { baseCurrency, quoteCurrency, rate },
    });
    return rate;
  } catch {
    return cached ? Number(cached.rate) : 1;
  }
}
