import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
export default async function RenewalsPage() {
  const vendors = await db.vendor.findMany({ where: { status: "ACTIVE", renewalDate: { not: null } }, include: { owner: true }, orderBy: { renewalDate: "asc" } });
  return <div className="space-y-6"><div><h2 className="text-2xl font-semibold">Renewals</h2><p className="text-sm text-slate-500">Keep track of upcoming renewal dates across vendors.</p></div><div className="rounded-2xl border bg-white p-4"><table className="min-w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="pb-3">Vendor</th><th className="pb-3">Owner</th><th className="pb-3">Renewal Date</th></tr></thead><tbody>{vendors.map((vendor) => <tr key={vendor.id} className="border-b last:border-0"><td className="py-3 font-medium">{vendor.name}</td><td className="py-3">{vendor.owner?.name ?? "—"}</td><td className="py-3">{formatDate(vendor.renewalDate)}</td></tr>)}</tbody></table></div></div>;
}
