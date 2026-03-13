import { VendorForm } from "@/components/forms/vendor-form";
import { db } from "@/lib/db";
export default async function NewVendorPage() {
  const [owners, tags] = await Promise.all([
    db.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.vendorTag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
  ]);
  return <div className="space-y-6"><div><h2 className="text-2xl font-semibold">Add Vendor</h2><p className="text-sm text-slate-500">Create a new vendor record.</p></div><div className="rounded-2xl border bg-white p-6"><VendorForm owners={owners} tags={tags} /></div></div>;
}
