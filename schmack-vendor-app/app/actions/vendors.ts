"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { vendorSchema } from "@/lib/validation/vendor";
export async function createVendor(input: unknown) {
  const parsed = vendorSchema.parse(input);
  const vendor = await db.vendor.create({ data: { name: parsed.name, description: parsed.description, ownerId: parsed.ownerId || null, billingType: parsed.billingType, billingCadence: parsed.billingCadence, nativeCurrency: parsed.nativeCurrency.toUpperCase(), fixedAmount: parsed.fixedAmount, seatPrice: parsed.seatPrice, seatsPurchased: parsed.seatsPurchased, renewalDate: parsed.renewalDate ? new Date(parsed.renewalDate) : null, allocationMode: parsed.allocationMode, status: parsed.status, tags: { create: parsed.tagIds.map((tagId) => ({ tagId })) } } });
  revalidatePath("/vendors"); revalidatePath("/dashboard"); return vendor;
}
export async function updateVendor(id: string, input: unknown) {
  const parsed = vendorSchema.parse(input);
  await db.vendorTagOnVendor.deleteMany({ where: { vendorId: id } });
  const vendor = await db.vendor.update({ where: { id }, data: { name: parsed.name, description: parsed.description, ownerId: parsed.ownerId || null, billingType: parsed.billingType, billingCadence: parsed.billingCadence, nativeCurrency: parsed.nativeCurrency.toUpperCase(), fixedAmount: parsed.billingType === "FIXED" ? parsed.fixedAmount : null, seatPrice: parsed.billingType === "PER_SEAT" ? parsed.seatPrice : null, seatsPurchased: parsed.billingType === "PER_SEAT" ? parsed.seatsPurchased : parsed.seatsPurchased ?? null, renewalDate: parsed.renewalDate ? new Date(parsed.renewalDate) : null, allocationMode: parsed.allocationMode, status: parsed.status, tags: { create: parsed.tagIds.map((tagId) => ({ tagId })) } } });
  revalidatePath("/vendors"); revalidatePath(`/vendors/${id}`); revalidatePath("/dashboard"); revalidatePath("/renewals"); return vendor;
}
export async function archiveVendor(id: string) { await db.vendor.update({ where: { id }, data: { status: "ARCHIVED" } }); revalidatePath("/vendors"); revalidatePath("/dashboard"); }
