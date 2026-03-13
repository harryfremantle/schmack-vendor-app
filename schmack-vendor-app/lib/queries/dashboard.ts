import { db } from "@/lib/db";
import { getNativeAnnualCost, getNativeMonthlyCost, convertAmount, getSeatStats } from "@/lib/calculations/costs";
import { getFxRate } from "@/lib/fx/service";
export async function getDashboardData(reportingCurrency = "EUR") {
  const vendors = await db.vendor.findMany({ where: { status: "ACTIVE" }, include: { tags: { include: { tag: true } }, owner: true, assignments: true }, orderBy: { name: "asc" } });
  const rows = await Promise.all(vendors.map(async (vendor) => {
    const fx = await getFxRate(vendor.nativeCurrency, reportingCurrency);
    const nativeMonthly = getNativeMonthlyCost(vendor);
    const nativeAnnual = getNativeAnnualCost(vendor);
    const normalizedMonthly = convertAmount(nativeMonthly, fx);
    const normalizedAnnual = convertAmount(nativeAnnual, fx);
    return { ...vendor, nativeMonthly, nativeAnnual, normalizedMonthly, normalizedAnnual, seatStats: getSeatStats(vendor) };
  }));
  const totals = rows.reduce((acc, row) => ({ monthly: acc.monthly + row.normalizedMonthly, annual: acc.annual + row.normalizedAnnual }), { monthly: 0, annual: 0 });
  return { rows, totals, reportingCurrency };
}
