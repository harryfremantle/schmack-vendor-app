import { notFound } from "next/navigation";
import { VendorForm } from "@/components/forms/vendor-form";
import { db } from "@/lib/db";
export default async function EditVendorPage({ params }: { params: { id: string } }) {
  const [vendor, owners, tags] = await Promise.all([
    db.vendor.findUnique({ where: { id: params.id }, include: { tags: true } }),
    db.employee.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.vendorTag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
  ]);
  if (!vendor) notFound();
  return <div className="space-y-6"><div><h2 className="text-2xl font-semibold">Edit Vendor</h2><p className="text-sm text-slate-500">Update vendor details and billing logic.</p></div><div className="rounded-2xl border bg-white p-6"><VendorForm vendor={{ id: vendor.id, name: vendor.name, description: vendor.description ?? "", ownerId: vendor.ownerId ?? "", tagIds: vendor.tags.map((tag) => tag.tagId), billingType: vendor.billingType, billingCadence: vendor.billingCadence, nativeCurrency: vendor.nativeCurrency, fixedAmount: vendor.fixedAmount ? Number(vendor.fixedAmount) : undefined, seatPrice: vendor.seatPrice ? Number(vendor.seatPrice) : undefined, seatsPurchased: vendor.seatsPurchased ?? undefined, renewalDate: vendor.renewalDate ? vendor.renewalDate.toISOString().slice(0, 10) : "", allocationMode: vendor.allocationMode, status: vendor.status }} owners={owners} tags={tags} /></div></div>;
}
