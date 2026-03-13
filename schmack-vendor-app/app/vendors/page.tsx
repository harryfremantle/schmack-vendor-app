export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";
import { getNativeAnnualCost, getNativeMonthlyCost, getSeatStats } from "@/lib/calculations/costs";
import { formatDate, formatMoney } from "@/lib/format";
import { VendorsTable } from "@/components/tables/vendors-table";
export default async function VendorsPage() {
  const vendors = await db.vendor.findMany({ include: { owner: true, tags: { include: { tag: true } }, assignments: true }, orderBy: { name: "asc" } });
  const rows = vendors.map((vendor) => { const seats = getSeatStats(vendor); return { id: vendor.id, name: vendor.name, tags: vendor.tags.map((t) => t.tag.name), owner: vendor.owner?.name ?? "—", billing: `${vendor.billingType} / ${vendor.billingCadence}`, currency: vendor.nativeCurrency, monthly: formatMoney(getNativeMonthlyCost(vendor), vendor.nativeCurrency), annual: formatMoney(getNativeAnnualCost(vendor), vendor.nativeCurrency), renewalDate: formatDate(vendor.renewalDate), seats: `${seats.seatsAssigned}/${seats.seatsPurchased}` }; });
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-semibold">Vendors</h2><p className="text-sm text-slate-500">Track software vendors, costs, renewals, and seat usage.</p></div><Link href="/vendors/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Add Vendor</Link></div><VendorsTable data={rows} /></div>;
}
