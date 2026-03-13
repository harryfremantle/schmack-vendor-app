import { AllocationMode, AssignmentStatus, BillingCadence, BillingType, Vendor } from "@prisma/client";
export type VendorWithAssignments = Vendor & { assignments?: { status: AssignmentStatus }[] };
export function getNativeMonthlyCost(vendor: Vendor) {
  if (vendor.billingType === BillingType.FIXED) {
    const amount = Number(vendor.fixedAmount ?? 0);
    return vendor.billingCadence === BillingCadence.MONTHLY ? amount : amount / 12;
  }
  const seatPrice = Number(vendor.seatPrice ?? 0);
  const seats = vendor.seatsPurchased ?? 0;
  const total = seatPrice * seats;
  return vendor.billingCadence === BillingCadence.MONTHLY ? total : total / 12;
}
export function getNativeAnnualCost(vendor: Vendor) {
  if (vendor.billingType === BillingType.FIXED) {
    const amount = Number(vendor.fixedAmount ?? 0);
    return vendor.billingCadence === BillingCadence.ANNUAL ? amount : amount * 12;
  }
  const seatPrice = Number(vendor.seatPrice ?? 0);
  const seats = vendor.seatsPurchased ?? 0;
  const total = seatPrice * seats;
  return vendor.billingCadence === BillingCadence.ANNUAL ? total : total * 12;
}
export function convertAmount(amount: number, rate: number) { return amount * rate; }
export function getSeatStats(vendor: VendorWithAssignments) {
  const seatsPurchased = vendor.seatsPurchased ?? 0;
  const seatsAssigned = (vendor.assignments ?? []).filter((a) => a.status === AssignmentStatus.ACTIVE).length;
  const seatsRemaining = seatsPurchased - seatsAssigned;
  const seatOverage = Math.max(seatsAssigned - seatsPurchased, 0);
  return { seatsPurchased, seatsAssigned, seatsRemaining, seatOverage };
}
export function getPerAssignedUserMonthlyCost(vendor: VendorWithAssignments, normalizedMonthlyCost: number) {
  const activeCount = (vendor.assignments ?? []).filter((a) => a.status === AssignmentStatus.ACTIVE).length;
  if (activeCount === 0) return 0;
  if (vendor.billingType === BillingType.PER_SEAT) return normalizedMonthlyCost / activeCount;
  if (vendor.allocationMode === AllocationMode.EQUAL_SPLIT) return normalizedMonthlyCost / activeCount;
  return 0;
}
