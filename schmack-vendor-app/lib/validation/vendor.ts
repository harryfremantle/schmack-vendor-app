import { z } from "zod";
export const vendorSchema = z.object({
  name: z.string().min(2), description: z.string().optional(), ownerId: z.string().optional(), tagIds: z.array(z.string()).default([]),
  billingType: z.enum(["FIXED", "PER_SEAT"]), billingCadence: z.enum(["MONTHLY", "ANNUAL"]), nativeCurrency: z.string().min(3).max(3),
  fixedAmount: z.number().nonnegative().optional(), seatPrice: z.number().nonnegative().optional(), seatsPurchased: z.number().int().nonnegative().optional(),
  renewalDate: z.string().optional(), allocationMode: z.enum(["NONE", "EQUAL_SPLIT"]), status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE")
}).superRefine((data, ctx) => {
  if (data.billingType === "FIXED" && data.fixedAmount == null) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["fixedAmount"], message: "Fixed-cost vendors require a recurring amount." });
  if (data.billingType === "PER_SEAT") {
    if (data.seatPrice == null || Number.isNaN(data.seatPrice)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["seatPrice"], message: "Per-seat vendors require a seat price." });
    if (data.seatsPurchased == null || Number.isNaN(data.seatsPurchased)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["seatsPurchased"], message: "Per-seat vendors require seats purchased." });
  }
});
